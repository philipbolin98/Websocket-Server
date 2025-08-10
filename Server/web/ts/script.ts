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

function SendWebSocketRequest(functionName: string, params: any[] = []): void {

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

    let functionName: string = response.FunctionName;
    let data = result.Data;

    (ClientFunctionHandlers as any)[functionName](data);
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

function AddEvents(): void {

    document.addEventListener("contextmenu", (e: MouseEvent) => {
        ShowContextMenu(e);
        return false;
    });

    MainElement?.addEventListener("pointerdown", (e: PointerEvent) => {
        HideContextMenu(e);
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