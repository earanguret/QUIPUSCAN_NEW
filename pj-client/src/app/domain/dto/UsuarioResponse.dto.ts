
export interface UsuarioResponse {
    
    id_usuario: number;
    usuario: string;
    id_perfil: number;
    estado: string;
    nombres: string;
    ap_paterno: string | null;
    ap_materno: string | null;
    dni: string | null;
}


export interface CrearUsuarioResponse  {
    text: string;
}

export interface ObtenerUsuarioResponse  {
    text: string;
}

export interface ModificarDatosUsuarioResponse{
    text: string;
}

export interface ModificarPasswordUsuarioResponse{
    text: string;
}