import { Editor } from "./editor";

var ObjectEditor: Editor | null = null;

export class ContextMenu {

    Element: HTMLElement;

    Visibile: boolean = false;

    constructor() {
        this.Element = document.createElement("div");
        this.Element.id = "contextmenu";
    }

    Show(x: number, y: number) {

        this.Element.style.left = `${x}px`;
        this.Element.style.top = `${y}px`;

        if (this.Visibile) {
            return;
        }

        this.Element.replaceChildren();

        document.body.appendChild(this.Element);

        let OEOption = document.createElement("div");
        OEOption.innerText = "Object Editor";
        OEOption.addEventListener("click", (e) => {
            this.ShowObjectEditor();
            this.Hide();
        });

        this.Element.appendChild(OEOption);
        this.Visibile = true;
    }

    ShowObjectEditor() {

        if (!ObjectEditor) {
            ObjectEditor = new Editor("objecteditor", []);
        }

        ObjectEditor.Show();
    }

    Hide() {

        if (!this.Visibile) {
            return;
        }

        this.Element.remove();

        this.Visibile = false;
    }
}