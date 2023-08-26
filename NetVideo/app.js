import express, { json, urlencoded } from 'express';
import cors from 'cors';
import { db } from './models/index.js';
import routesVideos from './routes/videos.route.js';
import routesCategories from './routes/categories.route.js';
import axios from 'axios';
import {getPageVideo, downloadVideos} from './utils/utiles.js';

const app = express();

// ressources statique
app.use(express.static('public'));

// Definition de moteur d'affichage
app.set('view engine', 'ejs');
app.set('views', './views');

let corsOptions = {
    origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// preciser le contenue de API en format JSON
app.use(json());

// encoder le contenu de formulaire - application/x-www-form-urlencoded
app.use(urlencoded({ extended: true }));

// connection database MongoDB
db.mongoose.connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to the database MongoDB Atlas!");
}).catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
});

// Route API EndPoint coté serveur
routesVideos(app);
routesCategories(app);

// route views EJS coté client
app.get("/", async (req, res) => {
    let response;
    if (req.query.Recherche){
        response= await axios.get('http://localhost:8080/api/videos?titre='+req.query.Recherche)
    } else { // Affichage toute les films  - par défaut
        response= await axios.get('http://localhost:8080/api/videos')
    }
    if (response.status === 200){
        const resultat= response.data;
        res.status(200).render('index', {resultat});
    }
});

// route streaming video player
app.get("/video", async function (req, res) {
    if (req.query.urlStream && req.query.id){
        const response= await axios.get('http://localhost:8080/api/videos/'+req.query.id);
        if (response.status === 200){
            const resultat= response.data;
            const pageContent = await getPageVideo(req.query.urlStream);
            let urlVideo= downloadVideos(req.query.urlStream, pageContent);
            res.status(200).render('video', {resultat, urlVideo});    
        }
    } else {
        res.status(404);
    }
});

// lancement de serveur avec definition de port
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Serveur lancer au port ${PORT}.`);
});