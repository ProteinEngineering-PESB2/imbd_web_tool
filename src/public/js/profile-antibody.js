oneLettertoFull = {
    "A": "ALA", "R": "ARG", "N": "ASP", "D": "ASN",
    "C": "CYS","Q": "GLU", "E": "GLN", "G": "GLY", 
    "H": "HYS", "I": "ILE", "L": "LEU", "K": "LYS", 
    "M": "MET", "F": "PHE", "P": "PRO", "S": "SER",
    "T": "THR", "W": "TRP", "Y": "TYR", "V": "VAL"
}
translate_groups = {
    "carga_negativa": "Negative Charged",
    "carga_positiva": "Positive Charged",
    "aromaticos": "Aromatic",
    "no_polares_alifaticos": "No Polar",
    "polares_sin_carga": "Polar Without Charge"
}
var id = $("h2").text()
$.ajax({
    url: window.location.origin + "/getAntibody/" + id, 
    success: (data) => {
        let antibody_data = data[0];
        statisticValues_pie(antibody_data.statistic_value)
        structuralProperties_pie(antibody_data.structural_value);
        structuralProperties_aligns(antibody_data.structural_value, antibody_data.Sequence, 75)
    },
    complete: (data)=>{
        let antibody_data = data.responseJSON[0];
        if(antibody_data.has_pdb == 1){
            $("#viewer").show()
            let pdb = antibody_data.pdb_id;      
            viewStructure(pdb)
            viewSequences(pdb)
        }
    }
});
function statisticValues_pie(data){
    let label_groups = ["no_polares_alifaticos", "polares_sin_carga", 
                        "aromaticos", "carga_positiva", "carga_negativa"];
    let label_aminoacids = ["A", "R", "N", "D", "C",
                        "Q", "E", "G", "H", "I", 
                        "L", "K", "M", "F", "P", 
                        "S", "T", "W", "Y", "V"];
    let groups = []
    let aminoacids = []
    for(let i = 0; i < label_groups.length; i++){
        let y = data[label_groups[i]]
        if(y != 0){
            groups.push({"name": translate_groups[label_groups[i]], "y": y})
        }
    }
    for(let i = 0; i < label_aminoacids.length; i++){
        let y = data[label_aminoacids[i]];
        if(y != 0){
            aminoacids.push({"name": oneLettertoFull[label_aminoacids[i]], "y": y})
        }
    }
    create_pie(groups, "groups", "Residues count by groups")
    create_pie(aminoacids, "aminoacids", "Residues count")
};
function structuralProperties_pie(data){
    let dict_ss3 = [{"name": "H", "y": parseInt(data.H_ss3)}, 
                    {"name": "E", "y": parseInt(data.E_ss3)},
                    {"name": "C", "y": parseInt(data.C_ss3)}].filter(element => element.y != 0);
    let dict_diso =[{"name": "Order", "y": parseInt(data["."])},
                    {"name": "Disorder", "y": parseInt(data["*"])}].filter(element => element.y != 0);
    let dict_ss8 = [{"name": "H", "y": parseInt(data.H_ss8)},
                    {"name": "G", "y": parseInt(data.G_ss8)},
                    {"name": "I", "y": parseInt(data.I_ss8)},
                    {"name": "E", "y": parseInt(data.E_ss8)},
                    {"name": "B", "y": parseInt(data.B_ss8)},
                    {"name": "T", "y": parseInt(data.T_ss8)},
                    {"name": "S", "y": parseInt(data.S_ss8)},
                    {"name": "L", "y": parseInt(data.L_ss8)}].filter(element => element.y != 0);
    let dict_sac = [{"name": "B", "y": parseInt(data.B_acc)},
                    {"name": "M", "y": parseInt(data.M_acc)},
                    {"name": "E", "y": parseInt(data.E_acc)}].filter(element => element.y != 0);
    create_pie(dict_ss3, "ss3_plot", "SS3 Prediction")
    create_pie(dict_diso, "diso_plot", "DISO Prediction")
    create_pie(dict_ss8, "ss8_plot", "SS8 Prediction")
    create_pie(dict_sac, "sac_plot", "SAC Prediction")
};
function create_pie(data, id, title){
    // Build the chart
    Highcharts.chart(id, {
        chart: {
            plotBackgroundColor: null,
            plotShadow: false,
            width: 500,
            height: 350,
            type: 'pie',
        },
        title: {
            text: title
        },
        tooltip: {
            pointFormat: '<b>{point.percentage:.1f}%</b>'
        },
        accessibility: {
            point: {
                valueSuffix: '%'
            }
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.y}',
                    connectorColor: 'blue'
                }
            }
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'Share',
            data: data
        }]
    });
};
function structuralProperties_aligns(data, sequence, len){
    view_alignment(data.ss3_properties, sequence, "#ss3_sequence", "SS3", len);
    view_alignment(data.diso_properties, sequence, "#diso_sequence", "DIS", len);
    view_alignment(data.ss8_properties, sequence, "#ss8_sequence", "SS8", len);
    view_alignment(data.sac_properties, sequence, "#sac_sequence", "SAC", len);
}
function view_alignment(properties, sequence, id, pred_software, len){
    let sequence_list = sequence_split(sequence, len)
    let properties_list = sequence_split(properties, len)
    sequence_list.forEach((element, index) => {
        $(id).append("<p><span>Seq:</span>"+element+"</p>")
        $(id).append("<p><span>"+pred_software+":</span>"+properties_list[index]+"</p>")
        $(id).append("<br>")
    });
    if(sequence_list.length > 3){
        $(id).css("overflow-y", "scroll")
    }
}
function sequence_split(sequence, largo){
    sub_sequences = [];
    do{
        sub_sequences.push(sequence.substring(0, largo));
        sequence = sequence.substring(largo, sequence.length);
    } while(sequence.length >= largo);
    sub_sequences.push(sequence);
    return sub_sequences;
}
function viewStructure(pdb){
    var element = $('#molecule');
    var config = { backgroundColor: 'white' };//#83C576
    var viewer = $3Dmol.createViewer(element, config);
    var pdbUri = '/Structures/' + pdb + '.pdb';
    $.ajax(pdbUri, {
        success: function (data) {
            let v = viewer;
            v.addModel(data, "pdb");
            v.setStyle({}, { cartoon: { colorscheme: 'chain' } });
            v.zoomTo();
            v.render();
            v.zoom(1.1, 2000);
        },
        error: function (hdr, status, err) {
            console.error("Failed to load PDB " + pdbUri + ": " + err);
        }
    });
}
function viewSequences(pdb){
    $.ajax({
        url: window.location.origin + "/getSequence/" + pdb,
        success: (data) =>{
            for (let i = 0; i < data.length; i++) {
                if(data[i].sequence.length > 0){
                    $("#chains").append("<p>Chain "+data[i].chain+":<br>" + data[i].sequence+"</p><br>")
                }
            }
        }
    })
}