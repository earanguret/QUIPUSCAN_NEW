import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SweetAlert {

  constructor() { }

  // Función para mostrar mensaje de éxito en formato toast
  MensajeToast(mensaje: string, time: number) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: time,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      }
    });

    Toast.fire({
      icon: 'success',
      title: mensaje
    });
  }

  MensajeError(mensaje:string){
    Swal.fire({
      icon: 'error',
      title: mensaje
    });
  }   

  MensajeExito(mensaje:string){
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: mensaje,
      showConfirmButton: false,
      timer: 1500
    });
  }

  async MensajeConfirmacionEliminar(mensaje: string): Promise<boolean> {
    return Swal.fire({
      title: '¿Estás seguro?',
      text: mensaje,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      return result.isConfirmed; // Retorna true si se confirma, false si se cancela
    });
  }

  async MensajeConfirmacion(mensaje: string): Promise<boolean> {
    return Swal.fire({
      title: '¿Estás seguro?',
      text: mensaje,
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      return result.isConfirmed; // Retorna true si se confirma, false si se cancela
    });
  }

  async MensajeSimpleWarning(title: string, text: string ){
    Swal.fire({
      title: title,
      text: text,
      icon: "warning"
    });
  }

  async MensajeSimpleInfo(title: string, text: string ){
    Swal.fire({
      title: title,
      text: text,
      icon: "info"
    });
  }

}