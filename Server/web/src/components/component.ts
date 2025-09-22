export class Component {

    ID: number;
    Name: string;
    Parent?: Component;

    constructor(id: number, name: string, parentId?: number) {
        this.ID = id;
        this.Name = name;
    }
}