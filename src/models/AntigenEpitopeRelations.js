"use strict"
var mongoose = require("mongoose");
var dataTables = require("mongoose-datatables")
var Schema = mongoose.Schema;
var AntigenEpitopeRelations = Schema({
    id: Number,
    epitope: String,
    antigen: String
});
AntigenEpitopeRelations.plugin(dataTables);
module.exports = mongoose.model("antigen_epitopes_relations", AntigenEpitopeRelations, "antigen_epitopes_relations");