using Server.Components;
using System.Text.Json;

namespace Server {
    public static class ClientFunctionHandlers {

        public static Result<object?> AddComponent(object[] parameters) {

            string? componentType = ((JsonElement)parameters[0]).GetString();
            //int? parentId = ((JsonElement)parameters[0]).GetInt32();

            if (componentType == null) {
                return Result<object?>.Fail("Invalid component type.");
            }

            var component = ComponentFactory.Create(componentType);

            if (component == null) {
                return Result<object?>.Fail("Error adding new component.");
            } else {
                return Result<object?>.Pass(component);
            }
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