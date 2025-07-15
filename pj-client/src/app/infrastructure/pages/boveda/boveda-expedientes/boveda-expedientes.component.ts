import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavegatorComponent } from '../../../shared/components/navegator/navegator.component';
import { SubnavegatorComponent } from '../../../shared/components/subnavegator/subnavegator.component';
import { InfoInventarioComponent } from '../../../components/info-inventario/info-inventario.component';

@Component({
  selector: 'app-boveda-expedientes',
  imports: [NavegatorComponent, SubnavegatorComponent, InfoInventarioComponent],
  templateUrl: './boveda-expedientes.component.html',
  styleUrl: './boveda-expedientes.component.css'
})
export class BovedaExpedientesComponent implements OnInit {

    id_inventario: number = 0;
    constructor(private router:Router , private activatedRoute:ActivatedRoute) { }

    ngOnInit(): void {
        this.id_inventario = this.activatedRoute.snapshot.params['id'];
    }

    
}
