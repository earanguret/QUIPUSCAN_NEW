import { Router } from "express";
import perfilController from "../controllers/perfilController";


class PerfilRoutes{

    public router: Router;

    constructor(){
        this.router=Router();
        this.config();
        
    }
    config():void{
        this.router.get('/api/perfil',perfilController.listarPerfiles)
        this.router.get('/api/perfil/:id',perfilController.obtenerPerfilesDetalleById)                
        this.router.post('/api/perfil',perfilController.CrearPerfil)
        this.router.put('/api/perfil/:id',perfilController.ModificarPerfil)
    }
}

const perfilRoutes = new PerfilRoutes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
export default perfilRoutes.router;