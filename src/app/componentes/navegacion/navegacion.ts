import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navegacion',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navegacion.html',
  styleUrl: './navegacion.css'
})

export class Navegacion {

  menuAbierto = false;

  cerrarMenu(): void {
    this.menuAbierto = false;
  }

}