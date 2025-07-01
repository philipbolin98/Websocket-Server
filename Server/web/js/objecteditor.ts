class ObjectEditor {

    Element: HTMLElement;

    Header: HTMLElement;
    Menu: HTMLElement;
    
    CloseButton: HTMLElement;

    BodyElement: HTMLElement;

    Tree: Tree;

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

        let spacer = document.createElement("div");
        spacer.classList.add("spacer");

        this.Header.appendChild(spacer);
        this.Header.appendChild(this.CloseButton);

        this.Menu = document.createElement("div");
        this.Menu.classList.add("menu");

        this.BodyElement = document.createElement("div");
        this.BodyElement.classList.add("body");

        let treeData = [
            {
                name: "Applications",
                image: "",
                children: [
                    {
                        name: "App1",
                        image: "",
                        children: []
                    },
                    {
                        name: "App2",
                        image: "",
                        children: []
                    }
                ]
            },
            {
                name: "Screens",
                image: "",
                children: [
                    {
                        name: "Screen1",
                        image: "",
                        children: [
                            {
                                name: "Button1",
                                image: "",
                                children: []
                            },
                            {
                                name: "Label1",
                                image: "",
                                children: []
                            },
                            {
                                name: "Button2",
                                image: "",
                                children: []
                            },
                        ]
                    },
                    {
                        name: "Screen2",
                        image: "",
                        children: []
                    }
                ]
            },
            {
                name: "Functions",
                image: "",
                children: []
            }
        ];
        
        this.Tree = new Tree(treeData);

        this.ResizerElement = document.createElement("div");
        this.ResizerElement.classList.add("resizer");

        this.TableElement = document.createElement("div");
        this.TableElement.classList.add("table");

        this.BodyElement.appendChild(this.Tree.Element);
        this.BodyElement.appendChild(this.ResizerElement);
        this.BodyElement.appendChild(this.TableElement);

        this.Element.appendChild(this.Header);
        this.Element.appendChild(this.Menu);
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

            if (e.button !== 0) {
                return;
            }

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

            if (e.button !== 0) {
                return;
            }

            let startX = e.clientX;
            let startLeft = parseInt(this.Tree.Element.style.width);

            document.addEventListener("pointermove", this.PointerMoveEvent = (e: PointerEvent) => {
                let width = startLeft + (e.clientX - startX);
                width = Math.max(width, 0);
                this.Tree.Element.style.width = `${width}px`;
            });

            document.addEventListener("pointerup", (e) => {

                document.removeEventListener("pointermove", this.PointerMoveEvent);
                this.PointerMoveEvent = null;

            }, { once: true });
        });
    }
}