"use strict"
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var AntigenSearchView = Schema({
    id_sequence: String,
    has_pdb: Number,
    pdb_id: String,
    Length: Number,
    Type: String,
    Pfam: Array,
    GO_Celular_Component: String,
    GO_Biological_Process: String,
    GO_Molecular_Function: String,
    epitopes: Array
});
module.exports = mongoose.model("AntigenSearchView", AntigenSearchView, "AntigenSearchView");