import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

//import router from './routes/index.js';

const app = express();

// Sécurité HTTP headers
app.use(helmet());

// CORS : autoriser uniquement le frontend
app.use(cors({
    // origin: process.env.FRONTEND_URL,
    // credentials: true,
}));

// Logging des requêtes HTTP
app.use(morgan('dev'));

// Parsing du corps des requêtes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Toutes les routes API
//app.use('/api', router);

// Health check
app.get('/', (_req, res) => res.json({ status: 'ok',  message: 'Bienvenue sur l\'API CollabTask', timestamp: new Date().toISOString() }));

// 404 — route non trouvée
app.use((_req, res) => {
    res.status(404).json({ success: false, message: 'Route non trouvée' });
});

// Gestionnaire d'erreurs global (doit être en dernier)
//app.use(errorHandler);

export default app;