import { Router } from "express";
import usuarioController from "../controllers/usuarioController";
import  logAccesoMiddleware from "../middlewares/log_acceso/logAcceso.middleware";


class UsuarioRoutes{

    public router: Router;

    constructor(){
        this.router=Router();
        this.config();
        
    }
    config():void{
        this.router.get('/api/usuario',usuarioController.listarUsuarios)
        this.router.get('/api/usuario/lista/detalle',usuarioController.listarUsuariosDetalle)
        this.router.get('/api/usuario/:id',usuarioController.obtenerUsuarioDetalleById)
        this.router.post('/api/usuario/crear',usuarioController.CrearUsuario)
        this.router.post('/api/usuario/login',logAccesoMiddleware,usuarioController.ValidarLogin)
        this.router.put('/api/usuario/modificar/:id_usuario',usuarioController.ModificarDatosUsuario)
        this.router.put('/api/usuario/modificar/password/:id_usuario',usuarioController.ModificarPasswordUsuario)
    }
}

const usuarioRoutes = new UsuarioRoutes
export default usuarioRoutes.router;
