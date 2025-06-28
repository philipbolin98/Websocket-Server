using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Runtime.InteropServices;
using System.Security.AccessControl;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using Microsoft.IdentityModel.Tokens;

namespace Server {
    public class Database {

        public static string ConnectionString = "Server=PHILIPPC\\SQLEXPRESS;Database=WebsocketServer;Trusted_Connection=True;TrustServerCertificate=True";

        public static async Task<object?> RunQuery(string Query, SqlParameter[]? Paramaters = null) {
            try {

                using SqlConnection connection = new(ConnectionString);
                using SqlCommand command = new(Query, connection);

                connection.Open();

                if (Paramaters != null) {
                    command.Parameters.AddRange(Paramaters);
                }

                object? result = await command.ExecuteScalarAsync();
                return result;

            } catch (Exception ex) {
                Debug.Write(ex.Message);
                return null;
            }
        }

        public static async Task<bool> ValidateLogin(string username, string password) {

            string loginQuery = "SELECT COUNT(*) FROM Users WHERE Username = @Username AND Password = @Password";

            SqlParameter[] parameters = [
                new SqlParameter("@Username", username),
                new SqlParameter("@Password", password)
            ];

            object? result = await RunQuery(loginQuery, parameters);

            if (result == null) {
                return false;
            }

            return (int)result == 1;
        }
    }
}