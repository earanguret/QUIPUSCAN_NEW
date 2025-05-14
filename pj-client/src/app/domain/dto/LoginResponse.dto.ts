export interface UsuarioLoginResponse {
    success: boolean;
    id_usuario: number; // Según lo que devuelva la API.
    id_persona: number; // Según lo que devuelva la API.
    username: string;
    perfil: string; // Asumiendo que el rol es un string.
    mensaje: string;
}