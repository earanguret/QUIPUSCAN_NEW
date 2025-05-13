import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavegatorComponent } from '../../../shared/components/navegator/navegator.component';
import { SubnavegatorComponent } from '../../../shared/components/subnavegator/subnavegator.component';
import { InventarioComponent } from '../../../components/inventario/inventario.component';

@Component({
  selector: 'app-boveda-list-serie-doc',
  imports: [NavegatorComponent, SubnavegatorComponent, InventarioComponent],
  templateUrl: './boveda-list-serie-doc.component.html',
  styleUrl: './boveda-list-serie-doc.component.css'
})
export class BovedaListSerieDocComponent {
    constructor(private router:Router) { }
}
