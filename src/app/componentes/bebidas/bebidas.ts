import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BebidasService } from '../../servicios/bebidas';
import { Bebida } from '../../modelos/bebida';
import { Pedidos } from '../../servicios/pedidos';

@Component({
  selector: 'app-bebidas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bebidas.html',
  styleUrl: './bebidas.css'
})
export class Bebidas implements OnInit, OnDestroy {

  private bebidasService = inject(BebidasService);
  private detector = inject(ChangeDetectorRef);
  private pedidos = inject(Pedidos);

  private temporizador: ReturnType<typeof setTimeout> | undefined;

  bebidas: Bebida[] = [];
  categorias: string[] = [];
  tipos: string[] = [];

  mensaje = '';
  toastMensaje = '';
  toastVisible = false;
  textoBusqueda = '';
  tipoBusqueda = 'ingrediente';
  tipoSeleccionado = '';

  ngOnInit(): void {

    // Cargar categorías
    this.bebidasService.obtenerListaCategorias().subscribe({

      next: respuesta => {

        if (respuesta && Array.isArray(respuesta.drinks)) {

          this.categorias = respuesta.drinks.map(
            (dato: any) => dato.strCategory
          );

          if (this.categorias.length > 0) {
            this.seleccionarCategoria(this.categorias[0]);
          } else {
            this.mensaje = 'No hay categorías disponibles.';
          }

        } else {
          this.mensaje = 'No se pudieron encontrar las categorías.';
        }

        this.detector.detectChanges();

      },

      error: (error: any) => {

        console.log('Error categorías:', error);
        this.mensaje = 'Error al cargar las categorías.';
        this.detector.detectChanges();

      }

    });

    // Cargar tipos de bebidas
    this.bebidasService.obtenerTipos().subscribe({

      next: respuesta => {

        if (respuesta && Array.isArray(respuesta.drinks)) {

          this.tipos = respuesta.drinks.map(
            (dato: any) => dato.strAlcoholic
          );

        }

        this.detector.detectChanges();

      },

      error: (error: any) => {

        console.log('Error tipos:', error);
        this.detector.detectChanges();

      }

    });

  }

  ngOnDestroy(): void {

    if (this.temporizador) {
      clearTimeout(this.temporizador);
    }

  }

  mostrarNotificacion(nombre: string): void {

    this.toastMensaje = nombre + ' agregada a tu pedido.';
    this.toastVisible = true;

    if (this.temporizador) {
      clearTimeout(this.temporizador);
    }

    this.temporizador = setTimeout(() => {
      this.toastVisible = false;
      this.detector.detectChanges();
    }, 3000);

    this.detector.detectChanges();

  }

  seleccionarCategoria(categoria: string): void {

    this.bebidas = [];
    this.mensaje = '';
    this.tipoSeleccionado = '';

    this.bebidasService.obtenerBebidas(categoria).subscribe({

      next: respuesta => {

        if (respuesta && Array.isArray(respuesta.drinks) && respuesta.drinks.length > 0) {

          this.mostrarBebidas(respuesta.drinks);

        } else {

          this.mensaje = 'No se encontraron bebidas en esta categoría.';

        }

        this.detector.detectChanges();

      },

      error: (error: any) => {

        console.log('Error al cargar bebidas:', error);
        this.mensaje = 'No se pudieron cargar las bebidas. Intenta nuevamente.';
        this.detector.detectChanges();

      }

    });

  }

  seleccionarTipo(tipo: string): void {

    this.bebidas = [];
    this.mensaje = '';
    this.tipoSeleccionado = tipo;

    this.bebidasService.filtrarPorTipo(tipo).subscribe({

      next: respuesta => {

        if (respuesta && Array.isArray(respuesta.drinks) && respuesta.drinks.length > 0) {

          this.mostrarBebidas(respuesta.drinks);

        } else {

          this.mensaje = 'No se encontraron bebidas de este tipo.';

        }

        this.detector.detectChanges();

      },

      error: (error: any) => {

        console.log('Error al filtrar bebidas:', error);
        this.mensaje = 'No se pudieron cargar las bebidas.';
        this.detector.detectChanges();

      }

    });

  }

  buscar(): void {

    const busqueda = this.textoBusqueda.trim();

    this.bebidas = [];
    this.mensaje = '';

    if (busqueda === '') {

      this.mensaje = 'Escribe un nombre o ingrediente.';
      this.detector.detectChanges();
      return;

    }

    const manejarRespuesta = (respuesta: any): void => {

      const resultados = respuesta?.drinks;

      if (Array.isArray(resultados) && resultados.length > 0) {

        this.mostrarBebidas(
          resultados,
          this.tipoBusqueda === 'nombre'
        );

      } else {

        this.bebidas = [];

        if (this.tipoBusqueda === 'nombre') {
          this.mensaje = 'No se encontraron bebidas con ese nombre.';
        } else {
          this.mensaje = 'No se encontraron bebidas con ese ingrediente.';
        }

      }

      this.detector.detectChanges();

    };

    const manejarError = (error: any): void => {

      console.log('Error en la búsqueda:', error);

      this.bebidas = [];
      this.mensaje = 'No se pudo realizar la búsqueda. Intenta nuevamente.';
      this.detector.detectChanges();

    };

    if (this.tipoBusqueda === 'nombre') {

      this.bebidasService.buscarPorNombre(busqueda).subscribe({
        next: manejarRespuesta,
        error: manejarError
      });

    } else {

      this.bebidasService.buscarPorIngrediente(busqueda).subscribe({
        next: manejarRespuesta,
        error: manejarError
      });

    }

  }

  mostrarBebidas(datos: any, tienenDetalles: boolean = false): void {

    // Comprobar que realmente sea un arreglo
    if (!Array.isArray(datos) || datos.length === 0) {

      this.bebidas = [];
      this.mensaje = 'No se encontraron bebidas.';
      this.detector.detectChanges();
      return;

    }

    this.bebidas = datos.map((dato: any) => {

      if (tienenDetalles) {

        return this.convertirBebida(dato);

      }

      return new Bebida(
        dato.idDrink,
        dato.strDrink,
        dato.strDrinkThumb,
        '',
        '',
        [],
        Math.floor(Math.random() * 10000) + 8000
      );

    });

    this.detector.detectChanges();

    if (!tienenDetalles) {

      datos.forEach((dato: any) => {

        this.bebidasService.obtenerBebidaPorId(dato.idDrink).subscribe({

          next: respuesta => {

            if (respuesta && Array.isArray(respuesta.drinks) && respuesta.drinks.length > 0) {

              const detalle = this.convertirBebida(respuesta.drinks[0]);

              const bebidaEncontrada = this.bebidas.find(
                bebida => bebida.id === detalle.id
              );

              if (bebidaEncontrada) {

                bebidaEncontrada.ingredientes = detalle.ingredientes;
                bebidaEncontrada.categoria = detalle.categoria;
                bebidaEncontrada.tipo = detalle.tipo;

              }

              this.detector.detectChanges();

            }

          },

          error: (error: any) => {

            console.log('No se pudieron cargar los ingredientes:', error);

          }

        });

      });

    }

  }

  convertirBebida(dato: any): Bebida {

    const ingredientes: string[] = [];

    for (let i = 1; i <= 15; i++) {

      const ingrediente = dato['strIngredient' + i];

      if (ingrediente && ingrediente.trim() !== '') {
        ingredientes.push(ingrediente.trim());
      }

    }

    return new Bebida(
      dato.idDrink,
      dato.strDrink,
      dato.strDrinkThumb,
      dato.strCategory || '',
      dato.strAlcoholic || '',
      ingredientes,
      Math.floor(Math.random() * 10000) + 8000
    );

  }

  agregarPedido(bebida: Bebida): void {

    this.pedidos.agregar({
      id: bebida.id,
      nombre: bebida.nombre,
      imagen: bebida.imagen,
      precio: bebida.precio,
      tipo: 'bebida'
    });

    this.mostrarNotificacion(bebida.nombre);

  }

}