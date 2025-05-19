import { ErrorValidacion } from "../../../domain/dto/ErrorValidacion.dto";
import { InventarioModel } from "../../../domain/models/Inventario.model";


export function form_inventario_vf(dataInventario: InventarioModel): ErrorValidacion[] {
    const errorValidacion: ErrorValidacion[] = [];
    if (!dataInventario.especialidad) {
      errorValidacion.push({ campo: 'especialidad', mensaje: 'Campo requerido' });
    }
    if (!dataInventario.sede) {
      errorValidacion.push({ campo: 'sede', mensaje: 'Campo requerido' });
    }
    if (!dataInventario.anio) {
      errorValidacion.push({ campo: 'año', mensaje: 'Campo requerido' });
    }
    else if ( dataInventario.anio < 4){
    errorValidacion.push({ campo: 'año', mensaje: 'Año invalido' })
    }
    if (!dataInventario.tipo_doc) {
      errorValidacion.push({ campo: 'tipo_doc', mensaje: 'Campo requerido' });
    }
    if (!dataInventario.serie_doc) {
      errorValidacion.push({ campo: 'serie_doc', mensaje: 'Campo requerido' });
    }
    if (!dataInventario.codigo) {
      errorValidacion.push({ campo: 'codigo', mensaje: 'Campo requerido' });
    }    
    return errorValidacion;
  }
