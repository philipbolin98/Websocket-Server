class Tree {

    Element: HTMLElement;

    Data: TreeNode[] = [];

    SelectedNode: TreeNode | null = null;

    constructor(data: any[]) {

        this.Element = document.createElement("div");
        this.Element.classList.add("tree");
        this.Element.style.width = "200px";

        for (let node of data) {
            this.Data.push(new TreeNode(this, node, this.Element, 0));
        }
    }
}

class TreeNode {

    static BranchWidth: number = 20;

    Tree: Tree;

    Element: HTMLElement;
    NodeContainer: HTMLElement;
    SpacerElement: HTMLElement;
    ExpandButtonContainer: HTMLElement;
    ExpandButton: HTMLElement;
    ImageElement: HTMLElement;
    NameElement: HTMLElement;

    Name: string;

    Image: string;

    Children: TreeNode[] = [];
    ChildContainer: HTMLElement;

    Depth: number;
    IsOpen: boolean = false;

    constructor(tree: Tree, data: any, parentElement: HTMLElement, depth: number) {

        this.Tree = tree;

        this.Element = document.createElement("div");
        this.Element.classList.add("treenode");

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

        this.Image = data.image;
        this.ImageElement = document.createElement("div");
        this.ImageElement.classList.add("treenodeimage");

        this.Name = data.name;
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

        this.Depth = depth;
        this.SpacerElement.style.width = `${TreeNode.BranchWidth * depth}px`;

        for (let childNode of data.children) {
            this.Children.push(new TreeNode(tree, childNode, this.ChildContainer, depth + 1));
        }

        if (this.Children.length > 0) {
            this.ExpandButtonContainer.appendChild(this.ExpandButton);
        }

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
    }

    Deselect() {

        if (this.Tree.SelectedNode !== this) {
            return;
        }

        this.Element.classList.remove("selected");
        this.Tree.SelectedNode = null;
    }
}