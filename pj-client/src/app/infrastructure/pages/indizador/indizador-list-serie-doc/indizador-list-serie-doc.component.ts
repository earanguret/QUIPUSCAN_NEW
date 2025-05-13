import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavegatorComponent } from '../../../shared/components/navegator/navegator.component';
import { SubnavegatorComponent } from '../../../shared/components/subnavegator/subnavegator.component';
import { InventarioComponent } from '../../../components/inventario/inventario.component';

@Component({
  selector: 'app-indizador-list-serie-doc',
  imports: [NavegatorComponent, SubnavegatorComponent, InventarioComponent],
  templateUrl: './indizador-list-serie-doc.component.html',
  styleUrl: './indizador-list-serie-doc.component.css'
})
export class IndizadorListSerieDocComponent {

  constructor(private router:Router) { }
}
