import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-inventario',
  imports: [],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.css'
})
export class InventarioComponent implements OnInit {
  @Input() ruta!: string;

  ngOnInit(): void {
    if (!this.ruta) {
      this.ruta = '/principal';
    }
  }

  constructor(private router:Router) { }

 
}
