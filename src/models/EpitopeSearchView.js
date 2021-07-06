"use strict"
var mongoose = require("mongoose");
var dataTables = require("mongoose-datatables")
var Schema = mongoose.Schema;
var EpitopeSearchView = Schema({
    id_sequence: String,
    Length: Number,
    antigens: Array
});
EpitopeSearchView.plugin(dataTables);
module.exports = mongoose.model("EpitopeSearchView", EpitopeSearchView, "EpitopeSearchView");