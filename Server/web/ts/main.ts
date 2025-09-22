//import.meta.glob("./components/*.ts", { eager: true });

import { ClientFunctionHandlers } from "./clientfunctionhandlers";
import { Editor } from "./components/editor";
import { ContextMenu } from "./components/contextmenu";
import { SendWebSocketRequest, HandleWebSocketResponse } from "./utils/websocket";

var Socket: WebSocket;
var ContextMenuObject: ContextMenu | null = null;

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

function AddEvents(): void {

    document.addEventListener("contextmenu", (e: MouseEvent) => {
        ShowContextMenu(e);
        return false;
    });

    var MainElement: HTMLElement | null = document.getElementById("main");

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

// register RPC functions
ClientFunctionHandlers.register({
    
});