import { Router } from "express";
import flujogramaController from "../controllers/flujogramaController";


class FlujogramaRoutes{

    public router: Router;

    constructor(){
        this.router=Router();
        this.config();
        
    }
    config():void{
        this.router.get('/api/flujograma/lista/:id_expediente',flujogramaController.listarFlujogramaByIdExpediente)
        this.router.post('/api/flujograma',flujogramaController.crearFlujograma)
        this.router.delete('/api/flujograma/:id_expediente',flujogramaController.EliminarFlujograma)
    }
}

const flujogramaRoutes = new FlujogramaRoutes
export default flujogramaRoutes.router;