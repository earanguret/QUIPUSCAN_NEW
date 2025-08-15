import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavegatorComponent } from '../../shared/components/navegator/navegator.component';
import { SubnavegatorComponent } from '../../shared/components/subnavegator/subnavegator.component';
import { SupervisorLineaService } from '../../services/local/supervisorLinea.service';
import { UsuarioSupervisorLineaResponse } from '../../../domain/dto/UsuarioResponse.dto';

@Component({
  selector: 'app-reporte',
  imports: [NavegatorComponent, SubnavegatorComponent],
  templateUrl: './reporte.component.html',
  styleUrl: './reporte.component.css'
})
export class ReporteComponent implements OnInit {
  
    constructor(private router:Router, private supervisorLineaService:SupervisorLineaService) { }

     supervisor:UsuarioSupervisorLineaResponse = {
        id_usuario: 0,
        username: '',
        perfil: '',
        estado: false,
        nombre: '',
        ap_paterno: '',
        ap_materno:  '' 
     } 



    ngOnInit(): void {
       this.supervisor= this.supervisorLineaService.supervisor   
    }
}
