export class Comida {

    constructor(
        public id: string,
        public nombre: string,
        public imagen: string,
        public categoria: string,
        public instrucciones: string,
        public ingredientes: string[],
        public precio: number
    ) {}

}