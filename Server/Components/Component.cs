using System.Text.Json;
using System.Text.Json.Serialization;

namespace Server.Components {
    internal abstract class Component {

        public static JsonSerializerOptions SerializationOptions = new() {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = true
        };

        public int ID { get; set; }
        [JsonIgnore]
        public Component? Parent { get; set; } = null;
        public int? ParentID => this.Parent?.ID;
        [JsonIgnore]
        public List<Component> Children { get; set; } = [];
        public string Name { get; set; }

        public Component(string name) {
            this.Name = name;
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

    internal abstract class ScreenComponent : Component {

        public int X { get; set; }
        public int Y { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
        public bool Visibility { get; set; }

        public ScreenComponent(string name, int x, int y, int width, int height, bool visibility) : base(name) {
            this.X = x;
            this.Y = y;
            this.Width = width;
            this.Height = height;
            this.Visibility = visibility;
        }
    }

    //internal class Measurement(int value, string units) {
    //    public int Value = value;
    //    public string Units = units;
    //}
}