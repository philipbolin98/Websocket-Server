import { SocketRequest } from "../models/socketrequest";
import { SocketResponse } from "../models/socketresponse";
import { ClientFunctionHandlers } from "../clientfunctionhandlers";

export class ClientSocket {

    Socket: WebSocket;
    MessageIndex: number = 0;
    MessageMap: Map<number, any> = new Map();

    constructor(url: string) {
        this.Socket = new WebSocket(url);
        this.AddEvents();
    }

    AddEvents() {

        this.Socket.addEventListener("message", (e: MessageEvent) => {
            this.HandleWebSocketResponse(e.data);
        });
    }

    SendWebSocketRequest(functionName: string, params: any[] = [], storage: any[] = []): void {

        let index = this.MessageIndex;
        this.MessageIndex++;

        let data = new SocketRequest(functionName, index, params);

        let message: string = JSON.stringify(data);

        this.MessageMap.set(index, storage);

        this.Socket.send(message);
    }

    HandleWebSocketResponse(message: string) {

        let response = JSON.parse(message) as SocketResponse<string>;

        let result = response.Result;

        if (!result.Success) {
            console.error(result.Message);
            return;
        }

        let functionName: string = response.FunctionName;
        let data = result.Data;

        let index = response.Index;

        let storage = this.MessageMap.get(index);
        this.MessageMap.delete(index);

        (ClientFunctionHandlers as any)[functionName](data, storage);
    }
}

export const socket = new ClientSocket(`ws://${window.location.host}/`);