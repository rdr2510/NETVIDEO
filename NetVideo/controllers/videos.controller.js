import { db } from "../models/index.js";
const Videos = db.videos;

// Create and Save a new Videos
export function create(req, res) {
  // Validate request
    if (!req.body.titre) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }

    // Create a Videos
    const video = new Videos({
            id: 0,
            titre: req.body.titre,
            date: req.body.date,
            duree: req.body.duree,
            pays: req.body.pays,
            synopsis: req.body.synopsis,
            realisateur: req.body.realisateur,
            version: req.body.version,
            urlPoster: req.body.poster,
            urlVideo: req.body.video,
            acteurs: [req.body.acteurs],
            categories: [req.body.categories]
    });

    // Save Video in the database
    video.save(video).then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while creating the Videos."
        });
    });
}

// Retrieve all Videos from the database.
export function findAll(req, res) {
    const titre = req.query.titre;
    let condition = titre ? { titre: { $regex: new RegExp(titre), $options: "i" } } : {};
    Videos.find(condition).then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({ message: err.message || "Some error occurred while retrieving categories." });
    });
}

// Find a single Video with an id
export function findOne(req, res) {
    const id = req.params.id;
    Videos.findById(id).then(data => {
        if (!data)
            res.status(404).send({ message: "Not found Video with id " + id });
        else res.send(data);
    }).catch(err => {
        res.status(500).send({ message: err.message || "Error retrieving Video with id=" + id });
    });
}

// Update a Video by the id in the request
export function update(req, res) {
    if (!req.body) {
        return res.status(400).send({message: "Data to update can not be empty!"});
    }
    const id = req.params.id;
    Videos.findByIdAndUpdate(id, req.body, { useFindAndModify: false }).then(data => {
        if (!data) {
            res.status(404).send({ message: `Cannot update Video with id=${id}. Maybe Video was not found!` });
        } else res.send({ message: "Video was updated successfully." });
    }).catch(err => {
        res.status(500).send({message: err.message || "Error updating Video with id=" + id});
    });
}

// Delete a Video with the specified id in the request
export function Delete(req, res){
    const id = req.params.id;
    Videos.findByIdAndRemove(id, { useFindAndModify: false }).then(data => {
        if (!data) {
            res.status(404).send({ message: `Cannot delete Video with id=${id}. Maybe Video was not found!` });
        } else {
            res.send({message: "Video was deleted successfully!"});
        }
    }).catch(err => {
        res.status(500).send({message: err.message || "Could not delete Video with id=" + id});
    });
};

// Delete all Videos from the database.
export function clear(req, res) {
    Videos.deleteMany({}).then(data => {
        res.send({message: `${data.deletedCount} Videos were deleted successfully!`});
    }).catch(err => {
        res.status(500).send({ message: err.message || "Some error occurred while removing all videos." });
    });
}
