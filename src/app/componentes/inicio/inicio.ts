import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { ComidasService } from '../../servicios/comidas';
import { BebidasService } from '../../servicios/bebidas';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css'
})

export class Inicio implements OnInit {

  private comidasService = inject(ComidasService);
  private bebidasService = inject(BebidasService);
  private detector = inject(ChangeDetectorRef);

  nombreRestaurante = 'MANILA';

  comidaEstrella: any = null;
  bebidaEstrella: any = null;

  cargandoComida = true;
  cargandoBebida = true;

  ngOnInit(): void {

    // CONSULTAR COMIDA

    this.comidasService.obtenerComidaAleatoria()
      .pipe(
        finalize(() => {
          this.cargandoComida = false;
          this.detector.detectChanges();
        })
      )
      .subscribe({
        next: (respuesta: any) => {

          console.log('RESPUESTA COMIDAS:', respuesta);

          if (respuesta.meals && respuesta.meals.length > 0) {
            this.comidaEstrella = respuesta.meals[0];
            console.log('IMAGEN COMIDA:', this.comidaEstrella.strMealThumb);
          }

          this.detector.detectChanges();
        },
        error: (error: unknown) => {
          console.error('ERROR COMIDAS:', error);
          this.detector.detectChanges();
        }
      });


    // CONSULTAR BEBIDA

    this.bebidasService.obtenerBebidaAleatoria()
      .pipe(
        finalize(() => {
          this.cargandoBebida = false;
          this.detector.detectChanges();
        })
      )
      .subscribe({
        next: (respuesta: any) => {

          console.log('RESPUESTA BEBIDAS:', respuesta);

          if (respuesta.drinks && respuesta.drinks.length > 0) {
            this.bebidaEstrella = respuesta.drinks[0];
            console.log('IMAGEN BEBIDA:', this.bebidaEstrella.strDrinkThumb);
          }

          this.detector.detectChanges();
        },
        error: (error: unknown) => {
          console.error('ERROR BEBIDAS:', error);
          this.detector.detectChanges();
        }
      });

  }

}