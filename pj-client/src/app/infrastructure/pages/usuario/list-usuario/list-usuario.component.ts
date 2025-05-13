import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavegatorComponent } from '../../../shared/navegator/navegator.component';
import { SubnavegatorComponent } from '../../../shared/subnavegator/subnavegator.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { UsuarioResponse } from '../../../../domain/dto/UsuarioResponse.dto';
import { UsuarioService } from '../../../services/remoto/usuario/usuario.service';
import { CredencialesService } from '../../../services/local/credenciales.service';

@Component({
  selector: 'app-list-usuario',
  imports: [SubnavegatorComponent, NavegatorComponent, CommonModule, NgxPaginationModule],
  templateUrl: './list-usuario.component.html',
  styleUrl: './list-usuario.component.css'
})
export class ListUsuarioComponent implements OnInit {

  listaUsuarios:UsuarioResponse[]=[];
  listaUsuariosTemp:UsuarioResponse[]=[];

  p:number=1;

  constructor(private router:Router, private usuarioService:UsuarioService, private credencialesService:CredencialesService) { }

  ngOnInit(): void {
    this.ObtenerListaUsuarios()
  }

  ObtenerListaUsuarios(){
    this.usuarioService.ListarUsuarios().subscribe({
      next: (data:UsuarioResponse[])=>{
        this.listaUsuarios=data;
      },
      error:()=>{
        console.error('error');
      },
      complete:()=>{
        console.log('lista de usuarios cargada');
      }
    })
  }

  CrearUsuario(){
    this.router.navigate(['principal/form-usuario']);
  }

  modificarUsuario(id_usuario:number){
    this.router.navigate(['principal/form-usuario/modificar/'+id_usuario]);
  }

  buscarEnObjeto(event: any) {
    
  }
  
}
