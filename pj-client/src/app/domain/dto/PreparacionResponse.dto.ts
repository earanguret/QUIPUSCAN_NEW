export interface PreparacionResponseDataView {
    id_preparacion?: number;
    id_expediente: number;
    id_responsable: number;
    fojas_total: number | null;
    fojas_unacara: number | null;
    fojas_doscaras: number | null;
    observaciones: string | null;
    copias_originales: boolean | null;
    copias_simples: boolean | null;
    create_at: Date | null;
    responsable: string | null;
    nro_expediente: string | null;
    username: string | null;
}

export interface PreparacionResponse {
    id_preparacion?: number;
    id_expediente: number;
    id_responsable: number;
    fojas_total: number | null;
    fojas_unacara: number | null;
    fojas_doscaras: number | null;
    observaciones: string | null;
    copias_originales: boolean | null;
    copias_simples: boolean | null;
    create_at: Date | null;
    username?: string | null;
}

export interface CrearPreparacionResponse {
    message: string;
}

export interface ModificarPreparacionResponse {
    message: string;
}

export interface EliminarPreparacionResponse {
    message: string;
}