import { Tree, TreeNode } from "../tree/tree";
import { Table } from "../table/table";
import { socket } from "../../utils/websocket";
import "./editor.css";

export class Editor {

    Element: HTMLElement;
    Header: HTMLElement;
    Menu: HTMLElement;
    AddButton: HTMLElement;
    DeleteButton: HTMLElement;
    CloseButton: HTMLElement;
    BodyElement: HTMLElement;
    Tree: Tree;
    Table: Table;
    ResizerElement: HTMLElement;
    TableElement: HTMLElement;
    Visible: boolean = false;

    constructor(id: string, data: any[]) {

        this.Element = document.createElement("div")
        this.Element.classList.add("editor");
        this.Element.id = id;

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

        this.AddButton = document.createElement("div");
        this.AddButton.classList.add("menubutton");
        this.AddButton.innerText = '+';

        this.DeleteButton = document.createElement("div");
        this.DeleteButton.classList.add("menubutton");
        this.DeleteButton.innerText = '-';

        this.Menu.appendChild(this.AddButton);
        this.Menu.appendChild(this.DeleteButton);

        this.BodyElement = document.createElement("div");
        this.BodyElement.classList.add("body");

        this.Tree = new Tree(data);

        this.ResizerElement = document.createElement("div");
        this.ResizerElement.classList.add("resizer");

        this.Table = new Table();

        this.TableElement = this.Table.Element;

        this.BodyElement.appendChild(this.Tree.Element);
        this.BodyElement.appendChild(this.ResizerElement);
        this.BodyElement.appendChild(this.TableElement);

        this.Element.appendChild(this.Header);
        this.Element.appendChild(this.Menu);
        this.Element.appendChild(this.BodyElement);

        this.Element.style.left = "100px";
        this.Element.style.top = "100px";

        this.AddEvents();
    }

    Show() {

        if (this.Visible) {
            return;
        }

        var MainElement: HTMLElement | null = document.getElementById("main");
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

            let pointerMoveEvent = (e: PointerEvent) => {
                this.Element.style.left = `${e.clientX - dx}px`;
                this.Element.style.top = `${e.clientY - dy}px`;
            }

            document.addEventListener("pointermove", pointerMoveEvent);

            document.addEventListener("pointerup", (e) => {
                document.removeEventListener("pointermove", pointerMoveEvent);
            }, { once: true });
        });

        this.ResizerElement.addEventListener("pointerdown", (e: PointerEvent) => {

            if (e.button !== 0) {
                return;
            }

            let startX = e.clientX;
            let startLeft = parseInt(this.Tree.Element.style.width);

            let pointerMoveEvent = (e: PointerEvent) => {
                let width = startLeft + (e.clientX - startX);
                width = Math.max(width, 0);
                this.Tree.Element.style.width = `${width}px`;
            }

            document.addEventListener("pointermove", pointerMoveEvent);

            document.addEventListener("pointerup", (e) => {
                document.removeEventListener("pointermove", pointerMoveEvent);
            }, { once: true });
        });

        this.AddButton.addEventListener("click", (e: MouseEvent) => {

            let node = this.Tree.SelectedNode;

            if (!node) {
                socket.SendWebSocketRequest("AddComponent");
            } else {
                socket.SendWebSocketRequest("AddComponent", [node.ID]);
            }
        });

        this.DeleteButton.addEventListener("click", (e: MouseEvent) => {

            let node = this.Tree.SelectedNode;

            if (!node) {
                return;
            }

            socket.SendWebSocketRequest("DeleteComponent", [node.ID]);
        });

        this.Tree.onSelect = (node: TreeNode) => {
            socket.SendWebSocketRequest("GetComponent", [node.ID]);
        }

        this.Tree.onKeyDown = (e: KeyboardEvent, node: TreeNode | null) => {

            switch (e.key) {
                case "Delete":

                    if (!node) {
                        return;
                    }

                    socket.SendWebSocketRequest("DeleteComponent", [node.ID]);
            }
        }
    }
}