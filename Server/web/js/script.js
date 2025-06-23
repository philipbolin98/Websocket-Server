var Socket;
function CreateWebSocket() {
    Socket = new WebSocket("ws://".concat(window.location.host, "/"));
    Socket.addEventListener("open", function (e) {
        console.log("open");
    });
    Socket.addEventListener("close", function (e) {
        console.log("close");
    });
    Socket.addEventListener("message", function (e) {
        console.log(e.data);
    });
    Socket.addEventListener("error", function (e) {
        console.log("error");
    });
}
function SendWebSocketRequest(message) {
    Socket.send(message);
}
function AddEvents() {
    var text = document.getElementById("text");
    text.addEventListener("keyup", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            SendWebSocketRequest(text.value);
        }
    });
}
CreateWebSocket();
AddEvents();
//# sourceMappingURL=script.js.map