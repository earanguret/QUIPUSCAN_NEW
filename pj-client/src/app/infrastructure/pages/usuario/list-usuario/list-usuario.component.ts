import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavegatorComponent } from '../../../shared/components/navegator/navegator.component';
import { SubnavegatorComponent } from '../../../shared/components/subnavegator/subnavegator.component';
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
        this.listaUsuariosTemp=data;
        console.log(this.listaUsuarios);
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
    this.router.navigate(['principal/form-usuario/',id_usuario]);
  }

  buscarEnObjeto(event: any) {
    this.p = 1;
    const textoBusqueda = (event.target.value || '').toLowerCase();
  
    this.listaUsuarios = this.listaUsuariosTemp.filter((usuario: UsuarioResponse) => {
      const username = (usuario.username ?? '').toLowerCase();
      const nombre = (usuario.nombre ?? '').toLowerCase();
      const apPaterno = (usuario.ap_paterno ?? '').toLowerCase();
      const apMaterno = (usuario.ap_materno ?? '').toLowerCase();
      const dni = (usuario.dni ?? '').toLowerCase();
      const perfil = (usuario.perfil ?? '').toLowerCase();
      const estadoTexto = usuario.estado ? 'activo' : 'inactivo';
      // concatenamos nombre completo
      const nombreCompleto = `${nombre} ${apPaterno} ${apMaterno}`.trim();
      return (
        username.includes(textoBusqueda) ||
        nombre.includes(textoBusqueda) ||
        apPaterno.includes(textoBusqueda) ||
        apMaterno.includes(textoBusqueda) ||
        nombreCompleto.includes(textoBusqueda) ||
        dni.includes(textoBusqueda) ||
        perfil.includes(textoBusqueda) ||
        estadoTexto.startsWith(textoBusqueda) // evita confusión activo/inactivo
      );
    });
  }
}
