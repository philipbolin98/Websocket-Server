using System.Data;
using System.Diagnostics;
using Microsoft.Data.SqlClient;

namespace Server {
    public class Database {

        public static string ConnectionString = "Server=PHILIPPC;Database=WebsocketServer2;Trusted_Connection=True;TrustServerCertificate=True";

        public static SqlParameter ToDBParam(SqlParameter parameter) {
            parameter.Value ??= DBNull.Value;
            return parameter;
        }

        public static void AddParameters(SqlCommand command, List<SqlParameter> parameters) {
            command.Parameters.AddRange(parameters.Select(ToDBParam).ToArray());
        }

        /// <summary>
        /// Returns the first column of the first row in the result set
        /// </summary>
        /// <param name="query"></param>
        /// <param name="Paramaters"></param>
        /// <returns></returns>
        public static async Task<object?> ExecuteScalarAsync(string query, List<SqlParameter>? parameters = null) {
            
            using SqlConnection connection = new(ConnectionString);
            await connection.OpenAsync();

            using SqlTransaction transaction = (SqlTransaction)await connection.BeginTransactionAsync();
            using SqlCommand command = new(query, connection, transaction);
                
            if (parameters != null) {
                AddParameters(command, parameters);
            }

            try {
                
                object? result = await command.ExecuteScalarAsync();

                await transaction.CommitAsync();

                return result;

            } catch (Exception ex1) {

                Debug.Write(ex1.Message);

                try {
                    await transaction.RollbackAsync();
                } catch (Exception ex2) {
                    Debug.Write(ex2.Message);
                }

                return null;
            }
        }

        /// <summary>
        /// Returns the number of rows affected
        /// </summary>
        /// <param name="query"></param>
        /// <param name="Paramaters"></param>
        /// <returns></returns>
        public static async Task<int> ExecuteNonQueryAsync(string query, List<SqlParameter>? parameters = null) {

            using SqlConnection connection = new(ConnectionString);
            await connection.OpenAsync();

            using SqlTransaction transaction = (SqlTransaction)await connection.BeginTransactionAsync();
            using SqlCommand command = new(query, connection, transaction);

            if (parameters != null) {
                AddParameters(command, parameters);
            }

            try {

                int result = await command.ExecuteNonQueryAsync();

                await transaction.CommitAsync();

                return result;

            } catch (Exception ex1) {

                Debug.Write(ex1.Message);

                try {
                    await transaction.RollbackAsync();
                } catch (Exception ex2) {
                    Debug.Write(ex2.Message);
                }

                return -1;
            }
        }

        public static async void FillDataSet(DataSet ds, string query, List<SqlParameter>? parameters = null) {
            
            using SqlConnection connection = new(ConnectionString);
            await connection.OpenAsync();

            using SqlTransaction transaction = (SqlTransaction)await connection.BeginTransactionAsync();
            using SqlCommand command = new(query, connection, transaction);

            if (parameters != null) {
                AddParameters(command, parameters);
            }

            try {

                using SqlDataAdapter adapter = new(command);

                adapter.Fill(ds);

                await transaction.CommitAsync();

            } catch (Exception ex1) {

                Debug.Write(ex1.Message);

                try {
                    await transaction.RollbackAsync();
                } catch (Exception ex2) {
                    Debug.Write(ex2.Message);
                }
            }
        }
    }
}