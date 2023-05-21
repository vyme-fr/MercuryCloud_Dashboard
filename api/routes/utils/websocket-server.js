const WebSocket = require('ws');

// Créer un serveur WebSocket
const wss = new WebSocket.Server({
    port: 8080
});

// Stocker les sessions et leurs requêtes
const sessions = new Map();

// Définir la requête par défaut pour une session
const defaultRequest = {
    url: 'http://localhost:8000',
    headers: {}
};

// Fonction pour traiter les messages reçus
wss.on('connection', (ws) => {
    let session = null;
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            if (data.session) {
                // Si la session existe déjà, récupérer la requête stockée
                session = sessions.get(data.session);
            } else {
                // Sinon, créer une nouvelle session et une requête par défaut
                session = {
                    id: Math.random().toString(36).substr(2, 9),
                    request: defaultRequest
                };
                sessions.set(session.id, session);
            }
        } catch (error) {
            console.error(error);
            return;
        }
    });

    // Envoyer les données mises à jour toutes les secondes
    setInterval(() => {
        if (session) {
            // Envoyer la requête stockée pour la session
            const requestOptions = {
                url: session.request.url,
                headers: session.request.headers
            };
            // Effectuer une requête HTTP et renvoyer les résultats
            makeRequest(requestOptions, (result) => {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify(result));
                }
            });
        }
    }, 1000);
});

// Fonction pour effectuer une requête HTTP
function makeRequest(options, callback) {
    // Utiliser la bibliothèque "request" pour effectuer une requête HTTP
    const request = require('request');
    request(options, (error, response, body) => {
        if (error) {
            console.error(error);
            return;
        }
        const result = JSON.parse(body);
        callback(result);
    });
}

// Lancer le serveur Express pour l'API
app.get('/', (req, res) => {
    // Vérifier les paramètres de la requête et récupérer la session
    const session = sessions.get(req.query.session);
    if (!session) {
        res.status(400).send('Session invalide');
        return;
    }
    // Récupérer les paramètres de la requête et les stocker pour la session
    const request = {
        url: req.query.url,
        headers: req.query.headers
    };
    session.request = request;
    // Répondre avec un message de confirmation
    res.send('Requête mise à jour pour la session ' + session.id);
});

// Démarrer le serveur Express pour l'API
app.listen(port, () => {
    console.log(`Serveur API lancé sur http://localhost:${port}`);
});