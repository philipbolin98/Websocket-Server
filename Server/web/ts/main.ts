//import.meta.glob("./components/*.ts", { eager: true });

var Socket: WebSocket;
var MainElement: HTMLElement | null = document.getElementById("main");
var ContextMenuObject: ContextMenu | null = null;
var ComponentEditor: Editor | null = null;
var ObjectEditor: Editor | null = null;

var MessageIndex: number = 0;
var MessageMap: Map<number, any> = new Map();

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

function SendWebSocketRequest(functionName: string, params: any[] = [], storage: any[] = []): void {

    let index = MessageIndex;
    MessageIndex++;

    let data = new SocketRequest(functionName, index, params);

    let message: string = JSON.stringify(data);

    MessageMap.set(index, storage);

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

    let index = response.Index;

    let storage = MessageMap.get(index);
    MessageMap.delete(index);

    (ClientFunctionHandlers as any)[functionName](data, storage);
}

class SocketRequest {

    FunctionName: string;
    Index: number;
    Parameters: object[];

    constructor(functionName: string, index: number, params: object[] = []) {
        this.FunctionName = functionName;
        this.Index = index;
        this.Parameters = params;
    }
}

class SocketResponse<T> {
    FunctionName: string = "";
    Index: number = -1;
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