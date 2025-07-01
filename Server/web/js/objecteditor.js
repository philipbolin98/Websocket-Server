var ObjectEditor = /** @class */ (function () {
    function ObjectEditor() {
        this.Visible = false;
        this.Element = document.createElement("div");
        this.Element.id = "objecteditor";
        this.Header = document.createElement("div");
        this.Header.classList.add("header");
        this.CloseButton = document.createElement("div");
        this.CloseButton.classList.add("closebutton");
        this.CloseButton.innerText = "X";
        var spacer = document.createElement("div");
        spacer.classList.add("spacer");
        this.Header.appendChild(spacer);
        this.Header.appendChild(this.CloseButton);
        this.Menu = document.createElement("div");
        this.Menu.classList.add("menu");
        this.BodyElement = document.createElement("div");
        this.BodyElement.classList.add("body");
        var treeData = [
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
    ObjectEditor.prototype.Show = function () {
        if (this.Visible) {
            return;
        }
        MainElement === null || MainElement === void 0 ? void 0 : MainElement.appendChild(this.Element);
        this.Visible = true;
    };
    ObjectEditor.prototype.Hide = function () {
        if (!this.Visible) {
            return;
        }
        this.Element.remove();
        this.Visible = false;
    };
    ObjectEditor.prototype.AddEvents = function () {
        var _this = this;
        this.CloseButton.addEventListener("click", function () {
            _this.Hide();
        });
        this.Header.addEventListener("pointerdown", function (e) {
            if (e.button !== 0) {
                return;
            }
            var dx = e.clientX - parseInt(_this.Element.style.left);
            var dy = e.clientY - parseInt(_this.Element.style.top);
            document.addEventListener("pointermove", _this.PointerMoveEvent = function (e) {
                _this.Element.style.left = "".concat(e.clientX - dx, "px");
                _this.Element.style.top = "".concat(e.clientY - dy, "px");
            });
            document.addEventListener("pointerup", function (e) {
                document.removeEventListener("pointermove", _this.PointerMoveEvent);
                _this.PointerMoveEvent = null;
            }, { once: true });
        });
        this.ResizerElement.addEventListener("pointerdown", function (e) {
            if (e.button !== 0) {
                return;
            }
            var startX = e.clientX;
            var startLeft = parseInt(_this.Tree.Element.style.width);
            document.addEventListener("pointermove", _this.PointerMoveEvent = function (e) {
                var width = startLeft + (e.clientX - startX);
                width = Math.max(width, 0);
                _this.Tree.Element.style.width = "".concat(width, "px");
            });
            document.addEventListener("pointerup", function (e) {
                document.removeEventListener("pointermove", _this.PointerMoveEvent);
                _this.PointerMoveEvent = null;
            }, { once: true });
        });
    };
    return ObjectEditor;
}());
//# sourceMappingURL=objecteditor.js.map