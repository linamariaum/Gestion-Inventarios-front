import { Component, OnInit } from '@angular/core';
import { BienvenidaService } from '../../services/bienvenida.service';

@Component({
  selector: 'app-welcome',
  standalone: true,
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  mensaje: string = '';

  constructor(private bienvenidaService: BienvenidaService) { }

  ngOnInit() {
    this.obtenerMensajeBienvenida();
  }

  obtenerMensajeBienvenida() {
    this.bienvenidaService.bienvenida().subscribe({
      next: (response) => {
        this.mensaje = response.mensaje
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

}
