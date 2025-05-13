import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavegatorComponent } from '../../../shared/components/navegator/navegator.component';
import { SubnavegatorComponent } from '../../../shared/components/subnavegator/subnavegator.component';
import { InventarioComponent } from '../../../components/inventario/inventario.component';

@Component({
  selector: 'app-recepcion-list-serie-doc',
  imports: [NavegatorComponent, SubnavegatorComponent, InventarioComponent],
  templateUrl: './recepcion-list-serie-doc.component.html',
  styleUrl: './recepcion-list-serie-doc.component.css'
})
export class RecepcionListSerieDocComponent {

  constructor(private router:Router) { }
}
