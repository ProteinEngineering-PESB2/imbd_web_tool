"use strict"
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var AntibodyAntigenRelations = Schema({
    pdb_file: String,
    interactions_predicted: Array,
    rows_data: Array,
    id_antibody: String,
    id_antigen: String
});
module.exports = mongoose.model("antibody_antigen_relations", AntibodyAntigenRelations, "antibody_antigen_relations");