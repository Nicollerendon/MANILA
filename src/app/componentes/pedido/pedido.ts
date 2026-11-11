import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Pedidos, ProductoPedido } from '../../servicios/pedidos';

@Component({
  selector: 'app-pedido',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pedido.html',
  styleUrl: './pedido.css'
})
export class Pedido implements OnInit, OnDestroy {

  private pedidosService = inject(Pedidos);
  private detector = inject(ChangeDetectorRef);

  pedidos: ProductoPedido[] = [];
  suscripcion!: Subscription;

  nombre = '';
  celular = '';
  direccion = '';
  mensaje = '';

  ngOnInit(): void {
    this.suscripcion = this.pedidosService.pedidos$.subscribe({
      next: productos => {
        this.pedidos = productos;
        this.detector.detectChanges();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.suscripcion) {
      this.suscripcion.unsubscribe();
    }
  }

  calcularTotal(): number {
    return this.pedidosService.calcularTotal();
  }

  aumentar(producto: ProductoPedido): void {
    this.pedidosService.agregar(producto);
  }

  disminuir(producto: ProductoPedido): void {
    if ((producto.cantidad || 1) > 1) {
      this.pedidosService.disminuir(producto.id, producto.tipo);
    } else {
      this.pedidosService.eliminar(producto.id, producto.tipo);
    }
  }

  eliminar(producto: ProductoPedido): void {
    this.pedidosService.eliminar(producto.id, producto.tipo);
  }

  realizarPedido(): void {

    if (!this.nombre.trim() || !this.celular.trim() || !this.direccion.trim()) {
      this.mensaje = 'Completa todos los datos del cliente.';
      return;
    }

    if (this.pedidos.length === 0) {
      this.mensaje = 'Agrega productos antes de realizar tu pedido.';
      return;
    }

    this.mensaje = '¡Gracias ' + this.nombre + '! Tu pedido ha sido registrado.';

    this.pedidosService.vaciar();

    this.nombre = '';
    this.celular = '';
    this.direccion = '';
  }
}