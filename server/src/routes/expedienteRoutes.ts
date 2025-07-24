import { Router } from "express";
import expedienteController from "../controllers/expedienteController";


class ExpedienteRoutes{

    public router: Router;

    constructor(){
        this.router=Router();
        this.config();
        
    }
    config():void{
        this.router.get('/api/expediente',expedienteController.listarExpedientes)
        this.router.get('/api/expediente/lista/:id_inventario',expedienteController.ObtenerExpedientesById_inventario)
        this.router.get('/api/expediente/dataview/:id',expedienteController.ObtenerExpedienteDataViewXid)
        this.router.post('/api/expediente',expedienteController.CrearExpediente)
        this.router.delete('/api/expediente/:id',expedienteController.EliminarExpediente)
        this.router.put('/api/expediente/:id',expedienteController.ModificarExpediente)
        this.router.get('/api/expediente/pendientesDisco/:id_inventario',expedienteController.ObtenerExpedientesById_inventario_sinDisco)
    }
}

const expedienteRoutes = new ExpedienteRoutes
export default expedienteRoutes.router;