import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavegatorComponent } from '../../../shared/components/navegator/navegator.component';
import { SubnavegatorComponent } from '../../../shared/components/subnavegator/subnavegator.component';

@Component({
  selector: 'app-recepcion-expedientes',
  imports: [NavegatorComponent, SubnavegatorComponent],
  templateUrl: './recepcion-expedientes.component.html',
  styleUrl: './recepcion-expedientes.component.css'
})
export class RecepcionExpedientesComponent {

  constructor(private router:Router) { }
}
