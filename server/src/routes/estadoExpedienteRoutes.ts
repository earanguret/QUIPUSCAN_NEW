import { Router } from "express";
import estadoExpedienteController from "../controllers/estadoExpedienteController";


class EstadoExpedienteRoutes{

    public router: Router;

    constructor(){
        this.router=Router();
        this.config();
        
    }
    config():void{
        this.router.post('/api/estado_expediente',estadoExpedienteController.CrearEstadoExpediente)
        this.router.put('/api/estado_expediente/aceptar/preparacion/:id_expediente',estadoExpedienteController.AceptarPreparacion)
        this.router.put('/api/estado_expediente/aprobar/preparacion/:id_expediente',estadoExpedienteController.AprobarPreparacion)
        this.router.put('/api/estado_expediente/aceptar/digitalizacion/:id_expediente',estadoExpedienteController.AceptarDigitalizacion)
        this.router.put('/api/estado_expediente/aprobar/digitalizacion/:id_expediente',estadoExpedienteController.AprobarDigitalizacion)
        this.router.delete('/api/estado_expediente/:id_expediente',estadoExpedienteController.EliminarEstadoExpediente)

    }
}

const estadoExpedienteRoutes = new EstadoExpedienteRoutes                            
export default estadoExpedienteRoutes.router;   