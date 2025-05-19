import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subnavegator',
  imports: [],
  templateUrl: './subnavegator.component.html',
  styleUrl: './subnavegator.component.css'
})
export class SubnavegatorComponent implements OnInit {
  @Input() ruta!: string;

  ngOnInit(): void {
    if (!this.ruta) {
      this.ruta = '/principal';
    }
  }

  constructor(private router:Router) { }

  volver(){
    console.log(this.ruta);
    this.router.navigate([this.ruta]);
  }
}
