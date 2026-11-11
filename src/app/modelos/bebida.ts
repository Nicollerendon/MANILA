export class Bebida {

    constructor(
        public id: string,
        public nombre: string,
        public imagen: string,
        public categoria: string,
        public tipo: string,
        public ingredientes: string[],
        public precio: number
    ) {}

}