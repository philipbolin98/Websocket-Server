import { SocketRequest } from "../models/socketrequest";
import { SocketResponse } from "../models/socketresponse";
import { ClientFunctionHandlers } from "../clientfunctionhandlers";

let Socket: WebSocket;
var MessageIndex: number = 0;
var MessageMap: Map<number, any> = new Map();

export function initWebSocket(url: string) {
    Socket = new WebSocket(url);
}

export function SendWebSocketRequest(functionName: string, params: any[] = [], storage: any[] = []): void {

    let index = MessageIndex;
    MessageIndex++;

    let data = new SocketRequest(functionName, index, params);

    let message: string = JSON.stringify(data);

    MessageMap.set(index, storage);

    Socket.send(message);
}

export function HandleWebSocketResponse(message: string) {

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