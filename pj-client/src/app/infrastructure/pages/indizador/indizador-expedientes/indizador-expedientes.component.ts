import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavegatorComponent } from '../../../shared/components/navegator/navegator.component';
import { SubnavegatorComponent } from '../../../shared/components/subnavegator/subnavegator.component';

@Component({
  selector: 'app-indizador-expedientes',
  imports: [NavegatorComponent, SubnavegatorComponent],
  templateUrl: './indizador-expedientes.component.html',
  styleUrl: './indizador-expedientes.component.css'
})
export class IndizadorExpedientesComponent {
    constructor(private router:Router) { }
}
