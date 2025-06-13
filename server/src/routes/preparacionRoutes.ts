import { Router } from "express";
import preparacionController from "../controllers/preparacionController";


class PreparacionRoutes{

    public router: Router;

    constructor(){
        this.router=Router();
        this.config();
        
    }
    config():void{
        this.router.get('/api/preparacion',preparacionController.listarPreparacion)
        this.router.get('/api/preparacion/lista/:id_inventario',preparacionController.listarPreparacionDetalle)
        this.router.get('/api/preparacion/:id_expediente',preparacionController.ObtenerPreparacionXidExpediente)
        this.router.post('/api/preparacion',preparacionController.CrearPreparacion)
        this.router.put('/api/preparacion/:id_expediente',preparacionController.ModificarPreparacion)
        this.router.get('/api/preparacion/dataview/:id_expediente',preparacionController.ObtenerPreparacionDataViewXidExpediente)

    }

}
const preparacionRoutes = new PreparacionRoutes
export default preparacionRoutes.router;