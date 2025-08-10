namespace Server {
    internal static class Global {

        public static WebServer? WebServer = null;

        public static string WorkingFolderPath = Environment.CurrentDirectory;

        public static string ProjectFolderPath = Directory.GetParent(WorkingFolderPath)!.Parent!.Parent!.FullName;

        public static string WebFolderPath = $"{ProjectFolderPath}\\web";

        public static Dictionary<string, Component> dComponentsByName = new(StringComparer.OrdinalIgnoreCase);

        public static Dictionary<int, Component> dComponentsByID = [];

        public static Dictionary<int, ComponentProp> dComponentPropsByID = [];
    }
}