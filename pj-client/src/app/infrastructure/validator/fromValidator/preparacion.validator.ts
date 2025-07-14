import { ErrorValidacion } from "../../../domain/dto/ErrorValidacion.dto";
import { PreparacionModel } from "../../../domain/models/Preparacion.model";

export function form_preparacion_vf(dataPrepacion: PreparacionModel): ErrorValidacion[] {
    const errorValidacion: ErrorValidacion[] = [];
    if (!dataPrepacion.fojas_total) {
      errorValidacion.push({ campo: 'fojas fisicas', mensaje: 'Campo requerido' });
    }

    if (!dataPrepacion.fojas_unacara) {
      errorValidacion.push({ campo: '1 cara', mensaje: 'Campo requerido' });
    }

    if (!dataPrepacion.fojas_doscaras) {
      errorValidacion.push({ campo: '2 caras', mensaje: 'Campo requerido' });
    }
  
    return errorValidacion;
  }