class ClientFunctionHandlers {

    static GetComponents(data: any[], storage: any[]) {

        if (!ComponentEditor) {
            ComponentEditor = new Editor("componenteditor", data);
        }
    }

    //static GetComponent(data: any, storage: any[]) {

    //    if (!ComponentEditor) {
    //        return;
    //    }

    //    let node = ComponentEditor.Tree.GetNodeByID(data.ID);

    //    if (!node) {
    //        return;
    //    }

    //    node.DeleteChildren();

    //    for (let prop of data.Properties) {
    //        ComponentEditor.Tree.AddNode(prop, node);
    //    }
    //}

    //static AddComponent(data: any, storage: any[]) {
    //    ComponentEditor?.Tree.AddNode(data);
    //}

    //static DeleteComponent(id: any, storage: any[]) {
    //    let idString: string = `c_${id}`;
    //    ComponentEditor?.Tree.DeleteNode(idString);
    //}

    //static AddComponentProp(data: any, storage: any[]) {

    //    let parentId = data.ParentID;
    //    let parentNode = ComponentEditor?.Tree.GetNodeByID(parentId);

    //    ComponentEditor?.Tree.AddNode(data, parentNode);
    //}

    //static DeleteComponentProp(id: any, storage: any[]) {
    //    let idString: string = `p_${id}`;
    //    ComponentEditor?.Tree.DeleteNode(idString);
    //}
}