import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavegatorComponent } from '../../shared/navegator/navegator.component';
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

  inventario_digitalizacion() {
    this.router.navigate(['principal/inventario']);
  }
  preparacion_documentos() {
    this.router.navigate(['principal/preparaciondocumentos']);
  }
  digitalizacion() {
    this.router.navigate(['principal/digitalizacion']);
  }
  controlCalidad() {
    this.router.navigate(['principal/controlcalidad'])
  }
  indizador() {
    this.router.navigate(['principal/indizador'])
  }
  usuarios() {
    this.router.navigate(['/principal/list-usuario']);
  }
  fedatario() {
    this.router.navigate(['/principal/fedatario'])
  }
  boveda() {
    this.router.navigate(['/principal/boveda'])
  }
  reporte() {
    this.router.navigate(['/principal/reportes'])
  }
}
