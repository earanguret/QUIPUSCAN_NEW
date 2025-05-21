import express, { Application} from 'express';
import cors from 'cors';
import morgan from 'morgan'
import personaRoutes from './routes/personaRoutes';
import usuarioRoutes from './routes/usuarioRoutes';
import inventarioRoutes from './routes/inventarioRoutes';
import expedienteRoutes from './routes/expedienteRoutes';


class Server{
    public app: Application;
    
    constructor(){
        this.app=express();
        this.app.set('trust proxy', true);
        this.config();
        this.ruotes();
    }
    config():void{
        this.app.set('port',process.env.PORT||5000);
        // this.app.use(morgan('dev'));
        this.app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
        this.app.use(cors());
        this.app.use(express.json({ limit: '250mb' }));
        this.app.use(express.urlencoded({ limit: '250mb', extended: true }));
    }
    ruotes():void{
        this.app.use('/',personaRoutes);
        this.app.use('/',usuarioRoutes);
        this.app.use('/',inventarioRoutes);
        this.app.use('/',expedienteRoutes);
        
    }
    start(): void {
        const server = this.app.listen(this.app.get('port'), '0.0.0.0', () => {
            console.log(`Server listening on port ${this.app.get('port')}`);
        });
    }
}

const server=new Server();
server.start();