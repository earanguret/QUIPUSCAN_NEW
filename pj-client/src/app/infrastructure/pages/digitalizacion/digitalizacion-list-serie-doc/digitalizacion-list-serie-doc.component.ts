import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavegatorComponent } from '../../../shared/components/navegator/navegator.component';
import { SubnavegatorComponent } from '../../../shared/components/subnavegator/subnavegator.component';
import { InventarioComponent } from '../../../components/inventario/inventario.component';

@Component({
  selector: 'app-digitalizacion-list-serie-doc',
  imports: [NavegatorComponent, SubnavegatorComponent, InventarioComponent],
  templateUrl: './digitalizacion-list-serie-doc.component.html',
  styleUrl: './digitalizacion-list-serie-doc.component.css'
})
export class DigitalizacionListSerieDocComponent {
    constructor(private router:Router) { }
}
