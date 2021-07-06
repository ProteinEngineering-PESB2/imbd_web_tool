"use strict"
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var GeneOntologiesSchema = Schema({
    colection: String,
    Cellular_component: Array,
    Molecular_function: Array,
    Biological_process: Array,
    Pfam: Array,
    minLength: Number,
    maxLength: Number
});
module.exports = mongoose.model("go_pfam", GeneOntologiesSchema, "go_pfam");