import { ErrorValidacion } from "../../../domain/dto/ErrorValidacion.dto";
import { GeneralRequest } from "../../../domain/dto/ConfiguracionRequest.dto";  


export function form_general_modificar_vf(dataGeneral: GeneralRequest): ErrorValidacion[] {
    const errorValidacion: ErrorValidacion[] = [];
    if (!dataGeneral.institucion) {
        errorValidacion.push({ campo: 'institucion', mensaje: 'Campo requerido' });
    }
    if (!dataGeneral.direccion) {
        errorValidacion.push({ campo: 'direccion', mensaje: 'Campo requerido' });
    }
    if (!dataGeneral.ruc) {
        errorValidacion.push({ campo: 'ruc', mensaje: 'Campo requerido' });
    }
    if (!dataGeneral.departamento) {
        errorValidacion.push({ campo: 'departamento', mensaje: 'Campo requerido' });
    }
    return errorValidacion;
}

