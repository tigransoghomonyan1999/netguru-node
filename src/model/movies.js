const mongoose = require("mongoose");
const autoIncrement = require("simple-mongoose-autoincrement");


const movieSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    id: Number,
    creatorId: String,
    title: String,
    released: String,
    genre: String,
    director: String,
    creationRestrictionCounter: Number
});

movieSchema.plugin(autoIncrement, { field: "id" });


module.exports = mongoose.model("movies", movieSchema);