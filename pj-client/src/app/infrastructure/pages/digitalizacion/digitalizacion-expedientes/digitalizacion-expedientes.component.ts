import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavegatorComponent } from '../../../shared/components/navegator/navegator.component';
import { SubnavegatorComponent } from '../../../shared/components/subnavegator/subnavegator.component';

@Component({
  selector: 'app-digitalizacion-expedientes',
  imports: [NavegatorComponent, SubnavegatorComponent],
  templateUrl: './digitalizacion-expedientes.component.html',
  styleUrl: './digitalizacion-expedientes.component.css'
})
export class DigitalizacionExpedientesComponent {

  constructor(private router:Router) { }
}
