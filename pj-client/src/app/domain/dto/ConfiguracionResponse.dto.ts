
// ESPECIALIDAD
export interface CrearEspecialidadResponse {
    message: string;
}

export interface EspecialidadResponse {
    id_especialidad: number;
    especialidad: string;
    create_at: Date | null;
}

export interface EliminarEspecialidadResponse {
    message: string;
}

// SEDE
export interface CrearSedeResponse {
    message: string;
}

export interface EliminarSedeResponse {
    message: string;
}     

export interface SedeResponse {
    id_sede: number;
    sede: string;    
    create_at: Date | null;
}

// TIPO DE DOCUMENTO
export interface TipoDocumentoResponse {
    id_tipo_documento: number;
    tipo_documento: string;
    create_at: Date | null;
}

export interface CrearTipoDocumentoResponse {
    message: string;
}

export interface EliminarTipoDocumentoResponse {
    message: string;
}

// JUZGADO DE ORIGEN
export interface CrearJuzgadoResponse {
    message: string;
}

export interface EliminarJuzgadoResponse {
    message: string;
}

export interface JuzgadoResponse {
    id_juzgado: number;
    juzgado: string;
    create_at: Date | null;
}

// MATERIA
export interface CrearMateriaResponse {
    message: string;
}

export interface EliminarMateriaResponse {
    message: string;
}

export interface MateriaResponse {
    id_materia: number;
    materia: string;
    create_at: Date | null;
}

// TIPO DE PROCESO
export interface CrearTipoProcesoResponse {
    message: string;
}

export interface EliminarTipoProcesoResponse {
    message: string;
}

export interface TipoProcesoResponse {
    id_tipo_proceso: number;
    tipo_proceso: string;
    create_at: Date | null;
}

// GENERAL
export interface ModificarGeneralResponse {
    message: string;
}

export interface GeneralResponse {
    id_general: number;
    create_at: Date | null;
    institucion: string;
    direccion: string;
    ruc: string;
    departamento: string;
}