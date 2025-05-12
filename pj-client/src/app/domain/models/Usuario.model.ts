
export interface UsuarioModel{
   
    id_usuario: number;
    id_persona: number ;
    usuario: string;
    id_perfil: number;
    password?: string;
    estado?: boolean;

}