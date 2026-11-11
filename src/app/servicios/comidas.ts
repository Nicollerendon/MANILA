import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, retry } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComidasService {

  private http = inject(HttpClient);

  private url = '/api/json/v1/1/';

  private consultar(direccion: string): Observable<any> {
    return this.http.get<any>(this.url + direccion).pipe(
      retry({
        count: 2,
        delay: 1000
      })
    );
  }

  obtenerListaCategorias(): Observable<any> {
    return this.consultar('list.php?c=list');
  }

  obtenerCategorias(): Observable<any> {
    return this.consultar('categories.php');
  }

  obtenerComidas(categoria: string): Observable<any> {
    return this.consultar(
      'filter.php?c=' + encodeURIComponent(categoria)
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

  obtenerComidaPorId(id: string): Observable<any> {
    return this.consultar(
      'lookup.php?i=' + encodeURIComponent(id)
    );
  }

}