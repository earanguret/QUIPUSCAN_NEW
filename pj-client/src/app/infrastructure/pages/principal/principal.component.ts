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

  disableInventario = 'display: none';
  disablePreparador = 'display: none';
  disableDigitalizador = 'display: none';
  disableIndizador = 'display: none';
  disableControlCalidad = 'display: none';
  disableFedatario = 'display: none';
  disableLeyenda = 'display: none';
  disableUsuarios = 'display: none';
  disableBusqueda = 'display: none';
  disableReporte = 'display: none';
  disableConfiguracion = 'display: none';
  disableBoveda = 'display: none';

  constructor(private router: Router, private credenciales: CredencialesService) { }

  ngOnInit(): void {
    this.permisos();
  }

  //#region FUNCIONES PRINCIPALES*************************************************************************
  permisos() {
    if (this.credenciales.credenciales.perfil == 'SUPERVISORL' || this.credenciales.credenciales.perfil == 'ADMINISTRADOR') {
      this.disableInventario = 'display: block';
      this.disablePreparador = 'display: block';
      this.disableDigitalizador = 'display: block';
      this.disableIndizador = 'display: block';
      this.disableControlCalidad = 'display: block';
      this.disableFedatario = 'display: block';
      this.disableLeyenda = 'display: block';
      this.disableUsuarios = 'display: block';
      this.disableBusqueda = 'display: block';
      this.disableReporte = 'display: block';
      this.disableConfiguracion = 'display: block';
      this.disableBoveda = 'display: block';

    }
    if (this.credenciales.credenciales.perfil == 'PREPARADOR') {
      this.disablePreparador = 'display: block';
    }
    if (this.credenciales.credenciales.perfil== 'DIGITALIZADOR') {
      this.disableDigitalizador = 'display: block';
      this.disableBoveda = 'display: block';
    }
    if (this.credenciales.credenciales.perfil == 'INDIZADOR') {
      this.disableIndizador = 'display: block';
    }
    if (this.credenciales.credenciales.perfil == 'CONTROLADOR') {
      this.disableControlCalidad = 'display: block';
    }
    if (this.credenciales.credenciales.perfil== 'FEDATARIO') {
      this.disableFedatario = 'display: block';
    }

  }
  //#endregion *******************************************************************************************


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
