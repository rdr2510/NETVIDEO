export function videos(mongoose) {
    let schema = mongoose.Schema(
        {
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
        }
    );
  
    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });
  
    const Videos = mongoose.model("videos", schema);
    return Videos;
};