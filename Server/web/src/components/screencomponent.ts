import { Component } from "./component";

export class ScreenComponent extends Component {

    Element: HTMLElement;

    X: number;
    Y: number;
    Width: number;
    Height: number;
    Visible: boolean;

    constructor(id: number, name: string, x: number, y: number, width: number, height: number, visible: boolean, parentId?: number) {
        super(id, name, parentId);
        this.X = x;
        this.Y = y;
        this.Width = width;
        this.Height = height;
        this.Visible = visible;

        this.Element = document.createElement("div");
    }
}