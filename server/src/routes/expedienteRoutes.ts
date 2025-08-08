import { Router } from "express";
import expedienteController from "../controllers/expedienteController";
import CreateMiddleware from "../middlewares/log_evento/create.middleware";
import DeleteExpMiddleware from "../middlewares/log_evento/delete.middleware";
import UpdateMiddleware from "../middlewares/log_evento/update.middleware";


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
        this.router.post('/api/expediente', CreateMiddleware ,expedienteController.CrearExpediente)
        this.router.delete('/api/expediente/:id/:app_user', DeleteExpMiddleware,expedienteController.EliminarExpediente)
        this.router.put('/api/expediente/:id', UpdateMiddleware ,expedienteController.ModificarExpediente)
        this.router.get('/api/expediente/pendientesDisco/:id_inventario',expedienteController.ObtenerExpedientesById_inventario_sinDisco)
    }
}

const expedienteRoutes = new ExpedienteRoutes
export default expedienteRoutes.router;