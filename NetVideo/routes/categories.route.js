import {create, findAll, findOne, update, Delete, clear} from '../controllers/categories.controller.js';
import express from 'express';

export default function routesCategories(app) {
    let router = express.Router();

    // Create a new Categorie
    router.post("/add", create);
  
    // Retrieve all Categories
    router.get("/", findAll);
  
    // Retrieve a single Categorie with id
    router.get("/:id", findOne);
  
    // Update a Categorie with id
    router.put("/update/:id", update);
  
    // Delete a Categorie with id
    router.delete("/delete/:id", Delete);
  
    // Clear Categorie
    router.delete("/clear", clear);
  
    app.use("/api/categories", router);
};