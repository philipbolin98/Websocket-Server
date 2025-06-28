var Socket: WebSocket;
var MainElement: HTMLElement | null = document.getElementById("main");
var ContextMenuObject: ContextMenu | null = null;
var ObjectEditorObject: ObjectEditor | null = null;

function CreateWebSocket(): void {

    Socket = new WebSocket(`ws://${window.location.host}/`);

    Socket.addEventListener("open", (e: Event) => {
        console.log("open");
    });

    Socket.addEventListener("close", (e: CloseEvent) => {
        console.log("close");
    });

    Socket.addEventListener("message", (e: MessageEvent) => {
        console.log(e.data);
    });

    Socket.addEventListener("error", (e: Event) => {
        console.log("error");
    });
}

function SendWebSocketRequest(message: string): void {
    Socket.send(message);
}

function AddEvents(): void {

    document.addEventListener("contextmenu", (e: MouseEvent) => {
        ShowContextMenu(e);
        return false;
    });

    MainElement?.addEventListener("pointerdown", (e: PointerEvent) => {
        HideContextMenu(e);
    });

    let loginButton = document.getElementById("login");

    loginButton?.addEventListener("click", (e: MouseEvent) => {
        let usernameInput: HTMLInputElement = document.getElementById("username") as HTMLInputElement;
        let passwordInput: HTMLInputElement = document.getElementById("password") as HTMLInputElement;

        SendWebSocketRequest(`Login:${usernameInput.value},${passwordInput.value}`);
    });
}

CreateWebSocket();
AddEvents();

function ShowContextMenu(e: MouseEvent) {

    e.preventDefault();

    if (!ContextMenuObject) {
        ContextMenuObject = new ContextMenu();
    }

    ContextMenuObject.Show(e.clientX, e.clientY);
}

function HideContextMenu(e: PointerEvent) {

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