import { Clovek } from "./clovek";
import { Postava } from "./postava";

export class Film {
    constructor(
        public id: number | null,
        public nazov: string,
        public slovenskyNazov?: string,
        public rok?: number,
        public imdbID?: string,
        public reziser: Clovek[] = [],
        public postava: Postava[] = [],
        public poradieVRebricku?: { [nazovRebricka: string]: number }
    ) { }
    /**
 * clone
 */
    public static clone(film: Film): Film {
        return new Film(film.id, film.nazov, film.slovenskyNazov, film.rok, film.imdbID,
            film.reziser?.map(g => Clovek.clone(g)),
            film.postava?.map(g => Postava.clone(g)),
            film.poradieVRebricku
        )


    }

    public toStr() {
        return this.nazov + ' ' + this.slovenskyNazov;
    }
}

