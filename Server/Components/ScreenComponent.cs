using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.Components {
    internal abstract class ScreenComponent : Component {

        public int X { get; set; }
        public int Y { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
        public bool Visibility { get; set; }

        public ScreenComponent(string name, int x, int y, int width, int height, bool visibility) : base(name) {
            this.X = x;
            this.Y = y;
            this.Width = width;
            this.Height = height;
            this.Visibility = visibility;
        }

        public override abstract Task AddToDatabaseAsync();

        protected new async Task<int> AddToDatabaseCoreAsync() {

            int componentID = await base.AddToDatabaseCoreAsync();

            string query = """
                INSERT INTO ScreenComponents(ComponentID, X, Y, Width, Height, Visibility)
                OUTPUT INSERTED.ScreenComponentID
                VALUES(@ComponentID, @X, @Y, @Width, @Height, @Visibility)
                """;

            SqlParameter[] parameters = [
                new SqlParameter("@ComponentID", componentID),
                new SqlParameter("@X", this.X),
                new SqlParameter("@Y", this.Y),
                new SqlParameter("@Width", this.Width),
                new SqlParameter("@Height", this.Height),
                new SqlParameter("@Visibility", this.Visibility)
            ];

            int? screenComponentID = (int?)await Database.ExecuteScalarAsync(query, parameters);

            if (!screenComponentID.HasValue) {
                throw new Exception("Error adding component to the database.");
            }

            return screenComponentID.Value;
        }
    }
}
