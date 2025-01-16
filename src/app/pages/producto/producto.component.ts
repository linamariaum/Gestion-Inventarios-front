import { Component, OnInit } from '@angular/core';
import { ProductoListaComponent } from './producto-lista/producto-lista.component';

@Component({
  selector: 'app-producto',
  standalone: true,
  templateUrl: './producto.component.html',
  imports: [ProductoListaComponent]
})
export class ProductoComponent implements OnInit {

  constructor() {}

  ngOnInit(): void { }
}
