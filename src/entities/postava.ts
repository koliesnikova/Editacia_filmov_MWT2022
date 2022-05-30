import { Clovek } from "./clovek";

export class Postava {
    constructor(
        public postava: string,
        public dolezitost: "hlavná postava" | "vedľajšia postava",
        public herec: Clovek
    ) { }

    public static clone(postava: Postava): Postava {
        return new Postava(postava.postava, postava.dolezitost,
            postava.herec);
    }
}