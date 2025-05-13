import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavegatorComponent } from '../../shared/components/navegator/navegator.component';
import { SubnavegatorComponent } from '../../shared/components/subnavegator/subnavegator.component';

@Component({
  selector: 'app-reporte',
  imports: [NavegatorComponent, SubnavegatorComponent],
  templateUrl: './reporte.component.html',
  styleUrl: './reporte.component.css'
})
export class ReporteComponent {
    constructor(private router:Router) { }
}
