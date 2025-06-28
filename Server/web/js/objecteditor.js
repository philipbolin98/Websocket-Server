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
            var startX = e.clientX;
            var startLeft = parseInt(_this.TreeElement.style.width);
            document.addEventListener("pointermove", _this.PointerMoveEvent = function (e) {
                _this.TreeElement.style.width = "".concat(startLeft + (e.clientX - startX), "px");
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