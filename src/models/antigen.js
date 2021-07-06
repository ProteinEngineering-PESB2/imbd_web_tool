"use strict"
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var AntigenSchema = Schema({
    'id_sequence': String,
    'Sequence': String,
    'Length': Number,
    'Light': Number,
    'Heavy': Number,
    'database_value': {
        'Uniprot/Antibodypedia': Number,
        'Uniprot/ABCD': Number,
        'abYsis': Number,
        'AbDb': Number,
        'CBtope': Number,
        'abYBank': Number,
        'BciPep': Number,
        'IMGT-3D': Number,
        'SabDab': Number,
        'sacs': Number,
        'Experimental': Number,
    },
    'statistic_value': {
        'no_polares_alifaticos': Number,
        'polares_sin_carga': Number,
        'aromaticos': Number,
        'carga_positiva': Number,
        'carga_negativa': Number,
        'A': Number,
        'R': Number,
        'N': Number,
        'D': Number,
        'C': Number,
        'Q': Number,
        'E': Number,
        'G': Number,
        'H': Number,
        'I': Number,
        'L': Number,
        'K': Number,
        'M': Number,
        'F': Number,
        'P': Number,
        'S': Number,
        'T': Number,
        'W': Number,
        'Y': Number,
        'V': Number
    },
    'go_predictions': {
        'Molecular_Function_GO': String,
        'Predict_value_MFO': Number,
        'Biological_Process_GO': String,
        'Predict_value_BPO': Number,
        'Celular_Component_GO': String,
        'Predict_value_CCO': Number
    },
    'phy_properties': {
        'MolecularWeight': Number,
        'Isoelectric_point': Number,
        'Charge_density': Number,
        'Charge': Number
    },
    'structural_value': {
        'Valor_Alfa_helice_ss3': Number,
        'Valor_Hebra_beta_ss3': Number,
        'Valor_Coil_ss3': Number,
        'Valor_orden': Number,
        'Valor_desorden': Number,
        'Valor_Alfa_helice_ss8': Number,
        'Valor_helice_310_ss8': Number,
        'Valor_pi_helice_ss8': Number,
        'Valor_Hebra_beta_ss8': Number,
        'Valor_puente_beta_ss8': Number,
        'Valor_vuelta_beta_ss8': Number,
        'Valor_bucle_alta_curvatura_ss8': Number,
        'Valor_bucle_irregular_ss8': Number,
        'Valor_enterrados_sac': Number,
        'Valor_intermedios_sac': Number,
        'Valor_expuestos_sac': Number,
        'ss3_properties': String,
        'diso_properties': String,
        'ss8_properties': String,
        'sac_properties': String
    },
    'pfam_prediction': [
        {
            'Accession': String,
            'Id_accession': String,
            'Type': String,
            'Class': String,
            'Evalue': Number,
            'Bitscore': Number
        }
    ],
    'has_pdb': Number,
    'pdb_id': String
});
module.exports = mongoose.model("antigen", AntigenSchema, "antigen");