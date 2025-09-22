export class Result<T> {
    Success: boolean = false;
    Message: string = "";
    Data?: T;
}