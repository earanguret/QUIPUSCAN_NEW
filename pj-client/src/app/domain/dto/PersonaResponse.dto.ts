export interface PersonaResponse {

    id_persona: number;
    nombre: string;
    ap_paterno: string;
    ap_materno: string;
    dni: string;
}

export interface CrearPersonaMessageResponse{
    id_persona: number
    text: string
}

export interface ModificarPersonaMessageResponse{
    text: string
}

export interface EliminarPersonaMessageResponse{
    text: string
}