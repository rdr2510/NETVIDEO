import mysql from 'mysql';
import util from 'util';

export default class DBmySql{
    #myConnection;
    
    /**
     * @param {*} host - adresse de serveur base de donnée
     * @param {*} userName - Nom d'utilisateur
     * @param {*} password - Mot de passe
     * @param {*} database - Le nom de base de donnée a utiliser
     */
    constructor(host, userName, password, database){
        this.host= host;
        this.userName= userName;
        this.password= password;
        this.database= database;

        this.#myConnection = mysql.createConnection({
            host: this.host,
            user: this.userName,
            password: this.password,
            database: this.database
        });

        this.querySQL = util.promisify(this.#myConnection.query).bind(this.#myConnection);
        this.connectSQL = util.promisify(this.#myConnection.connect).bind(this.#myConnection);
        this.endSQL = util.promisify(this.#myConnection.end).bind(this.#myConnection);
    }

    /**
     * Connecter avec la base de donnée
     */
    async Connect(){
        await this.connectSQL();
        console.log('Connection debuter avec Mysql Database.');
    }

    /**
     * Deconnecter avec la base de donnée
     */
    async DisConnect(){
        await this.endSQL();
        console.log('Connection Terminer avec Mysql Database.');
    }

    async getCollections(){
        let sql = 'SELECT * FROM collections WHERE _date=2023 AND _type=0 ORDER BY id DESC';
        return await this.querySQL(sql, []); // exectution de requete langage sql
    }

    async getCategories(idCollection){
        let sql = 'SELECT categories.id, categories.nom FROM genres, categories WHERE genres.idcategorie=categories.id AND genres.idcollection= ?';
        let values= [idCollection];
        return await this.querySQL(sql, values); // exectution de requete langage sql
    }

    async getGenres(){
        let sql = 'SELECT * FROM categories';
        return await this.querySQL(sql, []); // exectution de requete langage sql
    }

    async getActeurs(idCollection){
        let sql = 'SELECT acteurs.id, acteurs.nom FROM acteurs, acteurscollection WHERE acteurscollection.idacteur=acteurs.id AND acteurscollection.idcollection= ?';
        let values= [idCollection];
        return await this.querySQL(sql, values); // exectution de requete langage sql
    }

    async getVideos(idCollection){
        let sql = 'SELECT * FROM film_videos WHERE idcollection= ?';
        let value= [idCollection];
        return await this.querySQL(sql, value); // exectution de requete langage sql
    }
}