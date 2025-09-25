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

        public override abstract Task<int> AddToDatabaseAsync();

        protected new async Task<int> AddToDatabaseCoreAsync(string subInsert, List<SqlParameter> parameters) {
            
            string query = $"""
                DECLARE @ScreenComponentID int;

                INSERT INTO ScreenComponents(ComponentID, X, Y, Width, Height, Visibility)
                VALUES(@ComponentID, @X, @Y, @Width, @Height, @Visibility)
                SET @ScreenComponentID = SCOPE_IDENTITY();

                {subInsert}
                """;

            parameters.AddRange([
                new SqlParameter("@X", this.X),
                new SqlParameter("@Y", this.Y),
                new SqlParameter("@Width", this.Width),
                new SqlParameter("@Height", this.Height),
                new SqlParameter("@Visibility", this.Visibility)
            ]);

            int componentID = await base.AddToDatabaseCoreAsync(query, parameters);
            return componentID;
        }
    }
}
