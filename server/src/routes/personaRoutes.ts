import { Router } from "express";
import personaController from "../controllers/personaController";


class PersonaRoutes{

    public router: Router;

    constructor(){
        this.router=Router();
        this.config();
        
    }
    config():void{
        this.router.get('/api/persona',personaController.listarPersonas)
        this.router.get('/api/persona/:id',personaController.ObtenerPersonaById)
        this.router.get('/api/persona/dni/:dni',personaController.ObtenerPersonaByDNI)
        this.router.post('/api/persona',personaController.CrearPersona)
        this.router.put('/api/persona/:id',personaController.ModificarPersona) 
    }
}

const personaRoutes = new PersonaRoutes
export default personaRoutes.router;