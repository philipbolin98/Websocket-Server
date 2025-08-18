using System.Diagnostics;
using System.Net.WebSockets;
using System.Text;
using System.Text.Json.Nodes;
using System.Text.Json.Serialization;
using static Server.ClientFunctionHandlers;

namespace Server {
    internal class Client {

        public WebSocket Socket;

        public string Id;

        public Thread Thread;

        public CancellationTokenSource TokenSource = new();

        public Client(WebSocket socket) {
            Socket = socket;
            Id = Guid.NewGuid().ToString();

            Thread = new(new ThreadStart(ListenForSocketRequests));
            Thread.Start();
        }

        public async void ListenForSocketRequests() {
            while (Socket.State == WebSocketState.Open && !TokenSource.IsCancellationRequested) {
                try {

                    string message = await ReceiveMessage();

                    if (message == "") {
                        continue;
                    }

                    string response = await GetResponse(message);

                    if (response == "") {
                        continue;
                    }

                    await SendMessage(response);

                } catch (Exception ex) {
                    Debug.Write(ex.Message);
                }
            }

            await CloseClient();
        }

        public static async Task<string> GetResponse(string message) {
            try {

                var data = System.Text.Json.JsonSerializer.Deserialize<SocketRequest>(message);

                if (data == null) {
                    return "";
                }

                var ReturnValue = await FunctionRouter.DispatchAsync(data.FunctionName, data.Parameters);
                SocketResponse response = new(data.FunctionName, data.Index, ReturnValue);

                return System.Text.Json.JsonSerializer.Serialize(response);

            } catch (Exception ex) {
                Debug.WriteLine(ex.Message);
                return "";
            }
        }

        public async Task<string> ReceiveMessage() {
            try {

                byte[] buffer = new byte[4096];
                byte[] bytes = [];
                WebSocketReceiveResult result;

                do {

                    result = await Socket.ReceiveAsync(buffer, TokenSource.Token);

                    if (result.MessageType == WebSocketMessageType.Close) {
                        //await CancellationToken.CancelAsync();
                        return "";
                    }

                    int index = bytes.Length;
                    int count = result.Count;

                    Array.Resize(ref bytes, index + count);
                    Array.Copy(buffer, 0, bytes, index, result.Count);

                } while (!result.EndOfMessage);

                string message = Encoding.UTF8.GetString(bytes);
                return message;

            } catch (Exception ex) {
                Debug.Write(ex.Message);
                return "";
            }
        }

        public async Task SendMessage(string message) {
            try {

                byte[] bytes = Encoding.UTF8.GetBytes(message);
                await Socket.SendAsync(bytes, WebSocketMessageType.Text, true, TokenSource.Token);

            } catch (Exception ex) {
                Debug.Write(ex.Message);
            }
        }

        public async Task CloseClient() {

            if (Socket.State == WebSocketState.Open) {
                await Socket.CloseAsync(WebSocketCloseStatus.NormalClosure, null, TokenSource.Token);
            } else {
                await Socket.CloseOutputAsync(WebSocketCloseStatus.NormalClosure, null, CancellationToken.None);
            }

            Global.WebServer?.Clients.Remove(Id);
        }
    }

    public class SocketRequest {
        public string FunctionName { get; set; } = "";
        public int Index { get; set; } = -1;
        public object[] Parameters { get; set; } = [];
    }

    public class SocketResponse {
        public string FunctionName { get; set; }
        public int Index { get; set; } = -1;
        public Result<object?> Result { get; set; }

        public SocketResponse(string functionName, int index, Result<object?> result) { 
            this.FunctionName = functionName;
            this.Index = index;
            this.Result = result;
        }
    }
}