"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const personaRoutes_1 = __importDefault(require("./routes/personaRoutes"));
const usuarioRoutes_1 = __importDefault(require("./routes/usuarioRoutes"));
const inventarioRoutes_1 = __importDefault(require("./routes/inventarioRoutes"));
const expedienteRoutes_1 = __importDefault(require("./routes/expedienteRoutes"));
const estadoExpedienteRoutes_1 = __importDefault(require("./routes/estadoExpedienteRoutes"));
const flujogramaRoutes_1 = __importDefault(require("./routes/flujogramaRoutes"));
const preparacionRoutes_1 = __importDefault(require("./routes/preparacionRoutes"));
const digitalizacionRoutes_1 = __importDefault(require("./routes/digitalizacionRoutes"));
const ftpServerRoutes_1 = __importDefault(require("./routes/ftpServerRoutes"));
const indizacionRoutes_1 = __importDefault(require("./routes/indizacionRoutes"));
const controlRoutes_1 = __importDefault(require("./routes/controlRoutes"));
const fedatarioRoutes_1 = __importDefault(require("./routes/fedatarioRoutes"));
const firmaDigitalRoutes_1 = __importDefault(require("./routes/firmaDigitalRoutes"));
const discoRoutes_1 = __importDefault(require("./routes/discoRoutes"));
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.app.set('trust proxy', true);
        this.config();
        this.ruotes();
    }
    config() {
        this.app.set('port', process.env.PORT || 5000);
        // this.app.use(morgan('dev'));
        this.app.use((0, morgan_1.default)(':method :url :status :res[content-length] - :response-time ms'));
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ limit: '250mb', extended: true }));
    }
    ruotes() {
        this.app.use('/', personaRoutes_1.default);
        this.app.use('/', usuarioRoutes_1.default);
        this.app.use('/', inventarioRoutes_1.default);
        this.app.use('/', expedienteRoutes_1.default);
        this.app.use('/', estadoExpedienteRoutes_1.default);
        this.app.use('/', flujogramaRoutes_1.default);
        this.app.use('/', preparacionRoutes_1.default);
        this.app.use('/', digitalizacionRoutes_1.default);
        this.app.use('/', ftpServerRoutes_1.default);
        this.app.use('/', indizacionRoutes_1.default);
        this.app.use('/', controlRoutes_1.default);
        this.app.use('/', firmaDigitalRoutes_1.default);
        this.app.use('/', discoRoutes_1.default);
        this.app.use('/', fedatarioRoutes_1.default);
    }
    start() {
        const server = this.app.listen(this.app.get('port'), '0.0.0.0', () => {
            console.log(`Server listening on port ${this.app.get('port')}`);
        });
    }
}
const server = new Server();
server.start();
