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
var id = $("#sequence_id").text().split(' ').join('').replace(/\n/g, '')
$.ajax({
    url: `/getAntigen/${id}`, 
    success: (data) => {
        let antibody_data = data[0];
        statisticValues_pie(antibody_data.statistic_value)
        structuralProperties_pie(antibody_data.structural_value);
        structuralProperties_aligns(antibody_data.structural_value, antibody_data.Sequence, 60)
    },
    complete: (data)=>{
        let antibody_data = data.responseJSON[0];
        if(antibody_data.has_pdb == 1){
            $("#viewer").show()
            let pdb = antibody_data.pdb_id;
            viewStructure(pdb)
            viewSequences(pdb)
        }
        else{
            $("#container-molecule").css("display", "none")
        }
    }
});
$("#table_phy").DataTable({
    responsive: true,
    paging: false,
    ordering: false,
    info: false,
    searching: false
})
$("#table_go").DataTable({
    responsive: true,
    paging: false,
    ordering: false,
    info: false,
    searching: false
})
$("#table_pfam").DataTable({
    responsive: true,
    paging: false,
    ordering: false,
    info: false,
    searching: false
})
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
    let dict_diso =[{"name": "Order", "y": parseInt(data.aa_order)},
                    {"name": "Disorder", "y": parseInt(data.aa_disorder)}].filter(element => element.y != 0);
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
    var pdbUri = `/Structures/${pdb}.pdb`;
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
            console.error(`Failed to load PDB ${pdbUri}: ${err}`);
            $("#container-molecule").css("display", "none");
        }
    });
}
function viewSequences(pdb){
    $.ajax({
        url: "/getSequence/" + pdb,
        success: (data) =>{
            for (let i = 0; i < data.length; i++) {
                if(data[i].sequence.length > 0){
                    $("#chains").append(`<p>Chain ${data[i].chain}:<br>${data[i].sequence}</p><br>`)
                }
            }
        }
    })
}

var table_results = $('#table-results').DataTable({
    paging: false,
    searching: false,
    bInfo: false,
    ordering: false,
});

function parseResponse(res) {
    data = []
    res.forEach((row) => {
        row_cords = {
            "member_1": { "position": { "x": parseFloat(row.x_pos_1), "y": parseFloat(row.y_pos_1), "z": parseFloat(row.z_pos_1) }, "chain": row["chain-1"], "pos": parseInt(row["pos-1"]), "res": row["resdiue-1"] },
            "member_2": { "position": { "x": parseFloat(row.x_pos_2), "y": parseFloat(row.y_pos_2), "z": parseFloat(row.z_pos_2) }, "chain": row["chain-2"], "pos": parseInt(row["pos-2"]), "res": row["resdiue-2"] },
            "interaction": { "position": { "x": (parseFloat(row.x_pos_1) + parseFloat(row.x_pos_2)) / 2, "y": (parseFloat(row.y_pos_1) + parseFloat(row.y_pos_2)) / 2, "z": (parseFloat(row.z_pos_1) + parseFloat(row.z_pos_2)) / 2 }, "value": parseFloat(row.value_energy).toPrecision(3) }
        }
        data.push(row_cords)
    })
    return data
}
$.ajax({
    url: "/getRelations",
    method: "POST",
    data: { id: id, db: "Antigen" }
}).done(function (data) {
    data = data.data
    if(data.length > 0){
        $("#interactions").show()
        data.forEach(function (value, index) {
            $("#interactions").append(`
            <h3 class="title_interaction flex-1 flex flex-col w-full text-center">${value.id_antibody} - ${value.id_antigen}<i class="ref_antibody fas fa-external-link-square-alt cursor-pointer" id="${value.id_antibody}"></i><br>(${value.pdb_file}.pdb)</h3>
            <div class="w-1/2 float-left">
                <div class="bg-white rounded-lg shadow-lg overflow-hidden flex-1 flex flex-col">
                    <div class="p-4 flex-1 flex flex-col text-center">
                        <div class="mb-4 text-grey-darker flex-1">
                        <table id="table_${index}">
                            <thead>
                                <th>Chain 1</th>
                                <th>Pos 1</th>
                                <th>Res 1</th>
                                <th>Chain 2</th>
                                <th>Pos 2</th>
                                <th>Res 2</th>
                                <th>Value</th>                            
                                <th>View</th>
                            </thead>
                            <tbody></tbody>
                        </table>
                        </div>
                    </div>
                </div>
            </div>
            <div id="molecule-${index}" class="mol-container w-1/2 float-right"></div>`)
            response = parseResponse(value.interactions_predicted)
            table = $(`#table_${index}`).DataTable({
                paging: false,
                searching: false,
                bInfo: false,
                ordering: false,
                scrollY: "400px",
                "columnDefs": [
                    {"className": "dt-center", "targets": "_all"}
                ]
            })
            display_results(response, table)
            element = $(`#molecule-${index}`)
            render_structure(`../Structures/${value.pdb_file.toLowerCase()}.pdb`, response, element)
        })
        $(".ref_antibody").click(function(){
            let id_antibody = $(this).prop("id")
            localStorage.setItem("id", id_antibody)
            localStorage.setItem("type", "Antibody")
            window.open('profileBase', "_blank")
        })
    }
})

function display_results(data, element) {
    let matriz = [];
    data.forEach((row) => {
        let arr = [];
        arr.push(row.member_1.chain);
        arr.push(row.member_1.pos);
        arr.push(row.member_1.res);
        arr.push(row.member_2.chain);
        arr.push(row.member_2.pos);
        arr.push(row.member_2.res);
        arr.push(row.interaction.value);
        arr.push(`<button class='details w-3/4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 rounded focus:outline-none focus:shadow-outline' type = 'button'>
        <i class='fas fa-eye'></i></button>`)
        matriz.push(arr);
    });
    element.clear()
    element.rows.add(matriz).draw()
    element.columns.adjust().draw()
}
function render_structure(pdbUri, res, element) {
    var config = { backgroundColor: 'white' };//#83C576
    var viewer = $3Dmol.createViewer(element, config);
    $.ajax(pdbUri, {
        success: function (molecule) {
            let v = viewer;
            v.addModel(molecule, "pdb");
            v.setStyle({}, { cartoon: { colorscheme: 'chain' } });
            addLinesLabels(res, v);
            v.zoomTo();
            v.render();
            v.zoom(1.2, 2000);
        },
        error: function (hdr, status, err) {
            console.error("Failed to load PDB " + pdbUri + ": " + err);
        }
    });
}
function addLinesLabels(data, viewer) {
    data.forEach((x) => {
            viewer.addLabel(`${x.member_1.chain}-${x.member_1.res}-${x.member_1.pos}`, { position: x.member_1.position })
            viewer.addLabel(`${x.member_2.chain}-${x.member_2.res}-${x.member_2.pos}`, { position: x.member_2.position })
            viewer.addLabel(x.interaction.value, { position: x.interaction.position })
            viewer.addLine({ linewidth: 10, color: 'black', start: x.member_1.position, end: x.member_2.position })
    })
}
