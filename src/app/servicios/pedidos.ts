import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ProductoPedido {
  id: string;
  nombre: string;
  imagen: string;
  precio: number;
  tipo: string;
  cantidad?: number;
}

@Injectable({
  providedIn: 'root'
})
export class Pedidos {

  private listaPedidos: ProductoPedido[] = [];

  private pedidosSubject = new BehaviorSubject<ProductoPedido[]>([]);

  pedidos$ = this.pedidosSubject.asObservable();

  agregar(producto: ProductoPedido): void {

    const existente = this.listaPedidos.find(
      p => p.id === producto.id && p.tipo === producto.tipo
    );

    if (existente) {
      existente.cantidad = (existente.cantidad || 1) + 1;
    } else {
      this.listaPedidos.push({
        ...producto,
        cantidad: 1
      });
    }

    this.actualizarPedidos();
  }

  disminuir(id: string, tipo: string): void {

    const existente = this.listaPedidos.find(
      p => p.id === id && p.tipo === tipo
    );

    if (existente) {
      existente.cantidad = (existente.cantidad || 1) - 1;

      if (existente.cantidad <= 0) {
        this.eliminar(id, tipo);
        return;
      }
    }

    this.actualizarPedidos();
  }

  obtenerPedidos(): ProductoPedido[] {
    return [...this.listaPedidos];
  }

  eliminar(id: string, tipo: string): void {
    this.listaPedidos = this.listaPedidos.filter(
      p => !(p.id === id && p.tipo === tipo)
    );

    this.actualizarPedidos();
  }

  vaciar(): void {
    this.listaPedidos = [];
    this.actualizarPedidos();
  }

  calcularTotal(): number {
    return this.listaPedidos.reduce(
      (total, producto) =>
        total + producto.precio * (producto.cantidad || 1),
      0
    );
  }

  cantidadProductos(): number {
    return this.listaPedidos.reduce(
      (total, producto) => total + (producto.cantidad || 1),
      0
    );
  }

  private actualizarPedidos(): void {
    this.pedidosSubject.next([...this.listaPedidos]);
  }
}