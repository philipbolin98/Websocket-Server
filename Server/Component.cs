using Microsoft.Data.SqlClient;
using System.Data;

namespace Server {
    public class Component {

        public int ID;
        public string Name;
        public OrderedDictionary<string, ComponentProp> Properties { get; set; } = [];

        public Component(int id, string name) {
            this.ID = id;
            this.Name = name;

            Global.dComponentsByName.Add(name, this);
            Global.dComponentsByID.Add(id, this);
        }

        public ComponentMini Mini(bool includeProps = false) {
            return new ComponentMini(this, includeProps);
        }

        /// <summary>
        /// Loads a component from the DB
        /// </summary>
        /// <param name="name"></param>
        /// <param name="propString"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public static Component Load(string name, int id) {
            Component component = new(id, name);
            return component;
        }

        /// <summary>
        /// Creates a new component and adds it to the DB
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        public static async Task<Component?> Create(string name) {

            name = HelperFunctions.IncrementName(name, Global.dComponentsByName.Keys.ToHashSet());

            string query = "INSERT INTO Components OUTPUT Inserted.ComponentID VALUES(@Name)";

            SqlParameter[] parameters = [
                new SqlParameter("@Name", name)
            ];

            int? id = (int?)await Database.ExecuteScalar(query, parameters);
            
            if (!id.HasValue) {
                return null;
            }

            Component component = new(id.Value, name);

            await ComponentProp.Create(component, "Name", component.Name); //Add the name prop

            return component;
        }

        public static async Task Delete(Component component) {

            int count = component.Properties.Count;

            for (int i = 0; i < count; i++) {
                await ComponentProp.Delete(component.Properties.Values.First(), true);
            }

            Global.dComponentsByName.Remove(component.Name);
            Global.dComponentsByID.Remove(component.ID);

            using DataSet dataset = new();

            string query1 = "DELETE FROM Components WHERE ComponentID = @ComponentID";

            SqlParameter[] parameters1 = [
                new SqlParameter("@ComponentID", component.ID)
            ];

            await Database.ExecuteNonQuery(query1, parameters1);

            string query2 = "DELETE FROM ComponentProps WHERE ComponentID = @ComponentID";

            SqlParameter[] parameters2 = [
                new SqlParameter("@ComponentID", component.ID)
            ];

            await Database.ExecuteNonQuery(query2, parameters2);
        }

        /// <summary>
        /// Loads all the components from the DB on server launch
        /// </summary>
        public static void LoadComponentsFromDB() {

            using DataSet dataset = new();

            string query1 = "SELECT * FROM Components";

            Database.FillDataSet(dataset, query1);

            var ComponentsTable = dataset.Tables[0];
            
            foreach (DataRow row in ComponentsTable.Rows) {
                int id = (int)row["ComponentID"];
                string name = (string)row["Name"];
                Load(name, id);
            }

            dataset.Clear();

            string query2 = "SELECT * FROM ComponentProps";

            Database.FillDataSet(dataset, query2);

            var ComponentPropsTable = dataset.Tables[0];

            foreach (DataRow row in ComponentPropsTable.Rows) {

                int id = (int)row["ComponentPropID"];
                int componentId = (int)row["ComponentID"];
                string name = (string)row["Name"];
                int index = (int)row["Index"];
                PropType propType = (PropType)row["PropType"];
                DataType dataType = (DataType)row["DataType"];
                EditType editType = (EditType)row["EditType"];
                object defaultValue = row["DefaultValue"];
                string helpText = (string)row["HelpText"];

                ComponentProp.Load(id, componentId, name, index, propType, dataType, editType, defaultValue, helpText);
            }
        }
    }

    public class ComponentMini {
        public string ID { get; set; }
        public string Name { get; set; }
        public List<ComponentPropMini> Properties { get; set; } = [];

        public ComponentMini(Component component, bool includeProps) {
            this.ID = $"c_{component.ID}";
            this.Name = component.Name;

            if (includeProps) {
                foreach (ComponentProp prop in component.Properties.Values) {
                    this.Properties.Add(prop.Mini());
                }
            }
        }
    }
}