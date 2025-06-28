var ContextMenu = /** @class */ (function () {
    function ContextMenu() {
        this.Visibile = false;
        this.Element = document.createElement("div");
        this.Element.id = "contextmenu";
    }
    ContextMenu.prototype.Show = function (x, y, options) {
        var _this = this;
        if (options === void 0) { options = []; }
        if (this.Visibile) {
            return;
        }
        this.Element.style.left = "".concat(x, "px");
        this.Element.style.top = "".concat(y, "px");
        this.Element.replaceChildren();
        document.body.appendChild(this.Element);
        if (options.length === 0) { //Default context menu options
            options.push(new ContextMenuOption("Object Editor", function () { console.log("Object Editor"); }));
        }
        for (var _i = 0, options_1 = options; _i < options_1.length; _i++) {
            var option = options_1[_i];
            var optionEl = document.createElement("div");
            optionEl.innerText = option.Caption;
            optionEl.addEventListener("click", function (e) {
                ShowObjectEditor();
                _this.Hide();
            });
            this.Element.appendChild(optionEl);
        }
        this.Visibile = true;
    };
    ContextMenu.prototype.Hide = function () {
        if (!this.Visibile) {
            return;
        }
        this.Element.remove();
        this.Visibile = false;
    };
    return ContextMenu;
}());
var ContextMenuOption = /** @class */ (function () {
    function ContextMenuOption(caption, onclick) {
        this.Caption = caption;
        this.OnClick = onclick;
    }
    return ContextMenuOption;
}());
//# sourceMappingURL=contextmenu.js.map