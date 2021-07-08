"use strict"
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var EpitopeSchema = Schema({
    id_sequence: String,
    Sequence: String,
    Length: Number,
    BciPep: Number,
    CBtope: Number,
    dbPepNeo: Number,
    IEDB: Number,
    VDJ: Number,
    lineal: Number,
    estructural: Number,
});
module.exports = mongoose.model("epitope", EpitopeSchema, "epitope");