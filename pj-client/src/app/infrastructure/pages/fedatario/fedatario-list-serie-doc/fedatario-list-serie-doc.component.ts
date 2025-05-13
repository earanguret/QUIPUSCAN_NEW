import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavegatorComponent } from '../../../shared/components/navegator/navegator.component';
import { SubnavegatorComponent } from '../../../shared/components/subnavegator/subnavegator.component';
import { InventarioComponent } from '../../../components/inventario/inventario.component';

@Component({
  selector: 'app-fedatario-list-serie-doc',
  imports: [NavegatorComponent, SubnavegatorComponent, InventarioComponent],
  templateUrl: './fedatario-list-serie-doc.component.html',
  styleUrl: './fedatario-list-serie-doc.component.css'
})
export class FedatarioListSerieDocComponent {
    constructor(private router:Router) { }
}
