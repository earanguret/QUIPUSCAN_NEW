
export interface UsuarioModel{
   
    id_usuario: number;
    id_persona: number ;
    username: string;
    perfil: string;
    password?: string;
    estado?:  boolean | null;

}