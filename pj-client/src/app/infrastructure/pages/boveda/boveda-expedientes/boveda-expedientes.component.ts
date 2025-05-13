import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavegatorComponent } from '../../../shared/components/navegator/navegator.component';
import { SubnavegatorComponent } from '../../../shared/components/subnavegator/subnavegator.component';

@Component({
  selector: 'app-boveda-expedientes',
  imports: [NavegatorComponent, SubnavegatorComponent],
  templateUrl: './boveda-expedientes.component.html',
  styleUrl: './boveda-expedientes.component.css'
})
export class BovedaExpedientesComponent {
    constructor(private router:Router) { }
}
