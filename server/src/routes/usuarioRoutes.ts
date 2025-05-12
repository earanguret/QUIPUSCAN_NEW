import { Router } from "express";
import usuarioController from "../controllers/usuarioController";


class UsuarioRoutes{

    public router: Router;

    constructor(){
        this.router=Router();
        this.config();
        
    }
    config():void{
        this.router.get('/api/usuario',usuarioController.listarUsuarios)
        this.router.get('/api/usuario/detalle',usuarioController.listarUsuariosDetalle)
        this.router.get('/api/usuario/:id',usuarioController.obtenerUsuariosDetalleById)
        this.router.post('/api/usuario',usuarioController.CrearUsuario)
    }
}

const usuarioRoutes = new UsuarioRoutes
export default usuarioRoutes.router;
