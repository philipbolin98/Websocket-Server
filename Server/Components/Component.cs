using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Server.Components {
    internal abstract class Component {

        public int ID { get; set; }
        public Component? Parent { get; set; } = null;
        public string Name { get; set; }

        public Component(string name) {
            this.Name = name;
        }
    }

    internal static class ComponentFactory {

        private static readonly Dictionary<string, Func<Component>> _factories = [];

        public static void Initialize() {

            var componentBaseType = typeof(Component);
            var assembly = componentBaseType.Assembly;

            //Force load all non-abstract subclasses of Component
            var types = assembly.GetTypes().Where(t => t.IsClass && !t.IsAbstract && componentBaseType.IsAssignableFrom(t));

            foreach (var type in types) {
                //This forces the static constructor to run
                System.Runtime.CompilerServices.RuntimeHelpers.RunClassConstructor(type.TypeHandle);
            }
        }

        public static void Register<T>(Func<Component> factory) where T : Component {
            _factories.Add(typeof(T).Name, factory);
        }

        public static Component Create(string type) {
            if (_factories.TryGetValue(type, out var factory)) {
                return factory();
            }

            throw new InvalidOperationException($"No factory registered for {type}");
        }
    }

    internal abstract class ScreenComponent : Component {

        public Measurement X { get; set; }
        public Measurement Y { get; set; }
        public Measurement Width { get; set; }
        public Measurement Height { get; set; }
        public bool Visibility { get; set; }

        public ScreenComponent(string name) : base(name) {
            
        }
    }

    internal class Button : ScreenComponent {

        public Button(string name) : base(name) {

        }

        static Button() {
            ComponentFactory.Register<Button>(() => new Button("DefaultButton"));
        }
    }

    internal class Label : ScreenComponent {

        public Label(string name) : base(name) { 
        
        }

        static Label() {
            ComponentFactory.Register<Label>(() => new Label("DefaultLabel"));
        }
    }

    internal class Measurement(int value, string units) {
        public int Value = value;
        public string Units = units;
    }
}