export class SocketRequest {

    FunctionName: string;
    Index: number;
    Parameters: object[];

    constructor(functionName: string, index: number, params: object[] = []) {
        this.FunctionName = functionName;
        this.Index = index;
        this.Parameters = params;
    }
}