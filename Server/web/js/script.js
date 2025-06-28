var Socket;
var MainElement = document.getElementById("main");
var ContextMenuObject = null;
var ObjectEditorObject = null;
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
    document.addEventListener("contextmenu", function (e) {
        ShowContextMenu(e);
        return false;
    });
    MainElement === null || MainElement === void 0 ? void 0 : MainElement.addEventListener("pointerdown", function (e) {
        HideContextMenu(e);
    });
    var loginButton = document.getElementById("login");
    loginButton === null || loginButton === void 0 ? void 0 : loginButton.addEventListener("click", function (e) {
        var usernameInput = document.getElementById("username");
        var passwordInput = document.getElementById("password");
        SendWebSocketRequest("Login:".concat(usernameInput.value, ",").concat(passwordInput.value));
    });
}
CreateWebSocket();
AddEvents();
function ShowContextMenu(e) {
    e.preventDefault();
    if (!ContextMenuObject) {
        ContextMenuObject = new ContextMenu();
    }
    ContextMenuObject.Show(e.clientX, e.clientY);
}
function HideContextMenu(e) {
    if (!ContextMenuObject || e.button !== 0) {
        return;
    }
    ContextMenuObject.Hide();
}
function ShowObjectEditor() {
    if (!ObjectEditorObject) {
        ObjectEditorObject = new ObjectEditor();
    }
    ObjectEditorObject.Show();
}
//# sourceMappingURL=script.js.map