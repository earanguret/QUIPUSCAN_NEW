import { ErrorValidacion } from "../../../domain/dto/ErrorValidacion.dto";
import { ExpedienteModel } from "../../../domain/models/expediente.model";


export function form_inventario_creacion_vf(dataExpediente: ExpedienteModel): ErrorValidacion[] {
    const errorValidacion: ErrorValidacion[] = [];
    if (!dataExpediente.nro_expediente) {
      errorValidacion.push({ campo: 'nro_expediente', mensaje: 'Campo requerido' });
    }
    if (!dataExpediente.cod_paquete) {
      errorValidacion.push({ campo: 'cod_paquete', mensaje: 'Campo requerido' });
    }
    return errorValidacion;
  }