import { ObjectEditor } from "./components/contextmenu";

type Handler = (...args: any[]) => void;

export class ClientFunctionHandlers {
    private static handlers: Record<string, Handler> = {};

    static register(newHandlers: Record<string, Handler>) {
        Object.assign(this.handlers, newHandlers);
    }

    static invoke(functionName: string, ...args: any[]) {
        const fn = this.handlers[functionName];
        if (fn) {
            fn(...args);
        } else {
            console.warn(`No handler found for function: ${functionName}`);
        }
    }
}

ClientFunctionHandlers.register({
    AddComponent(data: any[]) {

    }
})