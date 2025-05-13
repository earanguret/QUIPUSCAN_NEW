import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavegatorComponent } from '../../../shared/components/navegator/navegator.component';
import { SubnavegatorComponent } from '../../../shared/components/subnavegator/subnavegator.component';

@Component({
  selector: 'app-control-expedientes',
  imports: [NavegatorComponent, SubnavegatorComponent],
  templateUrl: './control-expedientes.component.html',
  styleUrl: './control-expedientes.component.css'
})
export class ControlExpedientesComponent {
    constructor(private router:Router) { }

}
