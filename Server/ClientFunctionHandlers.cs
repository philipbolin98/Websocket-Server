namespace Server {
    public static class ClientFunctionHandlers {

        public static async Task<Result<object?>> AddComponent(object[] parameters) {

            var component = await Component.Create("Component");

            if (component == null) {
                return Result<object?>.Fail("Error adding new component.");
            } else {
                return Result<object?>.Pass(component);
            }
        }

        public static Result<object?> GetComponents(object[] parameters) {
            
            var components = Global.dComponents.Values.ToList();

            return Result<object?>.Pass(components);
        }

        public class Result<T> {
            public bool Success { get; set; }
            public string? Message { get; set; }
            public T? Data { get; set; }

            public static Result<T> Pass(T data) => new() { Success = true, Data = data };
            public static Result<T> Fail(string message) => new() { Success = false, Message = message };
        }
    }
}