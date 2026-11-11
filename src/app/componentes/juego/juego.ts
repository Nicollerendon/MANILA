import { Component } from '@angular/core';

interface Casilla {
  id: number;
  imagen: string;
  encontrada: boolean;
  incorrecta: boolean;
}

@Component({
  selector: 'app-juego',
  imports: [],
  templateUrl: './juego.html',
  styleUrl: './juego.css'
})

export class Juego {

  casillas: Casilla[] = [];

  encontradas = 0;
  terminado = false;

  mensaje = 'Encuentra el plato de comida y la bebida.';

  constructor() {
    this.crearTablero();
  }

  crearTablero() {
    this.casillas = Array.from({ length: 16 }, (_, indice) => ({
      id: indice,
      imagen: '',
      encontrada: false,
      incorrecta: false
    }));

    const posicionPlato = Math.floor(Math.random() * 16);
    let posicionBebida = Math.floor(Math.random() * 16);

    while (posicionBebida === posicionPlato) {
      posicionBebida = Math.floor(Math.random() * 16);
    }

    this.casillas[posicionPlato].imagen = '🍔';
    this.casillas[posicionBebida].imagen = '🥤';
  }

  seleccionarCasilla(id: number) {
    if (this.terminado) return;

    const casilla = this.casillas.find(c => c.id === id);

    if (!casilla || casilla.encontrada || casilla.incorrecta) return;

    if (casilla.imagen === '') {
      casilla.incorrecta = true;
      return;
    }

    casilla.encontrada = true;
    this.encontradas++;

    if (this.encontradas === 1) {
      this.mensaje = '¡Muy bien! Ahora encuentra la otra imagen.';
    }

    if (this.encontradas === 2) {
      this.terminado = true;
      this.mensaje = '¡Has ganado!';
    }
  }

  reiniciarJuego() {
    this.encontradas = 0;
    this.terminado = false;
    this.mensaje = 'Encuentra el plato de comida y la bebida.';

    this.crearTablero();
  }
}