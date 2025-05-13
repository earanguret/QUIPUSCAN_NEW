import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavegatorComponent } from '../../../shared/components/navegator/navegator.component';
import { SubnavegatorComponent } from '../../../shared/components/subnavegator/subnavegator.component';

@Component({
  selector: 'app-fedatario-expedientes',
  imports: [NavegatorComponent, SubnavegatorComponent],
  templateUrl: './fedatario-expedientes.component.html',
  styleUrl: './fedatario-expedientes.component.css'
})
export class FedatarioExpedientesComponent {
    constructor(private router:Router) { }
}
