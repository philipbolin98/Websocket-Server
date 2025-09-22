using Server.Components;

namespace Server {
    public static class ServerLaunch {

        public static void LaunchServer() {

            FunctionRouter.Initialize();

            ComponentFactory.Initialize();

            Global.WebServer = new();
        }
    }
}