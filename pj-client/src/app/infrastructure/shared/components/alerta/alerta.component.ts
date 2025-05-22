import { Component,Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alerta',
  imports: [CommonModule],
  templateUrl: './alerta.component.html',
  styleUrl: './alerta.component.css'
})
export class AlertaComponent implements OnInit {
  @Input() mensaje: string = '';
  @Input() tipo: 'success' | 'danger' | 'warning' | 'info' = 'success'; // Bootstrap types
  @Input() duracion: number = 2000;

  mostrar = false;
  visible = false;

  ngOnInit() {
    this.mostrar = true;
    setTimeout(() => this.visible = true, 10);
    setTimeout(() => this.visible = false, this.duracion - 300);
    setTimeout(() => this.mostrar = false, this.duracion);
  }
}
