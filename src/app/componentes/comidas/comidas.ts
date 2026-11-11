import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComidasService } from '../../servicios/comidas';
import { Comida } from '../../modelos/comida';
import { Pedidos } from '../../servicios/pedidos';

@Component({
    selector: 'app-comidas',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './comidas.html',
    styleUrl: './comidas.css'
})
export class Comidas implements OnInit, OnDestroy {

    private comidasService = inject(ComidasService);
    private detector = inject(ChangeDetectorRef);
    private pedidos = inject(Pedidos);

    comidas: Comida[] = [];
    categorias: string[] = [];
    mensaje = '';
    mensajeExito = '';
    textoBusqueda = '';
    tipoBusqueda = 'ingrediente';

    private mensajeTimeout: ReturnType<typeof setTimeout> | undefined;

    ngOnInit(): void {

        this.comidasService.obtenerListaCategorias().subscribe({

            next: respuesta => {

                if (respuesta.meals) {

                    this.categorias = respuesta.meals.map(
                        (dato: any) => dato.strCategory
                    );

                    if (this.categorias.length > 0) {
                        this.seleccionarCategoria(this.categorias[0]);
                    }

                }

                this.detector.detectChanges();

            },

            error: error => {

                console.log('Error categorías:', error);
                this.mensaje = 'Error al cargar las categorías.';
                this.detector.detectChanges();

            }

        });

    }

    ngOnDestroy(): void {

        if (this.mensajeTimeout) {
            clearTimeout(this.mensajeTimeout);
        }

    }

    seleccionarCategoria(categoria: string): void {

        this.comidas = [];
        this.mensaje = '';
        this.mensajeExito = '';

        this.comidasService.obtenerComidas(categoria).subscribe({

            next: respuesta => {

                if (respuesta.meals && respuesta.meals.length > 0) {
                    this.mostrarComidas(respuesta.meals);
                } else {
                    this.mensaje = 'No se encontraron comidas.';
                }

                this.detector.detectChanges();

            },

            error: error => {

                console.log('Error al cargar comidas:', error);
                this.mensaje = 'No se pudieron cargar las comidas. Intenta nuevamente.';
                this.detector.detectChanges();

            }

        });

    }

    buscar(): void {

        const busqueda = this.textoBusqueda.trim();

        this.mensaje = '';
        this.mensajeExito = '';

        if (busqueda === '') {

            this.mensaje = 'Escribe un nombre o ingrediente.';
            this.comidas = [];
            return;

        }

        this.comidas = [];

        if (this.tipoBusqueda === 'nombre') {

            this.comidasService.buscarPorNombre(busqueda).subscribe({

                next: respuesta => {

                    if (respuesta.meals && respuesta.meals.length > 0) {
                        this.mostrarComidas(respuesta.meals, true);
                    } else {
                        this.mensaje = 'No se encontraron comidas con ese nombre.';
                    }

                    this.detector.detectChanges();

                },

                error: error => {

                    console.log('Error al buscar por nombre:', error);
                    this.mensaje = 'Error al buscar por nombre.';
                    this.detector.detectChanges();

                }

            });

        } else {

            this.comidasService.buscarPorIngrediente(busqueda).subscribe({

                next: respuesta => {

                    if (respuesta.meals && respuesta.meals.length > 0) {
                        this.mostrarComidas(respuesta.meals);
                    } else {
                        this.mensaje = 'No se encontraron comidas con ese ingrediente.';
                    }

                    this.detector.detectChanges();

                },

                error: error => {

                    console.log('Error al buscar por ingrediente:', error);
                    this.mensaje = 'Error al buscar por ingrediente.';
                    this.detector.detectChanges();

                }

            });

        }

    }

    mostrarComidas(datos: any[], tienenDetalles: boolean = false): void {

        this.comidas = datos.map((dato: any) => {

            if (tienenDetalles) {
                return this.convertirComida(dato);
            }

            return new Comida(
                dato.idMeal,
                dato.strMeal,
                dato.strMealThumb,
                '',
                '',
                [],
                Math.floor(Math.random() * 20000) + 10000
            );

        });

        this.detector.detectChanges();

        if (!tienenDetalles) {

            datos.forEach((dato: any) => {

                this.comidasService.obtenerComidaPorId(dato.idMeal).subscribe({

                    next: respuesta => {

                        if (respuesta.meals && respuesta.meals.length > 0) {

                            const detalle = this.convertirComida(respuesta.meals[0]);

                            const comidaEncontrada = this.comidas.find(
                                comida => comida.id === detalle.id
                            );

                            if (comidaEncontrada) {

                                comidaEncontrada.ingredientes = detalle.ingredientes;
                                comidaEncontrada.categoria = detalle.categoria;
                                comidaEncontrada.instrucciones = detalle.instrucciones;

                            }

                            this.detector.detectChanges();

                        }

                    },

                    error: error => {
                        console.log('No se pudieron cargar los ingredientes:', error);
                    }

                });

            });

        }

    }

    convertirComida(dato: any): Comida {

        const ingredientes: string[] = [];

        for (let i = 1; i <= 20; i++) {

            const ingrediente = dato['strIngredient' + i];

            if (ingrediente && ingrediente.trim() !== '') {
                ingredientes.push(ingrediente.trim());
            }

        }

        return new Comida(
            dato.idMeal,
            dato.strMeal,
            dato.strMealThumb,
            dato.strCategory,
            dato.strInstructions,
            ingredientes,
            Math.floor(Math.random() * 20000) + 10000
        );

    }

    agregarPedido(comida: Comida): void {

        this.pedidos.agregar({
            id: comida.id,
            nombre: comida.nombre,
            imagen: comida.imagen,
            precio: comida.precio,
            tipo: 'comida'
        });

        this.mensajeExito = comida.nombre + ' agregada a tu pedido.';

        this.detector.detectChanges();

        if (this.mensajeTimeout) {
            clearTimeout(this.mensajeTimeout);
        }

        this.mensajeTimeout = setTimeout(() => {
            this.mensajeExito = '';
            this.detector.detectChanges();
        }, 3000);

    }

}