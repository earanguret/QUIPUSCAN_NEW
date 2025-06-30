import { ErrorValidacion } from "../../../domain/dto/ErrorValidacion.dto";
import { IndizacionRequest } from "../../../domain/dto/IndizacionRequest.dto";

export function form_indizacion_creacion_vf(dataIndizacion:IndizacionRequest): ErrorValidacion[] {
    const errorValidacion: ErrorValidacion[] = [];
    if (!dataIndizacion.juzgado_origen) {
      errorValidacion.push({ campo: 'juzgado de origen', mensaje: 'Campo requerido' });
    }
    if(!dataIndizacion.tipo_proceso){
      errorValidacion.push({ campo: 'tipo de proceso', mensaje: 'Campo requerido' });
    }
    if(!dataIndizacion.materia){
        errorValidacion.push({ campo: 'materia', mensaje: 'Campo requerido' });
    }
    if(!dataIndizacion.fecha_inicial){
        errorValidacion.push({ campo: 'fecha de inicio', mensaje: 'Campo requerido' });
    }
    if(!dataIndizacion.fecha_final){
        errorValidacion.push({ campo: 'fecha de final', mensaje: 'Campo requerido' });
    }
    if(!dataIndizacion.demandante){
        errorValidacion.push({ campo: 'demandante', mensaje: 'Campo requerido' });
    }
    if(!dataIndizacion.demandado){
        errorValidacion.push({ campo: 'demandado', mensaje: 'Campo requerido' });
    }
    if(!dataIndizacion.indice){
        errorValidacion.push({ campo: 'indice', mensaje: 'Campo requerido' });
    }
    return errorValidacion;
  }

  export function form_indizacion_modificar_vf(dataIndizacion:IndizacionRequest): ErrorValidacion[] {
    const errorValidacion: ErrorValidacion[] = [];
    if (!dataIndizacion.juzgado_origen) {
      errorValidacion.push({ campo: 'juzgado de origen', mensaje: 'Campo requerido' });
    }
    if(!dataIndizacion.tipo_proceso){
      errorValidacion.push({ campo: 'tipo de proceso', mensaje: 'Campo requerido' });
    }
    if(!dataIndizacion.materia){
        errorValidacion.push({ campo: 'materia', mensaje: 'Campo requerido' });
    }
    if(!dataIndizacion.fecha_inicial){
        errorValidacion.push({ campo: 'fecha de inicio', mensaje: 'Campo requerido' });
    }
    if(!dataIndizacion.fecha_final){
        errorValidacion.push({ campo: 'fecha de final', mensaje: 'Campo requerido' });
    }
    if(!dataIndizacion.demandante){
        errorValidacion.push({ campo: 'demandante', mensaje: 'Campo requerido' });
    }
    if(!dataIndizacion.demandado){
        errorValidacion.push({ campo: 'demandado', mensaje: 'Campo requerido' });
    }
    if(!dataIndizacion.indice){
        errorValidacion.push({ campo: 'indice', mensaje: 'Campo requerido' });
    }
    return errorValidacion;
  }