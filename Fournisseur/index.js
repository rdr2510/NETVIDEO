import DBmySql from './dbMysql.js';
import mongoose from 'mongoose';

let Collection = {
    id: Number,
    titre: String,
    date: String,
    duree: String,
    pays: String,
    synopsis: String,
    realisateur: String,
    version: String,
    urlPoster: String,
    urlVideo: String,
    acteurs: [],
    categories: [],        
};

let dbMysql = new DBmySql('localhost', 'root', '', 'netvideo');

await dbMysql.Connect();

async function getCollections(){
    let Collections= [];
    const resultCollection= await dbMysql.getCollections();
    for (let i=0; i<resultCollection.length; ++i){
        const resultVideo= await dbMysql.getVideos(resultCollection[i].id);
        for (let j=0; j<resultVideo.length; ++j){
            if (resultVideo[j].nom.toUpperCase().includes('DDSTREAM')){
                if (!resultCollection[i].qualite.toUpperCase().includes('BDRIP') && !resultCollection[i].qualite.toUpperCase().includes('CAM') && !resultCollection[i].qualite.toUpperCase().includes('SCR')){
                    Collection.id= resultCollection[i].id;
                    Collection.titre= resultCollection[i].titre;
                    Collection.date= resultCollection[i]._date;
                    Collection.duree= resultCollection[i].duree;
                    Collection.pays= resultCollection[i].pays;
                    Collection.synopsis= resultCollection[i].synopsis;
                    Collection.realisateur= resultCollection[i].realisateur;
                    Collection.version= resultCollection[i].version;
                    Collection.urlPoster= resultCollection[i].url_poster.replace('studio', 'voto');
                    Collection.urlVideo= resultVideo[j].lien; 
                    Collection.categories.splice(0, Collection.categories.length); 
                    Collection.acteurs.splice(0, Collection.acteurs.length);
        
                    const resultActeur= await dbMysql.getActeurs(resultCollection[i].id);
                    for (let l=0; l<resultActeur.length; ++l){
                        Collection.acteurs.push(resultActeur[l].nom);
                    }
                    const resultCategorie= await dbMysql.getCategories(resultCollection[i].id);
                    for (let l=0; l<resultCategorie.length; ++l){
                        Collection.categories.push(resultCategorie[l].nom);
                    }
                    Collections.push({id: Collection.id, titre: Collection.titre, date: Collection.date, duree: Collection.duree,
                                      pays: Collection.pays, synopsis: Collection.synopsis, realisateur: Collection.realisateur,
                                      version: Collection.version, urlPoster: Collection.urlPoster, urlVideo: Collection.urlVideo,
                                      categories: Collection.categories.slice(0), acteurs: Collection.acteurs.slice(0)});
                }
                break;
            }
        }
    }

    //Collections.splice(100, Collections.length - 100);

    return Collections;
}

async function getCategories(){
    const resultGenre= await dbMysql.getGenres();
    let Categories=[];
    for (let i=0; i<resultGenre.length; ++i){
        Categories.push({nom: resultGenre[i].nom});
    }
    return Categories;
}

let Collections= await getCollections();
let Categories= await getCategories();
 

//await dbMysql.DisConnect();

//-----------------------Add Mongoose----------------------
mongoose.connect('mongodb+srv://rdr2510:2510Rina@cluster0.h5uteb0.mongodb.net/myvideos?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    //useFindAndModify: false,
    useUnifiedTopology: true
  }
);

const dbMongo = mongoose.connection;
dbMongo.on("error", console.error.bind(console, "connection error: "));
dbMongo.once("open", function () {
    console.log("Connected successfully");
    const videoSchema= mongoose.Schema({
        id: Number,
        titre: String,
        date: String,
        duree: String,
        pays: String,
        synopsis: String,
        realisateur: String,
        version: String,
        urlPoster: String,
        urlVideo: String,
        acteurs: [],
        categories: [],        
    });
    
    const videoModel= mongoose.model('Videos', videoSchema);
    videoModel.insertMany(Collections).then(function(){
        console.log("Data Collection inserted");  // Success

        /*const catSchema= mongoose.Schema({nom: String});
        const catModel= mongoose.model('Categories', catSchema);
        catModel.insertMany(Categories).then(function(){
            console.log("Data Categories inserted")  // Success
        }).catch(function(error){
            console.log(error)      // Failure
        });*/
    }).catch(function(error){
        console.log(error)      // Failure
    });
})
