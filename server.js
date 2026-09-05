// Initialise le serveur en appelant la méthode listen() d'Express
import 'dotenv/config';
import app from './src/app.js';
import prisma from './src/prisma/client.js';

const PORT = process.env.PORT;

async function startServer() {
    try {
        await prisma.$connect();

        console.log('Connexion PostgreSQL réussie');

        const users = await prisma.user.findMany();
        console.log(users);

        app.listen(PORT, () => {
            console.log(`Le serveur est en cours d'exécution sur le port ${PORT}`);
            console.log(`API : http://localhost:${PORT}/`)
        });
    } catch (error) {
        console.error('Erreur PostgreSQL :', error);
        process.exit(1);
    }
}

startServer();