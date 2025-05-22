import { Router } from "express";
import estadoExpedienteController from "../controllers/estadoExpedienteController";


class EstadoExpedienteRoutes{

    public router: Router;

    constructor(){
        this.router=Router();
        this.config();
        
    }
    config():void{
        this.router.post('/api/estado_expediente/crear',estadoExpedienteController.CrearEstadoExpediente)

    }
}

const estadoExpedienteRoutes = new EstadoExpedienteRoutes                            
export default estadoExpedienteRoutes.router;   