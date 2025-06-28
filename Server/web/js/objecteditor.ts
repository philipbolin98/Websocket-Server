class ObjectEditor {

    Element: HTMLElement;

    Header: HTMLElement;
    
    CloseButton: HTMLElement;

    BodyElement: HTMLElement;

    TreeElement: HTMLElement;

    ResizerElement: HTMLElement;

    TableElement: HTMLElement;

    Visible: boolean = false;

    PointerMoveEvent: (e: PointerEvent) => void;

    constructor() {

        this.Element = document.createElement("div")
        this.Element.id = "objecteditor";

        this.Header = document.createElement("div");
        this.Header.classList.add("header");

        this.CloseButton = document.createElement("div");
        this.CloseButton.classList.add("closebutton");
        this.CloseButton.innerText = "X";

        this.BodyElement = document.createElement("div");
        this.BodyElement.classList.add("body");

        this.TreeElement = document.createElement("div");
        this.TreeElement.classList.add("tree");
        this.TreeElement.style.width = "200px";

        this.ResizerElement = document.createElement("div");
        this.ResizerElement.classList.add("resizer");

        this.TableElement = document.createElement("div");
        this.TableElement.classList.add("table");

        this.Header.appendChild(this.CloseButton);
        this.Element.appendChild(this.Header);

        this.BodyElement.appendChild(this.TreeElement);
        this.BodyElement.appendChild(this.ResizerElement);
        this.BodyElement.appendChild(this.TableElement);

        this.Element.appendChild(this.BodyElement);

        this.Element.style.left = "500px";
        this.Element.style.top = "500px";

        this.AddEvents();
    }

    Show() {

        if (this.Visible) {
            return;
        }

        MainElement?.appendChild(this.Element);
        this.Visible = true;
    }

    Hide() {

        if (!this.Visible) {
            return;
        }

        this.Element.remove();

        this.Visible = false;
    }

    AddEvents() {
        this.CloseButton.addEventListener("click", () => {
            this.Hide();
        });

        this.Header.addEventListener("pointerdown", (e: PointerEvent) => {

            let dx = e.clientX - parseInt(this.Element.style.left);
            let dy = e.clientY - parseInt(this.Element.style.top);

            document.addEventListener("pointermove", this.PointerMoveEvent = (e: PointerEvent) => {
                this.Element.style.left = `${e.clientX - dx}px`;
                this.Element.style.top = `${e.clientY - dy}px`;
            });

            document.addEventListener("pointerup", (e) => {

                document.removeEventListener("pointermove", this.PointerMoveEvent);
                this.PointerMoveEvent = null;

            }, { once: true });
        });

        this.ResizerElement.addEventListener("pointerdown", (e: PointerEvent) => {

            let startX = e.clientX;
            let startLeft = parseInt(this.TreeElement.style.width);

            document.addEventListener("pointermove", this.PointerMoveEvent = (e: PointerEvent) => {
                this.TreeElement.style.width = `${startLeft + (e.clientX - startX)}px`;
            });

            document.addEventListener("pointerup", (e) => {

                document.removeEventListener("pointermove", this.PointerMoveEvent);
                this.PointerMoveEvent = null;

            }, { once: true });
        });
    }
}