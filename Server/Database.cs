using System.Data;
using System.Diagnostics;
using Microsoft.Data.SqlClient;

namespace Server {
    public class Database {

        public static string ConnectionString = "Server=PHILIPPC;Database=WebsocketServer;Trusted_Connection=True;TrustServerCertificate=True";

        public static async Task<object?> ExecuteScalar(string Query, SqlParameter[]? Paramaters = null) {
            try {

                using SqlConnection connection = new(ConnectionString);
                using SqlCommand command = new(Query, connection);

                if (Paramaters != null) {
                    command.Parameters.AddRange(Paramaters);
                }

                connection.Open();
                
                object? result = await command.ExecuteScalarAsync();
                return result;

            } catch (Exception ex) {
                Debug.Write(ex.Message);
                return null;
            }
        }

        public static async Task<int> ExecuteNonQuery(string Query, SqlParameter[]? Paramaters = null) {
            try {

                using SqlConnection connection = new(ConnectionString);
                using SqlCommand command = new(Query, connection);

                if (Paramaters != null) {
                    command.Parameters.AddRange(Paramaters);
                }

                connection.Open();

                int result = await command.ExecuteNonQueryAsync();
                return result;

            } catch (Exception ex) {
                Debug.Write(ex.Message);
                return -1;
            }
        }

        public static void FillDataSet(DataSet ds, string Query, SqlParameter[]? Paramaters = null) {
            try {

                using SqlConnection connection = new(ConnectionString);
                using SqlCommand command = new(Query, connection);

                if (Paramaters != null) {
                    command.Parameters.AddRange(Paramaters);
                }

                connection.Open();

                using SqlDataAdapter adapter = new(command);

                adapter.Fill(ds);

            } catch (Exception ex) {
                Debug.Write(ex.Message);
            }
        }
        
        //public static async Task<bool> ValidateLogin(string username, string password) {

        //    string loginQuery = "SELECT COUNT(*) FROM Users WHERE Username = @Username AND Password = @Password";

        //    SqlParameter[] parameters = [
        //        new SqlParameter("@Username", username),
        //        new SqlParameter("@Password", password)
        //    ];

        //    object? result = await ExecuteScalar(loginQuery, parameters);

        //    if (result == null) {
        //        return false;
        //    }

        //    return (int)result == 1;
        //}
    }
}