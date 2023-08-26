export function categories(mongoose) {
    let schema = mongoose.Schema(
        {
            nom: String  
        }
    );
  
    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });
  
    const Categories = mongoose.model("categories", schema);
    return Categories;
};