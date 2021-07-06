"use strict"
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var TermsSchema = Schema({
    text: String,
    rol: String,
    Colection: String
});
module.exports = mongoose.model("Terms", TermsSchema, "Terms");