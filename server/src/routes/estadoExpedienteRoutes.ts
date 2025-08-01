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
        this.router.put('/api/estado_expediente/aceptar/control/:id_expediente',estadoExpedienteController.ControlAceptada) 
        this.router.put('/api/estado_expediente/aprobar/control/:id_expediente',estadoExpedienteController.ControlTrabajado)
        this.router.put('/api/estado_expediente/aceptar/fedatario/:id_expediente',estadoExpedienteController.FedadoAceptado)
        this.router.put('/api/estado_expediente/aprobar/fedatario/:id_expediente',estadoExpedienteController.FedadoTrabajado)
        this.router.delete('/api/estado_expediente/:id_expediente',estadoExpedienteController.EliminarEstadoExpediente)
        this.router.put('/api/estado_expediente/asociar/disco',estadoExpedienteController.AsociarExpedientesADisco)
        this.router.put('/api/estado_expediente/rechazar/controlDigitalizacion/:id_expediente',estadoExpedienteController.RechazarControlDigitalizacion)
        this.router.put('/api/estado_expediente/rechazar/controlIndizacion/:id_expediente',estadoExpedienteController.RechazarControlIndizacion)
        this.router.put('/api/estado_expediente/rechazar/fedatarioDigitalizacion/:id_expediente',estadoExpedienteController.RechazarFedatarioDigitalizacion)
        this.router.put('/api/estado_expediente/rechazar/fedatarioIndizacion/:id_expediente',estadoExpedienteController.RechazarFedatarioIndizacion)

    }
}

const estadoExpedienteRoutes = new EstadoExpedienteRoutes                            
export default estadoExpedienteRoutes.router;   