import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavegatorComponent } from '../../shared/components/navegator/navegator.component';
import { CredencialesService } from '../../services/local/credenciales.service';

@Component({
  selector: 'app-principal',
  imports: [NavegatorComponent],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})
export class PrincipalComponent implements OnInit {

  constructor(private router: Router, private credenciales: CredencialesService) { }

  ngOnInit(): void {
    console.log();
  }

  recepcion_serie_documental() {
    this.router.navigate(['principal/recepcion/list-serie-documental']);
  }
  preparacion_documentos() {
    this.router.navigate(['principal/preparacion/list-serie-documental']);
  }
  digitalizacion() {
    this.router.navigate(['principal/digitalizacion/list-serie-documental']);
  }
  indizador() {
    this.router.navigate(['principal/indizador/list-serie-documental'])
  }
  controlCalidad() {
    this.router.navigate(['principal/controlcalidad/list-serie-documental'])
  }
  fedatario() {
    this.router.navigate(['principal/fedatario/list-serie-documental'])
  }
  boveda() {
    this.router.navigate(['principal/boveda/list-serie-documental'])
  }
  reporte() {
    this.router.navigate(['/principal/reportes'])
  }
  usuarios() {
    this.router.navigate(['/principal/list-usuario']);
  }
}
