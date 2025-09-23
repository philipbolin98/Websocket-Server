namespace Server.Components {
    internal class Button : ScreenComponent {

        string Caption { get; set; }
        string OnClick { get; set; }

        public Button() : base("Button", 0, 0, 25, 25, true) {
            this.Caption = "";
            this.OnClick = "";
        }

        //public Button(string name, string caption, string onClick, int x, int y, int width, int height, bool visibility) : base(name, x, y, width, height, visibility) {
        //    this.Caption = caption;
        //    this.OnClick = onClick;
        //}

        static Button() {
            ComponentFactory.Register<Button>(() => new Button());
        }
    }
}