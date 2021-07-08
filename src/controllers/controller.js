const indexCtrl = {};
const { PythonShell } = require('python-shell');
var fs = require('fs');
var Antibody = require("../models/antibody");
var Antigen = require("../models/antigen");
var Epitope = require("../models/epitope");
var GO_Pfam = require("../models/go_pfam");
var AntibodySearchView = require("../models/AntibodySearchView");
var AntigenSearchView = require("../models/AntigenSearchView");
var EpitopeSearchView = require("../models/EpitopeSearchView");
var Terms = require("../models/Terms");

//Ruteos a vistas
indexCtrl.renderIndex = (req, res) => {
    var sliderfiles = fs.readdirSync('./src/public/img/slider').map(file => `./img/slider/${file}`)
    res.render('index', { sliderfiles: sliderfiles });
};
indexCtrl.renderAntibody = (req, res) => {
    res.render('antibody');
};
indexCtrl.renderAntigen = (req, res) => {
    res.render('antigen');
};
indexCtrl.renderEpitope = (req, res) => {
    res.render('epitope');
};
indexCtrl.renderSearch = (req, res) => {
    res.render('search');
};
indexCtrl.renderTools = (req, res) => {
    res.render('tools');
};
indexCtrl.renderAbout = (req, res) => {
    res.render('about');
};
indexCtrl.renderStructure = (req, res) => {
    res.render('structure', { structure: req.params.structure });
};
indexCtrl.renderAlignment = (req, res) => {
    res.render('aligment');
};
indexCtrl.renderMapping = (req, res) => {
    res.render('mapping');
};
indexCtrl.renderPhysicochemical = (req, res) => {
    res.render('physicochemical');
};
indexCtrl.renderPredict_values = (req, res) => {
    res.render('predict_values');
};
indexCtrl.renderPredict_interaction = (req, res) => {
    res.render('predict_interaction');
};
indexCtrl.renderStatistical = (req, res) => {
    res.render('statistical');
};
indexCtrl.renderProfile = (req, res) => {
    let id = req.body.id;
    let type = req.body.type;
    let col
    console.log(type)
    if (type == "Antibody") { col = Antibody }
    if (type == "Antigen") { col = Antigen }
    if (type == "Antibody" || type == "Antigen") {
        col.findOne({ id_sequence: id }, {}).exec((err, data) => {
            let database = data.database_value
            let arr_data_sources = []
            let data_sources = Object.keys(database)
            data_sources.forEach(function (x) {
                if (database[x] == 1) {
                    arr_data_sources.push(x)
                }
            })
            res.render(`profile${type}`, { data: data, data_sources: arr_data_sources });
        })
    }
    if (type == "Epitope") {
        Epitope.findOne({ id_sequence: id }, {}).exec((err, data) => {
            console.log(data)
            let arr_data_sources = []
            if(data.BciPep == "1"){arr_data_sources.push("BciPep")}
            if(data.CBtope == "1"){arr_data_sources.push("CBtope")}
            if(data.dbPepNeo == "1"){arr_data_sources.push("dbPepNeo")}
            if(data.IEDB == "1"){arr_data_sources.push("IEDB")}
            if(data.VDJ == "1"){arr_data_sources.push("VDJ")}
            res.render('profileEpitope', { id: id, data: data, data_sources: arr_data_sources })
        });
    }
};
//Apis
indexCtrl.getAntigen = (req, res) => {
    let id = req.params.id;
    Antigen.find({ id_sequence: id }, {}).exec((err, data) => {
        return res.status(200).send(data)
    })
};
indexCtrl.getAntibody = (req, res) => {
    let id = req.params.id;
    Antibody.find({ id_sequence: id }, {}).exec((err, data) => {
        return res.status(200).send(data)
    })
};
indexCtrl.getEpitope = (req, res) => {
    let id = req.params.id;
    Epitope.find({ id_sequence: id }, {}).exec((err, data) => {
        return res.status(200).send(data)
    })
};
indexCtrl.getSequence = (req, res) => {
    let options = {
        pythonOptions: ["-W", "ignore"],
        args: [req.params.structure]
    };
    PythonShell.run('src/scripts/getSequenceFromStructure.py', options, function (err, results) {
        let data = JSON.parse(results);
        return res.status(200).send(data)
    })
};
indexCtrl.getGO = (req, res) => {
    GO_Pfam.findOne({ "Colection": req.body['type'] }, {}).exec((err, data) => {
        return res.status(200).send(data)
    })
};
indexCtrl.getFastaInfo = (req, res) => {
    let file = req.params.file
    let options = {
        args: [`src/public/services/${file}`]
    };
    PythonShell.run('src/scripts/getFastaInfo.py', options, function (err, results) {
        if (err) {
            console.log(err)
        }
        else {
            let data = JSON.parse(results);
            return res.status(200).send(data)
        }
    })
}
indexCtrl.ServiceInteractions = (req, res) => {
    let pdb = req.params.pdb
    let type = req.params.type
    let options = {
        pythonOptions: ["-W", "ignore"],
        args: ["src/public/services/", type, pdb]
    };
    PythonShell.run('src/scripts/predict_interaction_data_service.py', options, function (err, results) {
        if (err) {
            console.log(err)
        }
        else {
            let data = JSON.parse(results);
            return res.status(200).send(data)
        }
    });
};
indexCtrl.ServicePhysicochemical = (req, res) => {
    let file = req.params.file
    let options = {
        args: [`src/public/services/${file}`]
    }
    PythonShell.run('src/scripts/physicochemical_characteristics_service.py', options, function (err, results) {
        if (err) {
            console.log(err)
        }
        else {
            let data = JSON.parse(results);
            return res.status(200).send(data)
        }
    })
}
indexCtrl.ServiceGeneOntology = (req, res) => {
    let file = req.params.file
    let options = {
        args: [`src/public/services/${file}`, "src/public/services/"]
    }
    PythonShell.run('src/scripts/predict_go_values_service.py', options, function (err, results) {
        if (err) {
            console.log(err)
        }
        else {
            let data = JSON.parse(results);
            return res.status(200).send(data)
        }
    })
}
indexCtrl.ServicePFam = (req, res) => {
    let file = req.params.file
    let options = {
        args: [`src/public/services/${file}`, "src/public/services/"]
    }
    PythonShell.run('src/scripts/predict_pfam_properties_service.py', options, function (err, results) {
        if (err) {
            console.log(err)
        }
        else {
            let data = JSON.parse(results);
            return res.status(200).send(data)
        }
    })
}
indexCtrl.ServiceStructural = (req, res) => {
    let file = req.params.file
    let options = {
        args: [`src/public/services/${file}`, "src/public/services/"]
    }
    PythonShell.run('src/scripts/predict_structural_properties_service.py', options, function (err, results) {
        if (err) {
            console.log(err)
        }
        else {
            let data = JSON.parse(results);
            return res.status(200).send(data)
        }
    })
}
indexCtrl.ServiceStatistical = (req, res) => {
    let file = req.params.file
    let options = {
        args: [`src/public/services/${file}`]
    }
    PythonShell.run('src/scripts/statistical_counts_service.py', options, function (err, results) {
        if (err) {
            console.log(err)
        }
        else {
            let data = JSON.parse(results);
            return res.status(200).send(data)
        }
    })
}
indexCtrl.ServiceMappingFilters = (req, res) => {
    let query = {}
    query["Length"] = { "$gte": parseInt(req.body["min"]), "$lte": parseInt(req.body["max"]) }
    if (req.body["pfam"] != "") { query["Pfam"] = req.body["pfam"] }
    if (req.body["go_cc"] != "") { query["GO_Celular_Component"] = req.body["go_cc"] }
    if (req.body["go_mf"] != "") { query["GO_Molecular_Function"] = req.body["go_mf"] }
    if (req.body["go_bp"] != "") { query["GO_Biological_Process"] = req.body["go_bp"] }
    AntigenSearchView.find(query, { "_id": 0, "id_sequence": 1, "Sequence": 1 }).limit(1000).exec((err, data) => {
        let number = Math.ceil(Math.random() * 100000)
        let route = `src/public/services/${number}.json`
        let text = JSON.stringify(data)
        fs.writeFileSync(route, text, 'utf8')
        let options = {
            args: [req.body["map_sequence"], route, "json"],
        }
        PythonShell.run('src/scripts/mapping_from_fasta_service.py', options, function (err, results) {
            if (err) { return res.status(200).send(err) }
            else {
                let response = JSON.parse(results)
                fs.unlinkSync(route)
                return res.status(200).send(response)
            }
        })
    })
}
indexCtrl.ServiceMappingFasta = (req, res) => {
    let file = req.body["file"]
    let sequence = req.body["map_sequence"]
    let route = `src/public/services/${file}`
    let options = {
        args: [sequence, route, "fasta"],
    }
    PythonShell.run('src/scripts/mapping_from_fasta_service.py', options, function (err, results) {
        if (err) { return res.status(200).send(err) }
        else {
            let response = JSON.parse(results)
            fs.unlinkSync(route)
            return res.status(200).send(response)
        }
    })
}
indexCtrl.ServiceAlignment = (req, res) => {
    let query = {}
    database = req.body["database"];
    query["Length"] = { "$gte": parseInt(req.body["min"]), "$lte": parseInt(req.body["max"]) }
    if (req.body["pfam"] != "") { query["Pfam"] = req.body["pfam"] }
    if (req.body["go_cc"] != "") { query["GO_Celular_Component"] = req.body["go_cc"] }
    if (req.body["go_mf"] != "") { query["GO_Molecular_Function"] = req.body["go_mf"] }
    if (req.body["go_bp"] != "") { query["GO_Biological_Process"] = req.body["go_bp"] }
    var col
    if (database == "Antigen") {
        col = AntigenSearchView
    }
    if (database == "Antibody") {
        col = AntibodySearchView
    }
    col.find(query, { "_id": 0, "id_sequence": 1, "Sequence": 1 }).limit(1000).exec((err, data) => {
        let number = Math.ceil(Math.random() * 100000)
        let route = `src/public/services/${number}.json`
        let text = JSON.stringify(data)
        fs.writeFileSync(route, text, 'utf8')
        let options = {
            args: [req.body["map_sequence"], route],
        }
        PythonShell.run('src/scripts/alignment_service_example.py', options, function (err, results) {
            if (err) { return res.status(200).send(err) }
            else {
                let response = JSON.parse(results)
                fs.unlinkSync(route)
                return res.status(200).send(response)
            }
        })
    })
}
indexCtrl.uploadFile = (req, res) => {
    path = req.files.file.path.split("/");
    path.pop()
    filename = req.files.file.name;
    new_path = path.join("/")
    new_path = new_path.concat("/").concat(filename)
    fs.rename(req.files.file.path, new_path, function () { })
    if (req.files) {
        return res.status(200).send({
            message: "success"
        })
    }
    else {
        return res.status(200).send({
            message: "no subido"
        })
    }
}
indexCtrl.getLengthCollection = (req, res) => {
    let col = req.body.col;
    if (col == "Epitope") {
        EpitopeSearchView.countDocuments({}, (err, count) => {
            return res.status(200).send({ "count": count })
        })
    }
    if (col == "Antigen") {
        AntigenSearchView.countDocuments({}, (err, count) => {
            return res.status(200).send({ "count": count })
        })
    }
    if (col == "Antibody") {
        AntibodySearchView.countDocuments({}, (err, count) => {
            return res.status(200).send({ "count": count })
        })
    }
}
indexCtrl.getLengthCollectionQuery = (req, res) => {
    let col = req.body.col;
    let params = req.body
    query = {}
    if (col == "Epitope") {
        query["Length"] = { "$gte": parseInt(params["min"]), "$lte": parseInt(params["max"]) }
        if (params["has_antigen"] == "true") {
            query["has_antigen"] = 1;
            if (params["antigen_id"] != "") { query["antigens"] = params["antigen_id"]; }
        }
        if (params["type_molecule"] != "") { query["Type"] = params["type_molecule"] }
        EpitopeSearchView.countDocuments(query, (err, count) => {
            return res.status(200).send({ "count": count })
        })
    }
    if (col == "Antigen") {
        query["Length"] = { "$gte": parseInt(params["min"]), "$lte": parseInt(params["max"]) }
        if (params["pfam"] != "") { query["Pfam"] = params["pfam"] }
        if (params["go_cc"] != "") { query["GO_Celular_Component"] = params["go_cc"] }
        if (params["go_mf"] != "") { query["GO_Molecular_Function"] = params["go_mf"] }
        if (params["go_bp"] != "") { query["GO_Biological_Process"] = params["go_bp"] }
        if (params["has_pdb"] == "true") {
            query["has_pdb"] = 1;
            if (params["pdb_id"] != "") { query["pdb_id"] = params["pdb_id"]; }
        }
        if (params["has_interaction"] == "true") {
            query["has_interaction"] = 1;
            if (params["interaction_id"] != "") { query["antibody_relation"] = params["interaction_id"]; }
        }
        AntigenSearchView.countDocuments(query, (err, count) => {
            return res.status(200).send({ "count": count })
        })
    }
    if (col == "Antibody") {
        console.log(params)
        query["Length"] = { "$gte": parseInt(params["min"]), "$lte": parseInt(params["max"]) }
        if (params["pfam"] != "") { query["Pfam"] = params["pfam"] }
        if (params["go_cc"] != "") { query["GO_Celular_Component"] = params["go_cc"] }
        if (params["go_mf"] != "") { query["GO_Molecular_Function"] = params["go_mf"] }
        if (params["go_bp"] != "") { query["GO_Biological_Process"] = params["go_bp"] }
        if (params["chain"] == "Light") { query["Type"] == "Light"; }
        if (params["chain"] == "Heavy") { query["Type"] == "Heavy"; }
        if (params["has_pdb"] == "true") {
            query["has_pdb"] = 1;
            if (params["pdb_id"] != "") { query["pdb_id"] = params["pdb_id"]; }
        }
        if (params["has_interaction"] == "true") {
            query["has_interaction"] = 1;
            if (params["interaction_id"] != "") { query["antigen_relation"] = params["interaction_id"]; }
        }
        AntibodySearchView.countDocuments(query, (err, count) => {
            return res.status(200).send({ "count": count })
        })
    }
}
indexCtrl.getTerms = (req, res) => {
    let params = req.query
    let col = params["col"]
    let rol = params["rol"]
    let search = params["search"]
    Terms.find({ "Colection": col, "rol": rol, "text": { $regex: search } }, { "_id": 0, "text": 1 }).limit(50).exec((err, data) => {
        data.unshift({ id: -1, text: "" })
        return res.status(200).send({
            data: data
        })
    })
}
indexCtrl.searchEpitope = (req, res) => {
    var params = req.body
    query = {}
    var page_length = parseInt(params.length)
    var skip = parseInt(params.start)
    query["Length"] = { "$gte": parseInt(params["min"]), "$lte": parseInt(params["max"]) }
    if (params["has_antigen"] == "true") {
        query["has_antigen"] = 1;
        if (params["antigen_id"] != "") { query["antigens"] = params["antigen_id"]; }
    }
    if (params["type_molecule"] != "") { query["Type"] = params["type_molecule"] }
    /* query["id_sequence"] = {$regex: params.search} */
    EpitopeSearchView.find(query, {}).skip(skip).limit(page_length).exec((err, data) => {
        return res.status(200).send({
            data: data,
        })
    })
};
indexCtrl.searchAntigen = (req, res) => {
    let params = req.body
    let query = {}
    let page_length = parseInt(params.length)
    let skip = parseInt(params.start)
    query["Length"] = { "$gte": parseInt(params["min"]), "$lte": parseInt(params["max"]) }
    if (params["pfam"] != "") { query["Pfam"] = params["pfam"] }
    if (params["go_cc"] != "") { query["GO_Celular_Component"] = params["go_cc"] }
    if (params["go_mf"] != "") { query["GO_Molecular_Function"] = params["go_mf"] }
    if (params["go_bp"] != "") { query["GO_Biological_Process"] = params["go_bp"] }
    if (params["has_pdb"] == "true") {
        query["has_pdb"] = 1;
        if (params["pdb_id"] != "") { query["pdb_id"] = params["pdb_id"]; }
    }
    if (params["has_interaction"] == "true") {
        query["has_interaction"] = 1;
        if (params["interaction_id"] != "") { query["antibody_relation"] = params["interaction_id"]; }
    }
    /* query["id_sequence"] = {$regex: params.search} */
    AntigenSearchView.find(query, {}).skip(skip).limit(page_length).exec((err, data) => {
        return res.status(200).send({
            data: data,
        })
    })
};
indexCtrl.searchAntibody = (req, res) => {
    var params = req.body
    console.log(params)
    query = {}
    var page_length = parseInt(params.length)
    var skip = parseInt(params.start)
    query["Length"] = { "$gte": parseInt(params["min"]), "$lte": parseInt(params["max"]) }
    if (params["pfam"] != "") { query["Pfam"] = params["pfam"] }
    if (params["go_cc"] != "") { query["GO_Celular_Component"] = params["go_cc"] }
    if (params["go_mf"] != "") { query["GO_Molecular_Function"] = params["go_mf"] }
    if (params["go_bp"] != "") { query["GO_Biological_Process"] = params["go_bp"] }
    if (params["chain"] == "Light") { query["Type"] == "Light"; }
    if (params["chain"] == "Heavy") { query["Type"] == "Heavy"; }
    if (params["has_pdb"] == "true") {
        query["has_pdb"] = 1;
        if (params["pdb_id"] != "") { query["pdb_id"] = params["pdb_id"]; }
    }
    if (params["has_interaction"] == "true") {
        query["has_interaction"] = 1;
        if (params["interaction_id"] != "") { query["antigen_relation"] = params["interaction_id"]; }
    }
    /* query["id_sequence"] = {$regex: params.search} */
    AntibodySearchView.find(query, {}).skip(skip).limit(page_length).exec((err, data) => {
        return res.status(200).send({
            data: data,
        })
    })
};
module.exports = indexCtrl;
