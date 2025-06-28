class ContextMenu {

    Element: HTMLElement;

    Visibile: boolean = false;

    constructor() {
        this.Element = document.createElement("div");
        this.Element.id = "contextmenu";
    }

    Show(x: number, y: number, options: ContextMenuOption[] = []) {

        if (this.Visibile) {
            return;
        }

        this.Element.style.left = `${x}px`;
        this.Element.style.top = `${y}px`;

        this.Element.replaceChildren();

        document.body.appendChild(this.Element);

        if (options.length === 0) { //Default context menu options
            options.push(new ContextMenuOption("Object Editor", () => { console.log("Object Editor"); }));
        }

        for (let option of options) {

            let optionEl = document.createElement("div");
            optionEl.innerText = option.Caption;
            optionEl.addEventListener("click", (e) => {
                ShowObjectEditor();
                this.Hide();
            });

            this.Element.appendChild(optionEl);
        }

        this.Visibile = true;
    }

    Hide() {

        if (!this.Visibile) {
            return;
        }

        this.Element.remove();

        this.Visibile = false;
    }
}

class ContextMenuOption {

    Caption: string;

    OnClick: Function;

    constructor(caption: string, onclick: Function) {
        this.Caption = caption;
        this.OnClick = onclick;
    }
}