export class Group {
    constructor(
        public name: string,
        public permissions: string[] = [],
        public id?: number
    ){}

    public static clone(group: Group): Group {
        return new Group(group.name, [...group.permissions], group.id);
    }
}