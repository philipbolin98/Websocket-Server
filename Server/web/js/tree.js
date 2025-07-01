var Tree = /** @class */ (function () {
    function Tree(data) {
        this.Data = [];
        this.SelectedNode = null;
        this.Element = document.createElement("div");
        this.Element.classList.add("tree");
        this.Element.style.width = "200px";
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var node = data_1[_i];
            this.Data.push(new TreeNode(this, node, this.Element, 0));
        }
    }
    return Tree;
}());
var TreeNode = /** @class */ (function () {
    function TreeNode(tree, data, parentElement, depth) {
        this.Children = [];
        this.IsOpen = false;
        this.Tree = tree;
        this.Element = document.createElement("div");
        this.Element.classList.add("treenode");
        this.NodeContainer = document.createElement("div");
        this.NodeContainer.classList.add("treenodecontainer");
        this.SpacerElement = document.createElement("div");
        this.SpacerElement.classList.add("treenodespacer");
        this.ExpandButtonContainer = document.createElement("div");
        this.ExpandButtonContainer.classList.add("treenodeexpandbuttoncontainer");
        this.ExpandButtonContainer.style.width = "".concat(TreeNode.BranchWidth, "px");
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
        this.SpacerElement.style.width = "".concat(TreeNode.BranchWidth * depth, "px");
        for (var _i = 0, _a = data.children; _i < _a.length; _i++) {
            var childNode = _a[_i];
            this.Children.push(new TreeNode(tree, childNode, this.ChildContainer, depth + 1));
        }
        if (this.Children.length > 0) {
            this.ExpandButtonContainer.appendChild(this.ExpandButton);
        }
        parentElement.appendChild(this.Element);
        this.AddEvents();
    }
    TreeNode.prototype.AddEvents = function () {
        var _this = this;
        this.ExpandButton.addEventListener("click", function () {
            _this.OpenOrClose();
        });
        this.NameElement.addEventListener("click", function () {
            _this.Select();
        });
        this.NameElement.addEventListener("dblclick", function () {
            _this.OpenOrClose();
        });
    };
    TreeNode.prototype.OpenOrClose = function () {
        if (this.Children.length === 0) {
            return;
        }
        if (this.IsOpen) {
            this.Close();
        }
        else {
            this.Open();
        }
    };
    TreeNode.prototype.Open = function () {
        this.Element.appendChild(this.ChildContainer);
        this.ExpandButton.innerText = "-";
        this.IsOpen = true;
    };
    TreeNode.prototype.Close = function () {
        this.ChildContainer.remove();
        this.ExpandButton.innerText = "+";
        this.IsOpen = false;
    };
    TreeNode.prototype.Select = function () {
        var _a;
        if (this.Tree.SelectedNode === this) {
            return;
        }
        (_a = this.Tree.SelectedNode) === null || _a === void 0 ? void 0 : _a.Deselect();
        this.Element.classList.add("selected");
        this.Tree.SelectedNode = this;
    };
    TreeNode.prototype.Deselect = function () {
        if (this.Tree.SelectedNode !== this) {
            return;
        }
        this.Element.classList.remove("selected");
        this.Tree.SelectedNode = null;
    };
    TreeNode.BranchWidth = 20;
    return TreeNode;
}());
//# sourceMappingURL=tree.js.map