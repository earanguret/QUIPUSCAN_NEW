import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavegatorComponent } from '../../../shared/components/navegator/navegator.component';
import { SubnavegatorComponent } from '../../../shared/components/subnavegator/subnavegator.component';

@Component({
  selector: 'app-preparacion-expedientes',
  imports: [NavegatorComponent, SubnavegatorComponent],
  templateUrl: './preparacion-expedientes.component.html',
  styleUrl: './preparacion-expedientes.component.css'
})
export class PreparacionExpedientesComponent {
    constructor(private router:Router) { }

}
