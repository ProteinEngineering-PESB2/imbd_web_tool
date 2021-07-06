"use strict"
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var EpitopeSchema = Schema({
});
module.exports = mongoose.model("epitope", EpitopeSchema, "epitope");