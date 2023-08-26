import { db } from "../models/index.js";
const Categories = db.categories;

// Create and Save a new Categorie
export function create(req, res) {
  // Validate request
    if (!req.body.nom) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }

    // Create a Categorie
    const categorie = new Categories({
            nom: String
    });

    // Save Categorie in the database
    categorie.save(categorie).then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while creating the Categories."
        });
    });
}

// Retrieve all Categories from the database.
export function findAll(req, res) {
    const nom = req.query.titre;
    let condition = nom ? { nom: { $regex: new RegExp(nom), $options: "i" } } : {};
    Categories.find(condition).then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({ message: err.message || "Some error occurred while retrieving categories." });
    });
}

// Find a single Categorie with an id
export function findOne(req, res) {
    const id = req.params.id;
    Categories.findById(id).then(data => {
        if (!data)
            res.status(404).send({ message: "Not found Categorie with id " + id });
        else res.send(data);
    }).catch(err => {
        res.status(500).send({ message: err.message || "Error retrieving Categorie with id=" + id });
    });
}

// Update a Categorie by the id in the request
export function update(req, res) {
    if (!req.body) {
        return res.status(400).send({message: "Data to update can not be empty!"});
    }
    const id = req.params.id;
    Categories.findByIdAndUpdate(id, req.body, { useFindAndModify: false }).then(data => {
        if (!data) {
            res.status(404).send({ message: `Cannot update Categorie with id=${id}. Maybe Categorie was not found!` });
        } else res.send({ message: "Categorie was updated successfully." });
    }).catch(err => {
        res.status(500).send({message: err.message || "Error updating Categorie with id=" + id});
    });
}

// Delete a Categorie with the specified id in the request
export function Delete(req, res){
    const id = req.params.id;
    Categories.findByIdAndRemove(id, { useFindAndModify: false }).then(data => {
        if (!data) {
            res.status(404).send({ message: `Cannot delete Categorie with id=${id}. Maybe Categorie was not found!` });
        } else {
            res.send({message: "Categorie was deleted successfully!"});
        }
    }).catch(err => {
        res.status(500).send({message: err.message || "Could not delete Categorie with id=" + id});
    });
};

// Delete all Categories from the database.
export function clear(req, res) {
    Categories.deleteMany({}).then(data => {
        res.send({message: `${data.deletedCount} Categories were deleted successfully!`});
    }).catch(err => {
        res.status(500).send({ message: err.message || "Some error occurred while removing all categories." });
    });
}
