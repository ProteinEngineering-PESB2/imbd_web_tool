const indexCtrl = {};
const {PythonShell} = require('python-shell');
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
indexCtrl.renderIndex = (req,res) =>{
    var sliderfiles = fs.readdirSync('./src/public/img/slider').map(file => "./img/slider/" + file)
    res.render('index', {sliderfiles: sliderfiles});
};
indexCtrl.renderAntibody = (req,res) =>{
    res.render('antibody');
};
indexCtrl.renderAntigen = (req,res) =>{
    res.render('antigen');
};
indexCtrl.renderEpitope = (req,res) =>{
    res.render('epitope');
};
indexCtrl.renderSearch = (req,res) =>{
    res.render('search');
};
indexCtrl.renderTools = (req,res) =>{
    res.render('tools');
};
indexCtrl.renderAbout = (req,res) =>{
    res.render('about');
};
indexCtrl.renderStructure = (req,res) =>{
    res.render('structure', {structure: req.params.structure});
};
indexCtrl.renderAlignment = (req,res) =>{
    res.render('aligment');
};
indexCtrl.renderMapping = (req,res) =>{
    res.render('mapping');
};
indexCtrl.renderPhysicochemical = (req,res) =>{
    res.render('physicochemical');
};
indexCtrl.renderPredict_values = (req,res) =>{
    res.render('predict_values');
};
indexCtrl.renderPredict_interaction = (req,res) =>{
    res.render('predict_interaction');
};
indexCtrl.renderStatistical = (req,res) =>{
    res.render('statistical');
};
indexCtrl.renderProfile = (req, res)=>{
    let id = req.params.id;
    let type = req.params.type;
    let col
    if(type == "Antibody"){col = Antibody}
    if(type == "Antigen"){col = Antigen}
    if(type == "Antibody" || type == "Antigen"){
        col.findOne({id_sequence: id}, {}).exec((err, data) =>{
            database = data.database_value
            arr_data_sources = []
            data_sources = Object.keys(database)
            data_sources.forEach(function(x){
                if(database[x] == 1){
                    arr_data_sources.push(x)
                }
            })
            res.render('profile-' + type.toLowerCase(), {data: data, data_sources: arr_data_sources});
        })
    }
    if(type == "Epitope"){
        res.render('profile-epitope', {id: id});
    }
};
//Apis
indexCtrl.getAntigen = (req, res) =>{
    let id = req.params.id;
    Antigen.find({id_sequence: id}, {}).exec((err, data)=>{
        return res.status(200).send(data)
    })
};
indexCtrl.getAntibody = (req, res) =>{
    let id = req.params.id;
    Antibody.find({id_sequence: id},{}).exec((err, data)=>{
        return res.status(200).send(data)
    })
};
indexCtrl.getEpitope = (req, res) =>{
    let id = req.params.id;
    Epitope.find({id_sequence: id},{}).exec((err, data)=>{
        return res.status(200).send(data)
    })
};
indexCtrl.getSequence = (req, res) => {
    let options = {
        pythonOptions: ["-W", "ignore"],
        args: [req.params.structure]
    };
    PythonShell.run('src/scripts/getSequenceFromStructure.py', options, function(err, results){
        let data = JSON.parse(results);
        return res.status(200).send(data)
    })
};
indexCtrl.getSearch = (req, res) => {
    //Devuelve las entidades que cumplen con el query establecido en el search
    let Colection
    Colection = req.body["type"];
    query = {}
    query["Length"] = {"$gte": parseInt(req.body["min"]), "$lte": parseInt(req.body["max"])}
    if(Colection == "Antibody"){
        if(req.body["pfam"] != ""){query["Pfam"] = req.body["pfam"]}
        if(req.body["go_cc"] != ""){query["GO_Celular_Component"] = req.body["go_cc"]}
        if(req.body["go_mf"] != ""){query["GO_Molecular_Function"] = req.body["go_mf"]}
        if(req.body["go_bp"] != ""){query["GO_Biological_Process"] = req.body["go_bp"]}
        if(req.body["chain"] == "Light"){query["Type"] == "Light";}
        if(req.body["chain"] == "Heavy"){query["Type"] == "Heavy";}
        if(req.body["has_pdb"] == "true"){
            query["has_pdb"] = 1;
            if(req.body["pdb_id"] != ""){query["pdb_id"] = req.body["pdb_id"];}
        }
        if(req.body["has_interaction"] == "true"){
            query["has_interaction"] = 1;
            if(req.body["interaction_id"] != ""){query["antigen_relation"] = req.body["interaction_id"];}
        }
        AntibodySearchView.find(query, {"_id": 0}).limit(1000).exec((err, data)=>{
            return res.status(200).send(data)
        })
    }
    if(Colection == "Antigen"){
        if(req.body["pfam"] != ""){query["Pfam"] = req.body["pfam"]}
        if(req.body["go_cc"] != ""){query["GO_Celular_Component"] = req.body["go_cc"]}
        if(req.body["go_mf"] != ""){query["GO_Molecular_Function"] = req.body["go_mf"]}
        if(req.body["go_bp"] != ""){query["GO_Biological_Process"] = req.body["go_bp"]}
        if(req.body["has_pdb"] == "true"){
            query["has_pdb"] = 1;
            if(req.body["pdb_id"] != ""){query["pdb_id"] = req.body["pdb_id"];}
        }
        if(req.body["has_interaction"] == "true"){
            query["has_interaction"] = 1;
            if(req.body["interaction_id"] != ""){query["antibody_relation"] = req.body["interaction_id"];}
        }
        AntigenSearchView.find(query, {"_id": 0}).limit(1000).exec((err, data)=>{
            return res.status(200).send(data)
        })
    }
    if(Colection == "Epitope"){
        if(req.body["has_antigen"] == "true"){
            query["has_antigen"] = 1;
            if(req.body["antigen_id"] != ""){query["antigens"] = req.body["antigen_id"];}
        }
        if(req.body["type_molecule"] != ""){query["Type"] = req.body["type_molecule"]}
        EpitopeSearchView.find(query, {"_id": 0}).limit(1000).exec((err, data)=>{
            return res.status(200).send(data)
        })
    }
};
indexCtrl.getGO = (req, res)=>{ 
    GO_Pfam.findOne({"Colection": req.body['type'] },{}).exec((err, data)=>{
        return res.status(200).send(data)
    })
};
indexCtrl.getFastaInfo = (req, res)=>{
    let file = req.params.file
    let options = {
        args: ["src/public/services/" + file]
    };
    PythonShell.run('src/scripts/getFastaInfo.py', options, function(err, results){
        if(err){
            console.log(err)
        }
        else{
            let data = JSON.parse(results);
            return res.status(200).send(data)
        }
    })
}
indexCtrl.ServiceInteractions = (req, res)=>{
    let pdb = req.params.pdb
    let type = req.params.type
    let options = {
        pythonOptions: ["-W", "ignore"],
        args: ["src/public/services/", type, pdb]
    };
    PythonShell.run('src/scripts/predict_interaction_data_service.py', options, function(err, results){
        if(err){
            console.log(err)
        }
        else{
            let data = JSON.parse(results);
            return res.status(200).send(data)
        }
    });
};
indexCtrl.ServicePhysicochemical = (req, res)=>{
    let file = req.params.file
    let options = {
        args: ["src/public/services/" + file]
    }
    PythonShell.run('src/scripts/physicochemical_characteristics_service.py', options, function(err, results){
        if(err){
            console.log(err)
        }
        else{
            let data = JSON.parse(results);
            return res.status(200).send(data)
        }
    })
}
indexCtrl.ServiceGeneOntology = (req, res)=>{
    let file = req.params.file
    let options = {
        args: ["src/public/services/" + file, "src/public/services/"]
    }
    PythonShell.run('src/scripts/predict_go_values_service.py', options, function(err, results){
        if(err){
            console.log(err)
        }
        else{
            let data = JSON.parse(results);
            return res.status(200).send(data)
        }
    })
}
indexCtrl.ServicePFam = (req, res)=>{
    let file = req.params.file
    let options = {
        args: ["src/public/services/" + file, "src/public/services/"]
    }
    PythonShell.run('src/scripts/predict_pfam_properties_service.py', options, function(err, results){
        if(err){
            console.log(err)
        }
        else{
            let data = JSON.parse(results);
            return res.status(200).send(data)
        }
    })
}
indexCtrl.ServiceStructural = (req, res)=>{
    let file = req.params.file
    let options = {
        args: ["src/public/services/" + file, "src/public/services/"]
    }
    PythonShell.run('src/scripts/predict_structural_properties_service.py', options, function(err, results){
        if(err){
            console.log(err)
        }
        else{
            let data = JSON.parse(results);
            return res.status(200).send(data)
        }
    })
}
indexCtrl.ServiceStatistical = (req, res)=>{
    let file = req.params.file
    let options = {
        args: ["src/public/services/" + file]
    }
    PythonShell.run('src/scripts/statistical_counts_service.py', options, function(err, results){
        if(err){
            console.log(err)
        }
        else{
            let data = JSON.parse(results);
            return res.status(200).send(data)
        }
    })
}
indexCtrl.ServiceMappingFilters = (req, res)=>{
    let query = {}
    query["Length"] = {"$gte": parseInt(req.body["min"]), "$lte": parseInt(req.body["max"])}
    if(req.body["pfam"] != ""){query["Pfam"] = req.body["pfam"]}
    if(req.body["go_cc"] != ""){query["GO_Celular_Component"] = req.body["go_cc"]}
    if(req.body["go_mf"] != ""){query["GO_Molecular_Function"] = req.body["go_mf"]}
    if(req.body["go_bp"] != ""){query["GO_Biological_Process"] = req.body["go_bp"]}
    AntigenSearchView.find(query, {"_id": 0, "id_sequence": 1, "Sequence": 1}).limit(1000).exec((err, data)=>{
        let number = Math.ceil(Math.random()*100000)
        let route = 'src/public/services/'+number+'.json'
        let text = JSON.stringify(data)
        fs.writeFileSync(route, text, 'utf8')
        let options = {
            args: [req.body["map_sequence"], route, "json"],
        }
        PythonShell.run('src/scripts/mapping_from_fasta_service.py', options, function(err, results){
            if(err){return res.status(200).send(err)}
            else{
                let response = JSON.parse(results)
                fs.unlinkSync(route)
                return res.status(200).send(response)
            }
        })
    })
}
indexCtrl.ServiceMappingFasta = (req, res)=>{
    let file = req.body["file"]
    let sequence = req.body["map_sequence"]
    let route = 'src/public/services/' + file
    let options = {
        args: [sequence, route, "fasta"],
    }
    PythonShell.run('src/scripts/mapping_from_fasta_service.py', options, function(err, results){
        if(err){return res.status(200).send(err)}
        else{
            let response = JSON.parse(results)
            fs.unlinkSync(route)
            return res.status(200).send(response)
        }
    })
}
indexCtrl.ServiceAlignment = (req, res)=>{
    let query = {}
    database = req.body["database"];
    query["Length"] = {"$gte": parseInt(req.body["min"]), "$lte": parseInt(req.body["max"])}
    if(req.body["pfam"] != ""){query["Pfam"] = req.body["pfam"]}
    if(req.body["go_cc"] != ""){query["GO_Celular_Component"] = req.body["go_cc"]}
    if(req.body["go_mf"] != ""){query["GO_Molecular_Function"] = req.body["go_mf"]}
    if(req.body["go_bp"] != ""){query["GO_Biological_Process"] = req.body["go_bp"]}
    var col
    if(database == "Antigen"){
        col = AntigenSearchView
    }
    if(database == "Antibody"){
        col = AntibodySearchView
    }
    col.find(query, {"_id": 0, "id_sequence": 1, "Sequence": 1}).limit(1000).exec((err, data)=>{
        let number = Math.ceil(Math.random()*100000)
        let route = 'src/public/services/'+number+'.json'
        let text = JSON.stringify(data)
        fs.writeFileSync(route, text, 'utf8')
        let options = {
            args: [req.body["map_sequence"], route],
        }
        PythonShell.run('src/scripts/alignment_service_example.py', options, function(err, results){
            if(err){return res.status(200).send(err)}
            else{
                let response = JSON.parse(results)
                fs.unlinkSync(route)
                return res.status(200).send(response)
            }
        })
    })
}
indexCtrl.uploadFile = (req,res)=>{
    path = req.files.file.path.split("/");
    path.pop()
    filename = req.files.file.name;
    new_path = path.join("/")
    new_path = new_path.concat("/").concat(filename)
    fs.rename(req.files.file.path, new_path, function(){})
    if(req.files){
        return res.status(200).send({
            message: "success"
        })
    }
    else{
        return res.status(200).send({
            message: "no subido"
        })
    }
}

indexCtrl.getLengthCollection = (req, res)=>{
    let col = req.body.col;
    if(col == "Epitope"){
        EpitopeSearchView.countDocuments({}, (err, count)=>{
            return res.status(200).send({"count": count})
        })
    }
    if(col == "Antigen"){
        AntigenSearchView.countDocuments({}, (err, count)=>{
            return res.status(200).send({"count": count})
        })
    }
    if(col == "Antibody"){
        AntibodySearchView.countDocuments({}, (err, count)=>{
            return res.status(200).send({"count": count})
        })
    }
}
indexCtrl.getTerms = (req, res)=>{
    let body = req.body
    console.log(body)
    let params = req.params
    console.log(params)
    let col = params["col"]
    let rol = params["rol"]
    Terms.find({"Colection": col, "rol": rol},{"_id": 0, "rol": 0, "Colection": 0}).exec((err, data)=>{
        return res.status(200).send({
            data:data
        })
    })
}
indexCtrl.searchEpitope = (req, res)=>{
    var params = req.body
    query = {}
    var page_length = parseInt(params.length)
    var skip = parseInt(params.start)
    EpitopeSearchView.find(query,{}).skip(skip).limit(page_length).exec((err, data)=>{
        return res.status(200).send({
            data: data,
        })
    })
};
indexCtrl.searchAntigen = (req, res)=>{
    var params = req.body
    query = {}
    var page_length = parseInt(params.length)
    var skip = parseInt(params.start)
    AntigenSearchView.find(query,{}).skip(skip).limit(page_length).exec((err, data)=>{
        return res.status(200).send({
            data: data,
        })
    })
};
indexCtrl.searchAntibody = (req, res)=>{
    var params = req.body
    query = {}
    var page_length = parseInt(params.length)
    var skip = parseInt(params.start)
    AntibodySearchView.find(query,{}).skip(skip).limit(page_length).exec((err, data)=>{
        return res.status(200).send({
            data: data,
        })
    })
};
module.exports = indexCtrl;