// Initialise le serveur en appelant la méthode listen() d'Express
import 'dotenv/config';
import app from './src/app.js';

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Le serveur est en cours d'exécution sur le port ${PORT}`);
    console.log(`API : http://localhost:${PORT}/`);
});