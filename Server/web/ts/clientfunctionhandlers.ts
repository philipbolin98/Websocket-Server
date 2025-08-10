class ClientFunctionHandlers {

    static GetComponents(data: any[]) {

        if (!ComponentEditor) {
            ComponentEditor = new Editor("componenteditor", data);
        }
    }

    static GetComponent(data: any) {

        if (!ComponentEditor) {
            return;
        }

        let node = ComponentEditor.Tree.GetNodeByID(data.ID);

        if (!node) {
            return;
        }

        node.DeleteChildren();

        for (let prop of data.Properties) {
            ComponentEditor.Tree.AddNode(prop, node);
        }
    }

    static AddComponent(data: any) {

        ComponentEditor?.Tree.AddNode(data);
    }

    static DeleteComponent(id: any) {
        let idString: string = `c_${id}`;
        ComponentEditor?.Tree.DeleteNode(idString);
    }
}