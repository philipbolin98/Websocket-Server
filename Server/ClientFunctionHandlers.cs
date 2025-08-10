using System.Text.Json;

namespace Server {
    public static class ClientFunctionHandlers {

        public static Result<object?> GetComponents(object[] parameters) {

            List<ComponentMini> components = [];

            foreach (Component component in Global.dComponentsByName.Values) {
                components.Add(component.Mini());
            }

            return Result<object?>.Pass(components);
        }

        public static Result<object?> GetComponent(object[] parameters) {

            string? idString = ((JsonElement)parameters[0]).GetString();

            if (idString == null || idString.Length <= 2) {
                return Result<object?>.Fail("Invalid component id.");
            }

            int id = int.Parse(idString.Substring(2));

            if (!Global.dComponentsByID.TryGetValue(id, out Component? component)) {
                return Result<object?>.Fail("Invalid component id.");
            }

            return Result<object?>.Pass(component.Mini(true));
        }

        public static async Task<Result<object?>> AddComponent(object[] parameters) {

            var component = await Component.Create("Component");

            if (component == null) {
                return Result<object?>.Fail("Error adding new component.");
            } else {
                return Result<object?>.Pass(component.Mini());
            }
        }

        public static async Task<Result<object?>> DeleteComponent(object[] parameters) {

            string? idString = ((JsonElement)parameters[0]).GetString();

            if (idString == null || idString.Length <= 2) {
                return Result<object?>.Fail("Invalid component id.");
            }

            int id = int.Parse(idString.Substring(2));

            if (!Global.dComponentsByID.TryGetValue(id, out Component? component)) {
                return Result<object?>.Fail("Invalid component id.");
            }

            await Component.Delete(component);

            return Result<object?>.Pass(component.ID);
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