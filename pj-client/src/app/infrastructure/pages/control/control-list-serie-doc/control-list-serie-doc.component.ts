import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavegatorComponent } from '../../../shared/components/navegator/navegator.component';
import { SubnavegatorComponent } from '../../../shared/components/subnavegator/subnavegator.component';
import { InventarioComponent } from '../../../components/inventario/inventario.component';


@Component({
  selector: 'app-control-list-serie-doc',
  imports: [NavegatorComponent, SubnavegatorComponent, InventarioComponent],
  templateUrl: './control-list-serie-doc.component.html',
  styleUrl: './control-list-serie-doc.component.css'
})
export class ControlListSerieDocComponent {
    constructor(private router:Router) { }

}
