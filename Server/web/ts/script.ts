var Socket: WebSocket;
var MainElement: HTMLElement | null = document.getElementById("main");
var ContextMenuObject: ContextMenu | null = null;
var ComponentEditor: Editor | null = null;
var ObjectEditor: Editor | null = null;

function CreateWebSocket(): void {

    Socket = new WebSocket(`ws://${window.location.host}/`);

    Socket.addEventListener("open", (e: Event) => {
        SendWebSocketRequest("GetComponents");
    });

    Socket.addEventListener("close", (e: CloseEvent) => {
        console.log("close");
    });

    Socket.addEventListener("message", (e: MessageEvent) => {
        HandleWebSocketResponse(e.data);
    });

    Socket.addEventListener("error", (e: Event) => {
        console.log("error");
    });
}

function SendWebSocketRequest(functionName: string, params: object[] = []): void {

    let data = new SocketRequest(functionName, params);

    let message: string = JSON.stringify(data);

    Socket.send(message);
}

function HandleWebSocketResponse(message: string) {

    let response = JSON.parse(message) as SocketResponse<string>;

    let result = response.Result;

    if (!result.Success) {
        console.error(result.Message);
        return;
    }

    let functionName = response.FunctionName;
    let data = result.Data;

    ClientFunctionHandler[functionName](data);
}

class SocketRequest {

    FunctionName: string;
    Parameters: object[];

    constructor(functionName: string, params: object[] = []) {
        this.FunctionName = functionName;
        this.Parameters = params;
    }
}

class SocketResponse<T> {
    FunctionName: string = "";
    Result!: Result<T>;
}

class Result<T> {
    Success: boolean = false;
    Message: string = "";
    Data?: T;
}

class ClientFunctionHandler {

    static AddComponent(data: any) {

        ComponentEditor?.Tree.AddNode(data);
    }

    static GetComponents(data: any[]) {

        if (!ComponentEditor) {
            ComponentEditor = new Editor("componenteditor", data);
        }
    }
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

function ShowComponentEditor() {

    if (!ComponentEditor) {
        ComponentEditor = new Editor("componenteditor", []);
    }

    ComponentEditor.Show();
}

function ShowObjectEditor() {

    if (!ObjectEditor) {
        ObjectEditor = new Editor("objecteditor", []);
    }

    ObjectEditor.Show();
}