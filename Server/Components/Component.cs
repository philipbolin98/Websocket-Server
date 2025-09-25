using Microsoft.Data.SqlClient;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Server.Components {
    internal abstract class Component {

        public static JsonSerializerOptions SerializationOptions = new() {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = true
        };

        public Guid PublicID { get; set; }
        public int ID { get; set; }
        [JsonIgnore]
        public Component? Parent { get; set; } = null;
        public int? ParentID => this.Parent?.ID;
        [JsonIgnore]
        public List<Component> Children { get; set; } = [];
        public string Name { get; set; }

        public Component(string name) {
            this.Name = name;
            this.PublicID = Guid.NewGuid();
        }

        public abstract Task<int> AddToDatabaseAsync();

        protected async Task<int> AddToDatabaseCoreAsync(string subInsert, List<SqlParameter> parameters) {

            string query = $"""
                DECLARE @ComponentID int;

                INSERT INTO Components(PublicComponentID, ParentID, Name)
                VALUES(@PublicComponentID, @ParentID, @Name)
                SET @ComponentID = SCOPE_IDENTITY();

                {subInsert}

                SELECT @ComponentID;
                """;

            parameters.AddRange([
                new SqlParameter("@PublicComponentID", this.PublicID),
                new SqlParameter("@ParentID", this.ParentID),
                new SqlParameter("@Name", this.Name)
            ]);
            
            int? componentID = (int?)await Database.ExecuteScalarAsync(query, parameters);

            if (!componentID.HasValue) {
                throw new Exception("Error adding component to the database.");
            }

            return componentID.Value;
        }
    }

    internal static class ComponentFactory {

        private static readonly Dictionary<string, Func<Component>> _factories = [];

        public static void Initialize() {

            var componentBaseType = typeof(Component);
            var assembly = componentBaseType.Assembly;

            //Force load all non-abstract subclasses of Component
            var types = assembly.GetTypes().Where(t => t.IsClass && !t.IsAbstract && componentBaseType.IsAssignableFrom(t));

            foreach (var type in types) {
                //This forces the static constructor to run
                System.Runtime.CompilerServices.RuntimeHelpers.RunClassConstructor(type.TypeHandle);
            }
        }

        public static void Register<T>(Func<Component> factory) where T : Component {
            _factories.Add(typeof(T).Name, factory);
        }

        public static Component Create(string type) {
            if (_factories.TryGetValue(type, out var factory)) {
                return factory();
            }

            throw new InvalidOperationException($"No factory registered for {type}");
        }
    }
}