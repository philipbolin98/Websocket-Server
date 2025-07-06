using Microsoft.Data.SqlClient;
using System.Data;
using System.Text.Json;

namespace Server {
    internal class Component {

        public static JsonSerializerOptions DeserializeOptions = new() {
            PropertyNameCaseInsensitive = true,
            UnmappedMemberHandling = System.Text.Json.Serialization.JsonUnmappedMemberHandling.Skip
        };

        public int ID { get; set; }
        public string Name { get; set; }
        public List<ComponentProp> Properties { get; set; }

        //public Dictionary<string, ComponentProp> Properties { get; set; } = [];

        public Component(int id, string name, List<ComponentProp> props) {
            this.ID = id;
            this.Name = name;
            this.Properties = props;
            //foreach (ComponentProp prop in props) {
            //    Properties.Add(prop.Name, prop);
            //}
        }

        /// <summary>
        /// Loads a component from the DB
        /// </summary>
        /// <param name="name"></param>
        /// <param name="propString"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public static Component? Load(string name, string propString, int id) {

            List<ComponentProp>? props = JsonSerializer.Deserialize<List<ComponentProp>>(propString, DeserializeOptions);

            if (props == null) {
                return null;
            }

            Component component = new(id, name, props);
            Global.dComponents.Add(name, component);
            return component;
        }

        /// <summary>
        /// Creates a new component and adds it to the DB
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        public static async Task<Component?> Create(string name) {

            name = IncrementName(name);

            ComponentProp prop = new() {
                Name = "Name",
                Default = name,
                Type = DataType.String
            };

            List<ComponentProp> props = [prop];

            string query = "INSERT INTO Components OUTPUT Inserted.ComponentID VALUES(@Name, @DefaultConfig)";

            string config = JsonSerializer.Serialize(props);

            SqlParameter[] parameters = [
                new SqlParameter("@Name", name),
                new SqlParameter("@DefaultConfig", config)
            ];

            int? id = (int?)await Database.ExecuteScalar(query, parameters);
            
            if (!id.HasValue) {
                return null;
            }

            Component component = new(id.Value, name, props);
            Global.dComponents.Add(name, component);
            return component;
        }

        public static string IncrementName(string name) {

            if (!Global.dComponents.ContainsKey(name)) {
                return name;
            }

            string numberString = "";

            for (int i = name.Length - 1; i >= 0; i--) {

                string character =  name[i].ToString();

                if (int.TryParse(character, out int digit)) {
                    numberString = digit.ToString() + numberString;
                } else {
                    break;
                }
            }

            string baseName = name.Substring(0, name.Length - numberString.Length);
            int number = numberString == "" ? 1 : int.Parse(numberString);

            do {
                number++;
                name = $"{baseName}{number}";
            } while (Global.dComponents.ContainsKey(name));

            return name;
        }

        /// <summary>
        /// Loads all the components from the DB on server launch
        /// </summary>
        public static void LoadComponentsFromDB() {

            string query = "SELECT * FROM Components";

            using DataTable dataTable = new();

            Database.FillDataTable(dataTable, query);

            foreach (DataRow row in dataTable.Rows) {
                int id = (int)row["ComponentID"];
                string name = (string)row["Name"];
                string defaultConfig = (string)row["DefaultConfig"];
                Load(name, defaultConfig, id);
            }
        }
    }

    internal class ComponentProp {
        public string Name { get; set; } = "";
        public DataType Type { get; set; } = DataType.Any;
        public object Default { get; set; } = "";
    }

    public enum DataType {
        Any,
        String,
        Number
    }
}