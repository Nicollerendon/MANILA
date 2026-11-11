import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, retry, timeout } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BebidasService {

  private http = inject(HttpClient);

  private url = '/cocktail-api/json/v1/1/';

  private consultar(direccion: string): Observable<any> {
    return this.http.get<any>(this.url + direccion).pipe(
      timeout(15000),
      retry({
        count: 2,
        delay: 1000
      })
    );
  }

  obtenerListaCategorias(): Observable<any> {
    return this.consultar('list.php?c=list');
  }

  obtenerTipos(): Observable<any> {
    return this.consultar('list.php?a=list');
  }

  obtenerBebidas(categoria: string): Observable<any> {
    return this.consultar(
      'filter.php?c=' + encodeURIComponent(categoria)
    );
  }

  filtrarPorTipo(tipo: string): Observable<any> {
    return this.consultar(
      'filter.php?a=' + encodeURIComponent(tipo)
    );
  }

  buscarPorNombre(nombre: string): Observable<any> {
    return this.consultar(
      'search.php?s=' + encodeURIComponent(nombre)
    );
  }

  buscarPorIngrediente(ingrediente: string): Observable<any> {
    return this.consultar(
      'filter.php?i=' + encodeURIComponent(ingrediente)
    );
  }

  obtenerBebidaPorId(id: string): Observable<any> {
    return this.consultar(
      'lookup.php?i=' + encodeURIComponent(id)
    );
  }

  obtenerBebidaAleatoria(): Observable<any> {
    return this.consultar('random.php');
  }

}