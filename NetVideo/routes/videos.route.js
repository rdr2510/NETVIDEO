import {create, findAll, findOne, update, Delete, clear} from '../controllers/videos.controller.js';
import express from 'express';

export default function routesVideos(app) {  
    let router = express.Router();
  
    // Add a new Video
    router.post("/add", create);
  
    // Retrieve all Videos
    router.get("/", findAll);
  
    // Retrieve a single Video with id
    router.get("/:id", findOne);
  
    // Update a Video with id
    router.put("/update/:id", update);
  
    // Delete a Video with id
    router.delete("/delete/:id", Delete);
  
    // Clear videos
    router.delete("/clear", clear);
  
    app.use("/api/videos", router);
};