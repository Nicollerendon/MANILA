import { TestBed } from '@angular/core/testing';
import { Comidas } from './comidas';

describe('Comidas', () => {
  let service: Comidas;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Comidas);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
