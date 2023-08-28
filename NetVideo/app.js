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
    let responseVideos;
    let typeFiltre= 0; // all
    let Recherche= req.query.Recherche;
    let Categorie= req.query.Categorie; 
    if (req.query.Recherche){
        responseVideos= await axios.get('http://localhost:8080/api/videos?titre='+req.query.Recherche);

        typeFiltre= 1; //recherche
    } else if (req.query.Categorie){
        responseVideos= await axios.get('http://localhost:8080/api/videos/Categorie?Categorie='+req.query.Categorie);
        typeFiltre= 2;
    } else { // Affichage toute les films  - par défaut
        responseVideos= await axios.get('http://localhost:8080/api/videos')
    }
    let responseCategories= await axios.get('http://localhost:8080/api/categories')
    if (responseVideos.status === 200 && responseCategories.status===200){
        const resultatVideos= responseVideos.data;
        const resultatCategories= responseCategories.data;
        res.status(200).render('index', {resultatVideos, resultatCategories, typeFiltre, Recherche, Categorie});
    }
});

// upload form
app.get("/upload", async (req, res) => {
    let responseCategories= await axios.get('http://localhost:8080/api/categories')
    if (responseCategories.status===200){
        const resultatCategories= responseCategories.data;
        res.status(200).render('upload', {resultatCategories});
    }
});

app.post("/upload/data", async (req, res) => {
    let responseCategories= await axios.get('http://localhost:8080/api/categories')
    let response= await axios.post('http://localhost:8080/api/videos/add',
    {titre: req.body.titre, date: req.body.date, duree: req.body.duree, pays: req.body.pays,
     synopsis: req.body.synopsis, realisateur: req.body.realisateur, version: req.body.version,
     urlPoster: req.body.urlPoster, urlVideo: req.body.urlVideo, acteurs: req.body.acteurs, 
     categories: req.body.genres,});
     if (response === 200){
        if (responseCategories.status === 200){
            res.status(200).render('uploadsuccess', {resultatCategories, errorType: 0, message: 'Ajout de nouvelle video avec succés ! - ' + req.body.titre});
        }
    } else {
        res.status(500).render('uploadsuccess', {resultatCategories, errorType: 1, message: 'Error interne de serveur, echec !'});
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