class Tree {

    Element: HTMLElement;
    RootNodes: TreeNode[] = [];
    NodesByID: Map<string, TreeNode> = new Map();
    SelectedNode: TreeNode | null = null;

    //Events
    onSelect?: (Node: TreeNode) => void;

    constructor(data: any[]) {

        this.Element = document.createElement("div");
        this.Element.classList.add("tree");
        this.Element.style.width = "200px";

        for (let node of data) {
            this.AddNode(node)
        }

        this.AddEvents();
    }

    AddEvents() {

        this.Element.addEventListener("keydown", (e: KeyboardEvent) => {

            if (!this.SelectedNode) {
                return;
            }

            switch (e.key) {
                case "ArrowDown": {

                    e.preventDefault();

                    let nextSibling = this.SelectedNode.GetNextSibling();
                    if (nextSibling) {
                        nextSibling.Select();
                    }
                    break;
                }
                case "ArrowUp": {

                    e.preventDefault();

                    let prevSibling = this.SelectedNode.GetPrevSibling();
                    if (prevSibling) {
                        prevSibling.Select();
                    }
                    break;
                }
                default:
                    break;
            }
        });
    }

    GetNodeByID(id: string): TreeNode | null {

        if (!this.NodesByID.has(id)) {
            return null;
        }

        let node = this.NodesByID.get(id) as TreeNode;
        return node;
    }

    AddNode(data: any, parentNode: TreeNode | null = null): TreeNode {
        let node = new TreeNode(this, data, parentNode);
        return node;
    }

    DeleteNode(id: string) {
        let node = this.GetNodeByID(id)
        node?.Delete();
    }
}

class TreeNode {

    static BranchWidth: number = 20;

    ID: string;
    Tree: Tree;
    Element: HTMLElement;
    NodeContainer: HTMLElement;
    SpacerElement: HTMLElement;
    ExpandButtonContainer: HTMLElement;
    ExpandButton: HTMLElement;
    ImageElement: HTMLElement;
    NameElement: HTMLElement;
    Name: string;
    Children: TreeNode[] = [];
    ChildContainer: HTMLElement;
    Depth: number;
    IsOpen: boolean = false;
    ParentNode: TreeNode | null;

    constructor(tree: Tree, data: any, parentNode: TreeNode | null) {

        this.ID = data.ID;
        this.Tree = tree;
        this.ParentNode = parentNode;
        this.Tree.NodesByID.set(this.ID, this);

        this.Element = document.createElement("div");
        this.Element.classList.add("treenode");
        this.Element.tabIndex = -1;

        this.NodeContainer = document.createElement("div");
        this.NodeContainer.classList.add("treenodecontainer");

        this.SpacerElement = document.createElement("div");
        this.SpacerElement.classList.add("treenodespacer");

        this.ExpandButtonContainer = document.createElement("div");
        this.ExpandButtonContainer.classList.add("treenodeexpandbuttoncontainer");
        this.ExpandButtonContainer.style.width = `${TreeNode.BranchWidth}px`;

        this.ExpandButton = document.createElement("div");
        this.ExpandButton.classList.add("treenodeexpandbutton");
        this.ExpandButton.innerText = "+";

        this.ImageElement = document.createElement("div");
        this.ImageElement.classList.add("treenodeimage");

        this.Name = data.Name;
        this.NameElement = document.createElement("span");
        this.NameElement.classList.add("treenodename");
        this.NameElement.innerText = this.Name;

        this.NodeContainer.appendChild(this.SpacerElement);
        this.NodeContainer.appendChild(this.ExpandButtonContainer);
        this.NodeContainer.appendChild(this.ImageElement);
        this.NodeContainer.appendChild(this.NameElement);

        this.ChildContainer = document.createElement("div");
        this.ChildContainer.classList.add("treenodechildcontainer");

        this.Element.appendChild(this.NodeContainer);

        this.Depth = parentNode ? parentNode.Depth + 1 : 0;
        this.SpacerElement.style.width = `${TreeNode.BranchWidth * this.Depth}px`;

        if (data.Children) {
            for (let childData of data.Children) {
                tree.AddNode(childData, this)
            }
        }

        let siblings = parentNode ? parentNode.Children : tree.RootNodes;

        if (parentNode && siblings.length === 0) {
            parentNode.ExpandButtonContainer.appendChild(parentNode.ExpandButton);
        }

        siblings.push(this);

        let parentElement = parentNode ? parentNode.ChildContainer : tree.Element;
        parentElement.appendChild(this.Element);

        this.AddEvents();
    }

    AddEvents() {

        this.ExpandButton.addEventListener("click", () => {
            this.OpenOrClose();
        });

        this.NameElement.addEventListener("click", () => {
            this.Select();
        });

        this.NameElement.addEventListener("dblclick", () => {
            this.OpenOrClose();
        });
    }

    OpenOrClose() {

        if (this.Children.length === 0) {
            return;
        }

        if (this.IsOpen) {
            this.Close();
        } else {
            this.Open();
        }
    }

    Open() {
        this.Element.appendChild(this.ChildContainer);
        this.ExpandButton.innerText = "-";
        this.IsOpen = true;
    }

    Close() {
        this.ChildContainer.remove();
        this.ExpandButton.innerText = "+";
        this.IsOpen = false;
    }

    Select() {

        if (this.Tree.SelectedNode === this) {
            return;
        }

        this.Tree.SelectedNode?.Deselect();
        this.Element.classList.add("selected");
        this.Tree.SelectedNode = this;

        this.Tree.onSelect?.(this);
    }

    Deselect() {

        if (this.Tree.SelectedNode !== this) {
            return;
        }

        this.Element.classList.remove("selected");
        this.Tree.SelectedNode = null;
    }

    GetIndex(): number {
        let siblings = this.ParentNode ? this.ParentNode.Children : this.Tree.RootNodes;
        return siblings.indexOf(this);
    }

    GetNextSibling(): TreeNode | null {

        let index = this.GetIndex();
        let siblings = this.ParentNode ? this.ParentNode.Children : this.Tree.RootNodes;

        if (index === siblings.length - 1) {
            return null;
        }

        return siblings[index + 1];
    }

    GetPrevSibling(): TreeNode | null {

        let index = this.GetIndex();
        let siblings = this.ParentNode ? this.ParentNode.Children : this.Tree.RootNodes;

        if (index === 0) {
            return null;
        }

        return siblings[index - 1];
    }

    Delete() {

        this.DeleteChildren();

        if (this.Tree.SelectedNode === this) {

            let nodeToSelect = this.GetNextSibling();

            if (nodeToSelect === null) {

                nodeToSelect = this.GetPrevSibling();

                if (nodeToSelect === null) {
                    nodeToSelect = this.ParentNode;
                }
            }

            if (nodeToSelect !== null) {
                nodeToSelect.Select();
            } else {
                this.Deselect();
            }
        }

        let siblings = this.ParentNode === null ? this.Tree.RootNodes : this.ParentNode.Children;
        let index = siblings.indexOf(this);
        siblings.splice(index, 1);

        this.Tree.NodesByID.delete(this.ID);

        this.Element.remove();
    }

    DeleteChildren() {

        let count = this.Children.length;

        //Recursively remove all child nodes from the tree before removing this one
        for (let i = 0; i < count; i++) {
            let child = this.Children[0];
            child.Delete();
        }
    }
}