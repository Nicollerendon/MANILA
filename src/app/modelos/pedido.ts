import { Comida } from './comida';
import { Bebida } from './bebida';

export class Pedido {

    constructor(
        public nombreCliente: string,
        public celular: string,
        public direccion: string,
        public comidas: Comida[],
        public bebidas: Bebida[],
        public total: number,
        public fecha: Date
    ) {}

}