using Microsoft.Data.SqlClient;

namespace Server {
    public class ComponentProp {

        public readonly int ID;
        public string Name;
        public int Index;
        public PropType PropType;
        public DataType DataType;
        public EditType EditType;
        public object DefaultValue;
        public string HelpText;
        public Component? Component;

        public ComponentProp(Component component, int ID, string name, int index, PropType propType, DataType dataType, EditType editType, object defaultValue, string helpText) {
            this.Component = component;
            this.ID = ID;
            this.Name = name;
            this.Index = index;
            this.PropType = propType;
            this.DataType = dataType;
            this.EditType = editType;
            this.DefaultValue = defaultValue;
            this.HelpText = helpText;
            this.Component.Properties.Add(Name, this);
            Global.dComponentPropsByID.Add(ID, this);
        }

        public ComponentPropMini Mini() {
            return new ComponentPropMini(this);
        }

        public static ComponentProp? Load(int ID, int ComponentID, string name, int index, PropType propType, DataType dataType, EditType editType, object defaultValue, string helpText) {

            if (!Global.dComponentsByID.TryGetValue(ComponentID, out Component? component)) {
                return null;
            }

            ComponentProp prop = new(component, ID, name, index, propType, dataType, editType, defaultValue, helpText);

            return prop;
        }

        public static async Task<ComponentProp?> Create(Component component, string name, int index, PropType propType, DataType dataType, EditType editType, object defaultValue, string helpText) {

            name = HelperFunctions.IncrementName(name, component.Properties.Keys.ToHashSet());

            string query = "INSERT INTO ComponentProps OUTPUT Inserted.ComponentPropID VALUES(@ComponentID, @Name, @Index, @PropType, @DataType, @EditType, @DefaultValue, @HelpText)";

            SqlParameter[] parameters = [
                new SqlParameter("@ComponentID", component.ID),
                new SqlParameter("@Name", name),
                new SqlParameter("@Index", index),
                new SqlParameter("@PropType", propType),
                new SqlParameter("@DataType", dataType),
                new SqlParameter("@EditType", editType),
                new SqlParameter("@DefaultValue", defaultValue.ToString()),
                new SqlParameter("@HelpText", helpText)
            ];

            int? id = (int?)await Database.ExecuteScalar(query, parameters);

            if (!id.HasValue) {
                return null;
            }

            ComponentProp prop = new(component, id.Value, name, index, propType, dataType, editType, defaultValue, helpText);
            return prop;
        }

        public void Delete() {
            Global.dComponentPropsByID.Remove(this.ID);
            this.Component?.Properties.Remove(this.Name);
            this.Component = null;
        }
    }

    public class ComponentPropMini {
        public string ID { get; set; }
        public string Name { get; set; }

        public ComponentPropMini(ComponentProp prop) {
            this.ID = $"p_{prop.ID}";
            this.Name = prop.Name;
        }
    }

    public enum PropType : byte {
        Value,
        Script,
        Method
    }

    public enum DataType : byte {
        Any,
        String,
        Number
    }

    public enum EditType : byte {
        Text,
        RichText
    }
}