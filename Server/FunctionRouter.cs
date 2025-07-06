using System.Diagnostics;
using System.Reflection;
using static Server.ClientFunctionHandlers;

namespace Server {
    public static class FunctionRouter {

        private static readonly Dictionary<string, Func<object[], Task<Result<object?>>>> dRoutes = new(StringComparer.OrdinalIgnoreCase);

        public static async Task<Result<object?>> DispatchAsync(string functionName, object[] parameters) {

            if (dRoutes.TryGetValue(functionName, out var handler)) {

                return await handler(parameters);

            } else {
                return Result<object?>.Fail($"[FunctionRouter] Unknown function: {functionName}");
            }
        }

        public static void Initialize() {
            
            var methods = typeof(ClientFunctionHandlers).GetMethods(BindingFlags.Public | BindingFlags.Static).Where(m => m.GetParameters().Length == 1 && m.GetParameters()[0].ParameterType == typeof(object[]));

            foreach (var method in methods) {

                Func<object[], Task<Result<object?>>> wrapper;

                if (method.ReturnType == typeof(Result<object?>)) {

                    // Wrap sync method
                    var syncDel = (Func<object[], Result<object?>>)Delegate.CreateDelegate(typeof(Func<object[], Result<object?>>), method);
                    wrapper = args => Task.FromResult(syncDel(args));

                } else if (method.ReturnType == typeof(Task<Result<object?>>)) {

                    // Already async, use as-is
                    var asyncDel = (Func<object[], Task<Result<object?>>>)Delegate.CreateDelegate(typeof(Func<object[], Task<Result<object?>>>), method);
                    wrapper = asyncDel;

                } else {
                    Debug.WriteLine($"[Router] Skipping unsupported method: {method.Name}");
                    continue;
                }

                dRoutes[method.Name] = wrapper;
            }
        }
    }
}