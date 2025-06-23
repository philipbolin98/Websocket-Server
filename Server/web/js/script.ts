var Socket: WebSocket;
var MainElement: HTMLElement | null = document.getElementById("Main");

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
    let text: HTMLTextAreaElement = document.getElementById("text") as HTMLTextAreaElement;

    text.addEventListener("keyup", (e: KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            SendWebSocketRequest(text.value);
        }
    });

    document.addEventListener("contextmenu", (e: MouseEvent) => {
        console.log("context menu");
        e.preventDefault();
        return false;
    });
}

CreateWebSocket();
AddEvents();