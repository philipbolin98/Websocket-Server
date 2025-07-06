namespace Server {
    internal static class Global {

        public static WebServer? WebServer = null;

        public static string WorkingFolderPath = Environment.CurrentDirectory;

        public static string ProjectFolderPath = Directory.GetParent(WorkingFolderPath)!.Parent!.Parent!.FullName;

        public static string WebFolderPath = $"{ProjectFolderPath}\\web";

        public static Dictionary<string, object> dComponents = new(StringComparer.OrdinalIgnoreCase);
    }
}