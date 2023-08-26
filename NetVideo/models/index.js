import { url } from "../config/db.config.js";
import mongoose from "mongoose";
import { videos } from './videos.model.js';
import { categories } from './categories.model.js';


mongoose.Promise = global.Promise;

export const db = {};
db.mongoose = mongoose;
db.url = url;
db.videos = videos(mongoose);
db.categories = categories(mongoose);
