class ContextMenu {

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

        let CEOption = document.createElement("div");
        CEOption.innerText = "Component Editor";
        CEOption.addEventListener("click", (e) => {
            ShowComponentEditor();
            this.Hide();
        });

        let OEOption = document.createElement("div");
        OEOption.innerText = "Object Editor";
        OEOption.addEventListener("click", (e) => {
            ShowObjectEditor();
            this.Hide();
        });

        this.Element.appendChild(CEOption);
        this.Element.appendChild(OEOption);

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