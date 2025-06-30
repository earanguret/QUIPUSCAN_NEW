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
        this.router.put('/api/estado_expediente/aceptar/preparacion/:id_expediente',estadoExpedienteController.PreparacionAceptada)
        this.router.put('/api/estado_expediente/aprobar/preparacion/:id_expediente',estadoExpedienteController.PreparacionTrabajado)
        this.router.put('/api/estado_expediente/aceptar/digitalizacion/:id_expediente',estadoExpedienteController.DigitalizacionAceptada)
        this.router.put('/api/estado_expediente/aprobar/digitalizacion/:id_expediente',estadoExpedienteController.DigitalizacionTrabajado)
        this.router.put('/api/estado_expediente/aceptar/indizacion/:id_expediente',estadoExpedienteController.IndizacionAceptada)
        this.router.put('/api/estado_expediente/aprobar/indizacion/:id_expediente',estadoExpedienteController.IndizacionTrabajado)
        this.router.delete('/api/estado_expediente/:id_expediente',estadoExpedienteController.EliminarEstadoExpediente)

    }
}

const estadoExpedienteRoutes = new EstadoExpedienteRoutes                            
export default estadoExpedienteRoutes.router;   