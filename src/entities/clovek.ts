export class Clovek {
    constructor(
        public id: number,
        public krstneMeno: string,
        public stredneMeno: string,
        public priezvisko: string
    ) { }

    public static clone(clovek: Clovek): Clovek {
        return new Clovek(clovek.id, clovek.krstneMeno, clovek.stredneMeno, clovek.priezvisko);
    }
}