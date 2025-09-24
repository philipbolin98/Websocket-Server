using Microsoft.Data.SqlClient;

namespace Server.Components {
    internal class Button : ScreenComponent {

        string Caption { get; set; }
        string OnClick { get; set; }

        public Button() : base("Button", 0, 0, 25, 25, true) {
            this.Caption = "";
            this.OnClick = "";
        }

        static Button() {
            ComponentFactory.Register<Button>(() => new Button());
        }

        public override async Task AddToDatabaseAsync() {

            int screenComponentID = await base.AddToDatabaseCoreAsync();

            string query = """
                INSERT INTO Buttons(ScreenComponentID, Caption, OnClick)
                VALUES(@ScreenComponentID, @Caption, @OnClick)
                """;

            SqlParameter[] parameters = [
                new SqlParameter("@ScreenComponentID", screenComponentID),
                new SqlParameter("@Caption", this.Caption),
                new SqlParameter("@OnClick", this.OnClick)
            ];

            await Database.ExecuteScalarAsync(query, parameters);
        }
    }
}