import { Result } from "../models/result";

export class SocketResponse<T> {
    FunctionName: string = "";
    Index: number = -1;
    Result!: Result<T>;
}