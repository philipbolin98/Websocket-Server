namespace Server {
    public static class ServerLaunch {

        public static void LaunchServer() {

            FunctionRouter.Initialize();

            Component.LoadComponentsFromDB();

            Global.WebServer = new();
        }
    }
}