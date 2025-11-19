import { Component, OnInit } from '@angular/core';
import { NavegatorComponent } from '../../shared/components/navegator/navegator.component';
import { SubnavegatorComponent } from '../../shared/components/subnavegator/subnavegator.component';
import { ConfiguracionService } from '../../services/remoto/configuracion/configuracion.service';
import { CrearEspecialidadResponse, CrearJuzgadoResponse, CrearMateriaResponse, CrearSedeResponse, CrearTipoDocumentoResponse, CrearTipoProcesoResponse, EliminarEspecialidadResponse, EliminarJuzgadoResponse, EliminarMateriaResponse, EliminarSedeResponse, EliminarTipoDocumentoResponse, EliminarTipoProcesoResponse, EspecialidadResponse, GeneralResponse, JuzgadoResponse, MateriaResponse, ModificarGeneralResponse, SedeResponse, TipoDocumentoResponse, TipoProcesoResponse } from '../../../domain/dto/ConfiguracionResponse.dto';
import { CredencialesService } from '../../services/local/credenciales.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SweetAlert } from '../../shared/animate-messages/sweetAlert';
import { EspecialidadRequest, GeneralRequest, JuzgadoRequest, SedeRequest, TipoDocumentoRequest } from '../../../domain/dto/ConfiguracionRequest.dto';
import { form_general_modificar_vf } from '../../validator/fromValidator/configuracion.validator';

declare var bootstrap: any;

@Component({
  selector: 'app-configuracion',
  imports: [NavegatorComponent, SubnavegatorComponent, FormsModule, CommonModule],
  templateUrl: './configuracion.component.html',
  styleUrl: './configuracion.component.css'
})
export class ConfiguracionComponent implements OnInit {



  constructor(private configuracionService: ConfiguracionService, private credencialesService: CredencialesService, private sweetAlert: SweetAlert) { }

  especialidad_list: EspecialidadResponse[] = [];
  sedes_list: SedeResponse[] = [];
  juzgados_list: JuzgadoResponse[] = [];
  juzgados_list_temp: JuzgadoResponse[] = [];
  materia_list: MateriaResponse[] = [];
  materia_list_temp: MateriaResponse[] = [];
  tipo_documento_list: TipoDocumentoResponse[] = [];
  tipo_proceso_list: TipoProcesoResponse[] = [];
  tipo_proceso_list_temp: TipoProcesoResponse[] = [];

  nuevaEspecialidad: string = '';
  nuevaSede: string = '';
  nuevoJuzgado: string = '';
  nuevaMateria: string = '';
  nuevaTipoDocumento: string = '';
  nuevaTipoProceso: string = '';
  activeSection: string = 'general';
  activeSubSection: string = 'juzgados';

  myModalSede: any;
  myModalEspecialidad: any;
  myModalTipoDocumento: any;
  myModalJuzgado: any;
  myModalMateria: any;
  myModalTipoProceso: any;

  data_general: GeneralResponse = {
    id_general: 0,
    create_at: null,
    institucion: '',
    direccion: '',
    ruc: '',
    departamento: ''
  }

  ngOnInit(): void {
    this.obtenerListaEspecialidad();
    this.obtenerListaSedes();
    this.obtenerListaJuzgados();
    this.obtenerListaMateria();
    this.obtenerListaTipoDocumento();
    this.obtenerListaTipoProceso();
    this.obtenerDatosGeneral();
    this.inicializadorModales();
  }

  showSection(section: string) {
    this.activeSection = section;
  }
  showSubSection(SubSection: string) {
    this.activeSubSection = SubSection;
  }

  inicializadorModales() {
    this.myModalSede = new bootstrap.Modal(document.getElementById('ModalRegistrarSede'), {
      backdrop: true,
      keyboard: true
    });

    this.myModalEspecialidad = new bootstrap.Modal(document.getElementById('ModalRegistrarEspecialidad'), {
      backdrop: true,
      keyboard: true
    });

    this.myModalTipoDocumento = new bootstrap.Modal(document.getElementById('ModalTipoDocumento'), {
      backdrop: true,
      keyboard: true
    });

    this.myModalJuzgado = new bootstrap.Modal(document.getElementById('ModalJuzgadoOrigen'), {
      backdrop: true,
      keyboard: true
    });

    this.myModalTipoProceso = new bootstrap.Modal(document.getElementById('ModalTipoProceso'), {
      backdrop: true,
      keyboard: true
    });

    this.myModalMateria = new bootstrap.Modal(document.getElementById('ModalMateria'), {
      backdrop: true,
      keyboard: true
    });
  }

  openModalRegistrarSede() {
    this.myModalSede.show();
  }
  closeModalRegistrarSede() {
    this.myModalSede.hide();
  }

  openModalRegistrarEspecialidad() {
    this.myModalEspecialidad.show();
  }
  closeModalRegistrarEspecialidad() {
    this.myModalEspecialidad.hide();
  }

  openModalRegistrarTipoDocumento() {
    this.myModalTipoDocumento.show();
  }
  closeModalTipoDocumento() {
    this.myModalTipoDocumento.hide();
  }

  openModalRegistrarJuzgado() {
    this.myModalJuzgado.show();
  }
  closeModalJuzgado() {
    this.myModalJuzgado.hide();
  }

  openModalRegistrarTipoProceso() {
    this.myModalTipoProceso.show();
  }
  closeModalRegistrarTipoProceso() {
    this.myModalTipoProceso.hide();
  }

  openModalRegistrarMateria() {
    this.myModalMateria.show();
  }
  closeModalRegistrarMateria() {
    this.myModalMateria.hide();
  }

  // GENERAL
  obtenerDatosGeneral() {
    this.configuracionService.ObtenerDatosGeneral().subscribe({
      next: (data: GeneralResponse) => {
        this.data_general = data;
        console.log(data);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('obtener datos general completado');
      }
    })
  }

  modificarGeneral(id_general: number) {
    const data_general: GeneralRequest = {
      institucion: this.data_general.institucion,
      direccion: this.data_general.direccion,
      ruc: this.data_general.ruc,
      departamento: this.data_general.departamento,
      app_user: this.credencialesService.credenciales.username
    }
    const erroresValidacion = form_general_modificar_vf(data_general);
    if (erroresValidacion.length > 0) {
      let errorMensaje = '';
      erroresValidacion.forEach((error: any) => {
        errorMensaje += `Error en el campo :"${error.campo}": ${error.mensaje} \n`;
      });
      return alert(errorMensaje);
    }

    this.configuracionService.ModificarGeneral(data_general, id_general).subscribe({
      next: (data: ModificarGeneralResponse) => {
        console.log(data.message);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('modificacion de general completado');
        this.obtenerDatosGeneral();
        this.sweetAlert.MensajeToast('Datos guardados', 3000);
      }
    })
  }
  // ESPECIALIDAD
  obtenerListaEspecialidad() {
    this.configuracionService.ListarEspecialidad().subscribe({
      next: (data: EspecialidadResponse[]) => {
        this.especialidad_list = data;
        console.log(data);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('listado de especialidad completado');
      }
    })
  }

  guardarEspecialidad() {
    if (!this.nuevaEspecialidad) {
      alert('Debe ingresar la descripcion de la especialidad')
      return;
    }
    const data_especialidad: EspecialidadRequest = {
      especialidad: this.nuevaEspecialidad,
      app_user: this.credencialesService.credenciales.username
    }
    this.configuracionService.CrearEspecialidad(data_especialidad).subscribe({
      next: (data: CrearEspecialidadResponse) => {
        console.log(data.message);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('creacion de especialidad completado');
        this.limpiarDatosEspecialidad();
        this.obtenerListaEspecialidad();
        this.closeModalRegistrarEspecialidad();
      }
    })
  }

  eliminarEspecialidad(id_especialidad: number) {
    let app_user = this.credencialesService.credenciales.username;
    this.sweetAlert.MensajeConfirmacionEliminar('¿Deseas eliminar la especialidad?')
      .then((result) => {
        if (result) {
          this.configuracionService.EliminarEspecialidad(id_especialidad, app_user).subscribe({
            next: (data: EliminarEspecialidadResponse) => {
              console.log(data.message);
            },
            error: (error) => {
              console.log(error);
            },
            complete: () => {
              console.log('eliminacion de especialidad completado');
              this.obtenerListaEspecialidad();
            }
          })
        }
      })
      .catch((error) => {
        console.error('Error al eliminar la especialidad:', error);
      });
  }

  limpiarDatosEspecialidad() {
    this.nuevaEspecialidad = ''
  }

  // SEDE
  obtenerListaSedes() {
    this.configuracionService.ListarSedes().subscribe({
      next: (data: SedeResponse[]) => {
        this.sedes_list = data;
        console.log(data);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('listado de sedes completado');
      }
    })
  }

  guardarSede() {
    if (!this.nuevaSede) {
      alert('Debe ingresar la descripcion de la sede')
      return;
    }
    const data_sede: SedeRequest = {
      sede: this.nuevaSede,
      app_user: this.credencialesService.credenciales.username
    }
    this.configuracionService.CrearSede(data_sede).subscribe({
      next: (data: CrearSedeResponse) => {
        console.log(data.message);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('creacion de sede completado');
        this.limpiarDatosSede();
        this.obtenerListaSedes();
        this.closeModalRegistrarSede();
      }
    })
  }

  eliminarSede(id_sede: number) {

    let app_user = this.credencialesService.credenciales.username;
    this.sweetAlert.MensajeConfirmacionEliminar('¿Deseas eliminar la sede?')
      .then((result) => {
        if (result) {
          this.configuracionService.EliminarSede(id_sede, app_user).subscribe({
            next: (data: EliminarSedeResponse) => {
              console.log(data.message);
            },
            error: (error) => {
              console.log(error);
            },
            complete: () => {
              console.log('eliminacion de sede completado');
              this.obtenerListaSedes();
            }
          })
        }
      })
      .catch((error) => {
        console.error('Error al eliminar la sede:', error);
      });
  }

  limpiarDatosSede() {
    this.nuevaSede = ''
  }

  // TIPO DE DOCUMENTO
  obtenerListaTipoDocumento() {
    this.configuracionService.ListarTipoDocumento().subscribe({
      next: (data: TipoDocumentoResponse[]) => {
        this.tipo_documento_list = data;
        console.log(data);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  guardarTipoDocumento() {
    if (!this.nuevaTipoDocumento) {
      alert('Debe ingresar la descripcion de la del tipo de documento')
      return;
    }
    const data_tipo_documento: TipoDocumentoRequest = {
      tipo_documento: this.nuevaTipoDocumento,
      app_user: this.credencialesService.credenciales.username
    }

    this.configuracionService.CrearTipoDocumento(data_tipo_documento)
      .subscribe({
        next: (data: CrearTipoDocumentoResponse) => {
          console.log(data.message);
        },
        error: (error) => {
          console.error('Error al crear el tipo de documento:', error);

        },
        complete: () => {
          console.log('creacion de tipo de documento completado');
          this.limpiarDatosTipoDocumento();
          this.obtenerListaTipoDocumento();
          this.closeModalTipoDocumento();
        }
      });
  }

  eliminarTipoDocumento(id_tipo_documento: number) {
    let app_user = this.credencialesService.credenciales.username;
    this.sweetAlert.MensajeConfirmacionEliminar('¿Deseas eliminar el tipo de documento?')
      .then((result) => {
        if (result) {
          this.configuracionService.EliminarTipoDocumento(id_tipo_documento, app_user)
            .subscribe({
              next: (data: EliminarTipoDocumentoResponse) => {
                console.log(data.message);
              },
              error: (error) => {
                console.error('Error al eliminar el tipo de documento:', error);

              },
              complete: () => {
                console.log('eliminacion de tipo de documento completado');
                this.obtenerListaTipoDocumento();
              }
            });
        }
      })
      .catch((error) => {
        console.error('Error al eliminar el tipo de documento:', error);
      });


  }

  limpiarDatosTipoDocumento() {
    this.nuevaTipoDocumento = ''
  }

  // JUZGADO DE ORIGEN
  obtenerListaJuzgados() {
    this.configuracionService.ListarJuzgado().subscribe({
      next: (data: JuzgadoResponse[]) => {
        this.juzgados_list = data;
        this.juzgados_list_temp = data;
        console.log(data);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('listado de juzgados completado');
      }
    })
  }

  limpiarDatosJuzgado() {
    this.nuevoJuzgado = ''
  }

  guardarJuzgadoOrigen() {
    const data_juzgado: JuzgadoRequest = {
      juzgado: this.nuevoJuzgado,
      app_user: this.credencialesService.credenciales.username
    }
    console.log(data_juzgado)
    this.configuracionService.CrearJuzgado(data_juzgado).subscribe({
      next: (data: CrearJuzgadoResponse) => {
        console.log(data.message);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('creacion de juzgado completado');
        this.limpiarDatosJuzgado();
        this.obtenerListaJuzgados();
        this.closeModalJuzgado();
      }
    })
  }

  eliminarJuzgado(id_juzgado: number) {
    let app_user = this.credencialesService.credenciales.username;
    this.sweetAlert.MensajeConfirmacionEliminar('¿Deseas eliminar el juzgado?')
      .then((result) => {
        if (result) {
          this.configuracionService.EliminarJuzgado(id_juzgado, app_user).subscribe({
            next: (data: EliminarJuzgadoResponse) => {
              console.log(data.message);
            },
            error: (error) => {
              console.log(error);
            },
            complete: () => {
              console.log('eliminacion de juzgado completado');
              this.obtenerListaJuzgados();
            }
          })
        }
      })
      .catch((error) => {
        console.error('Error al eliminar el juzgado:', error);
      });
  }

  buscarJuzgado(event: any) {
    let objetosFiltrados = []
    const textoBusqueda = event.target.value.toLowerCase();
    objetosFiltrados = this.juzgados_list_temp.filter((objeto:
      {
        juzgado: string;
      }) => {
      const nombre_expediente = objeto.juzgado.toLowerCase();
      return nombre_expediente.includes(textoBusqueda);
    });
    this.juzgados_list = objetosFiltrados
  }

  // MATERIA
  obtenerListaMateria() {
    this.configuracionService.ListarMateria().subscribe({
      next: (data: MateriaResponse[]) => {
        this.materia_list = data;
        this.materia_list_temp = data;
        console.log(data);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('listado de materias completado');
      }
    })
  }

  guardarMateria() {
    const data_materia = {
      materia: this.nuevaMateria,
      app_user: this.credencialesService.credenciales.username
    }
    console.log(data_materia)
    this.configuracionService.CrearMateria(data_materia).subscribe({
      next: (data: CrearMateriaResponse) => {
        console.log(data.message);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('creacion de materia completado');
        this.limpiarDatosMateria();
        this.obtenerListaMateria();
        this.closeModalRegistrarMateria();
      }
    })
  }

  eliminarMateria(id_materia: number) {
    let app_user = this.credencialesService.credenciales.username;
    this.sweetAlert.MensajeConfirmacionEliminar('¿Deseas eliminar la materia?')
      .then((result) => {
        if (result) {
          this.configuracionService.EliminarMateria(id_materia, app_user).subscribe({
            next: (data: EliminarMateriaResponse) => {
              console.log(data.message);
            },
            error: (error) => {
              console.log(error);
            },
            complete: () => {
              console.log('eliminacion de materia completado');
              this.obtenerListaMateria();
            }
          })
        }
      })
      .catch((error) => {
        console.error('Error al eliminar la materia:', error);
      });
  }

  buscarMateria(event: any) {
    let objetosFiltrados = []
    const textoBusqueda = event.target.value.toLowerCase();
    objetosFiltrados = this.materia_list_temp.filter((objeto:
      {
        materia: string;
      }) => {
      const nombre_expediente = objeto.materia.toLowerCase();
      return nombre_expediente.includes(textoBusqueda);
    });
    this.materia_list = objetosFiltrados
  }

  limpiarDatosMateria() {
    this.nuevaMateria = ''
  }

  // TIPO DE PROCESO
  obtenerListaTipoProceso() {
    this.configuracionService.ListarTipoProceso().subscribe({
      next: (data: TipoProcesoResponse[]) => {
        this.tipo_proceso_list = data;
        this.tipo_proceso_list_temp = data;
        console.log(data);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('listado de tipo de proceso completado');
      }
    })
  }

  guardarTipoProceso() {
    const data_tipo_proceso = {
      tipo_proceso: this.nuevaTipoProceso,
      app_user: this.credencialesService.credenciales.username
    }
    console.log(data_tipo_proceso)
    this.configuracionService.CrearTipoProceso(data_tipo_proceso).subscribe({
      next: (data: CrearTipoProcesoResponse) => {
        console.log(data.message);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('creacion de tipo de proceso completado');
        this.limpiarDatosTipoProceso();
        this.obtenerListaTipoProceso();
        this.closeModalRegistrarTipoProceso();
      }
    })
  }

  eliminarTipoProceso(id_tipo_proceso: number) {
    let app_user = this.credencialesService.credenciales.username;
    this.sweetAlert.MensajeConfirmacionEliminar('¿Deseas eliminar el tipo de proceso?')
      .then((result) => {
        if (result) {
          this.configuracionService.EliminarTipoProceso(id_tipo_proceso, app_user).subscribe({
            next: (data: EliminarTipoProcesoResponse) => {
              console.log(data.message);
            },
            error: (error) => {
              console.log(error);
            },
            complete: () => {
              console.log('eliminacion de tipo de proceso completado');
              this.obtenerListaTipoProceso();
            }
          })
        }
      })
      .catch((error) => {
        console.error('Error al eliminar el tipo de proceso:', error);
      });


  }

  buscarTipoProceso(event: any) {
    let objetosFiltrados = []
    const textoBusqueda = event.target.value.toLowerCase();
    objetosFiltrados = this.tipo_proceso_list_temp.filter((objeto:
      {
        tipo_proceso: string;
      }) => {
      const nombre_expediente = objeto.tipo_proceso.toLowerCase();
      return nombre_expediente.includes(textoBusqueda);
    });
    this.tipo_proceso_list = objetosFiltrados
  }

  limpiarDatosTipoProceso() {
    this.nuevaTipoProceso = '';
  }
}

