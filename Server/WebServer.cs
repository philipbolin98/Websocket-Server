using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Net.WebSockets;
using System.Threading;
using System.Threading.Tasks;

namespace Server {
    internal class WebServer {

        public static string[] IPAddresses = ["localhost"];

        const int HttpPort = 80;

        const int HttpsPort = 443;

        const int TestPort = 8080;

        public bool Running = true;

        public Dictionary<string, string> MimeTypes = [];

        public Dictionary<string, Client> Clients = [];

        public HttpListener Listener = new();

        public Thread ListenerThread;

        public WebServer() {

            AddMimeTypes();

            foreach (string ip in IPAddresses) {
                Listener.Prefixes.Add($"http://{ip}:{TestPort}/");
            }

            Listener.Start();

            ListenerThread = new(new ThreadStart(ListenForHttpRequests));
            ListenerThread.Start();
        }

        private void AddMimeTypes() {
            MimeTypes.Add("html", "text/html");
            MimeTypes.Add("css", "text/css");
            MimeTypes.Add("js", "text/javascript");
            MimeTypes.Add("map", "application/json");
            MimeTypes.Add("ico", "image/vnd.microsoft.icon");
        }

        private async void ListenForHttpRequests() {
            while (Running) {
                try {

                    HttpListenerContext context = await Listener.GetContextAsync();

                    if (context.Request.IsWebSocketRequest) {
                        await ProcessWebSocketRequest(context);
                    } else {
                        await ProcessHttpRequest(context);
                    }

                } catch (Exception ex) {
                    Debug.WriteLine(ex.Message);
                }
            }
        }

        private async Task ProcessWebSocketRequest(HttpListenerContext context) {

            HttpListenerWebSocketContext websocketContext = await context.AcceptWebSocketAsync(null);
            WebSocket socket = websocketContext.WebSocket;

            Client client = new(socket);
            Clients.Add(client.Id, client);
        }

        private async Task ProcessHttpRequest(HttpListenerContext context) {

            switch (context.Request.HttpMethod) {

                case WebRequestMethods.Http.Get:
                    await ProcessGetRequest(context);
                    break;

                case WebRequestMethods.Http.Head:
                    break;

                case WebRequestMethods.Http.Post:
                    break;

                case WebRequestMethods.Http.Put:
                    break;

                default:
                    break;
            }
        }

        private async Task ProcessGetRequest(HttpListenerContext context) {

            HttpListenerRequest request = context.Request;
            HttpListenerResponse response = context.Response;

            string? url = request.RawUrl;

            if (url == null) {
                response.StatusCode = (int)HttpStatusCode.BadRequest;
                response.Close();
                return;
            }

            url = url.Replace("/", "\\");

            if (url == "\\") {
                url = "\\index.html";
            }

            string path = $"{Global.WebFolderPath}{url}";

            if (!File.Exists(path)) {
                response.StatusCode = (int)HttpStatusCode.NotFound;
                response.Close();
                return;
            }

            string extension = path.Substring(path.LastIndexOf(".") + 1);
            string contentType = MimeTypes.TryGetValue(extension, out string? value) ? value : "application/octet-stream";
            byte[] bytes = await File.ReadAllBytesAsync(path);

            response.ContentType = contentType;
            response.ContentLength64 = bytes.Length;
            response.StatusCode = (int)HttpStatusCode.OK;

            response.Close(bytes, false);
        }
    }
}