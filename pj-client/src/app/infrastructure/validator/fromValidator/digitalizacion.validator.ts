import { ErrorValidacion } from "../../../domain/dto/ErrorValidacion.dto";
import { DigitalizacionRequest } from "../../../domain/dto/DigitalizacionRequest.dto";

export function form_digitalizacion_creacion_vf(dataDigitalizacion: DigitalizacionRequest): ErrorValidacion[] {
    const errorValidacion: ErrorValidacion[] = [];
    if (!dataDigitalizacion.fojas_total) {
        errorValidacion.push({ campo: 'total de fojas', mensaje: 'Campo requerido' });
    }
    return errorValidacion;
}

export function form_digitalizacion_modificar_vf(dataDigitalizacion: DigitalizacionRequest): ErrorValidacion[] {
    const errorValidacion: ErrorValidacion[] = [];
    if (!dataDigitalizacion.fojas_total) {
        errorValidacion.push({ campo: 'total de fojas', mensaje: 'Campo requerido' });
    }
    return errorValidacion;
}