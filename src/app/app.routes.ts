import { Routes } from '@angular/router';

import { Inicio } from './componentes/inicio/inicio';
import { Comidas } from './componentes/comidas/comidas';
import { Bebidas } from './componentes/bebidas/bebidas';
import { Juego } from './componentes/juego/juego';
import { Pedido } from './componentes/pedido/pedido';

export const routes: Routes = [

    { path: '', component: Inicio },

    { path: 'comidas', component: Comidas },

    { path: 'bebidas', component: Bebidas },

    { path: 'juego', component: Juego },

    { path: 'pedido', component: Pedido },

    { path: '**', redirectTo: '' }

];