using System.Data;
using System.Diagnostics;
using Microsoft.Data.SqlClient;

namespace Server {
    public class Database {

        public static string ConnectionString = "Server=PHILIPPC;Database=WebsocketServer2;Trusted_Connection=True;TrustServerCertificate=True";

        public static SqlParameter ToDbParam(SqlParameter parameter) {
            if (parameter.Value == null) {
                parameter.Value = DBNull.Value;
            }
            return parameter;
        }

        /// <summary>
        /// Returns the first column of the first row in the result set
        /// </summary>
        /// <param name="Query"></param>
        /// <param name="Paramaters"></param>
        /// <returns></returns>
        public static async Task<object?> ExecuteScalarAsync(string Query, SqlParameter[]? Paramaters = null) {
            try {

                using SqlConnection connection = new(ConnectionString);
                using SqlCommand command = new(Query, connection);

                if (Paramaters != null) {
                    command.Parameters.AddRange(Paramaters.Select(ToDbParam).ToArray());
                }

                connection.Open();
                
                object? result = await command.ExecuteScalarAsync();
                return result;

            } catch (Exception ex) {
                Debug.Write(ex.Message);
                return null;
            }
        }

        /// <summary>
        /// Returns the number of rows affected
        /// </summary>
        /// <param name="Query"></param>
        /// <param name="Paramaters"></param>
        /// <returns></returns>
        public static async Task<int> ExecuteNonQueryAsync(string Query, SqlParameter[]? Paramaters = null) {
            try {

                using SqlConnection connection = new(ConnectionString);
                using SqlCommand command = new(Query, connection);

                if (Paramaters != null) {
                    command.Parameters.AddRange(Paramaters.Select(ToDbParam).ToArray());
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
                    command.Parameters.AddRange(Paramaters.Select(ToDbParam).ToArray());
                }

                connection.Open();

                using SqlDataAdapter adapter = new(command);

                adapter.Fill(ds);

            } catch (Exception ex) {
                Debug.Write(ex.Message);
            }
        }
    }
}