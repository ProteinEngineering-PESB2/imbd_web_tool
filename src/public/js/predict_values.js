
$("#results").hide()
var table_results = $("#table-results").DataTable({
    bInfo: false,
    ordering: false,
    autoWidth: false,
    columns:[
        null,
        {width: '60%'},
        null,
        null,
        null
    ],
    columnDefs: [ 
        {
            targets: 1,
            render: function ( data ) {
                let array = data.match(/.{1,80}/g)
                let chain = array.join("\n");
                return `<span class="sequence">`+ chain +`</span>`
            }
        },
        {"className": "dt-center", "targets": [0,2,3,4]},

        {"className": "dt-body-left", "targets": 1}
    ]
})
var table_pfam = $("#table_pfam").DataTable({
    bInfo: false,
    ordering: false,
    searching: false,
    paging: false,
    columnDefs:[
        {"className": "dt-center", "targets": "_all"}
    ]
})
var table_go = $("#table_go").DataTable({
    bInfo: false,
    ordering: false,
    searching: false,
    paging: false,
    columnDefs:[
        {"className": "dt-center", "targets": "_all"}
    ]
})
desactivateSubmit(true)
function desactivateSubmit(newvalue) {
    $("#submit").prop("disabled", newvalue);
    if (newvalue) {
        $("#submit").removeClass("bg-blue-500")
        $("#submit").removeClass("hover:bg-blue-700")
        $("#submit").addClass("bg-gray-400")
    }
    else {
        $("#submit").removeClass("bg-gray-400")
        $("#submit").addClass("bg-blue-500")
        $("#submit").addClass("hover:bg-blue-700")
    }
}
$("#file").on("change", function () {
    let name = $("#file")[0].files[0].name
    let end = name.substring(name.length - 6, name.length)
    if (end != ".fasta") {
        $("#advise").text("This is not a .fasta file")
        $("#advise").show();
        $("#file").val(null);
        $("#fasta").prop("disabled", true);
        desactivateSubmit(true)
    }
    else {
        $("#advise").text(name)
        $("#advise").show();
        $("#fasta").prop("disabled", true);
        desactivateSubmit(false)
    }
    $("#remove_file").removeClass("invisible")
})
$("textarea").keyup(function () {
    if ($(this).val().length >= 1) {
        desactivateSubmit(false)
    }
    else {
        desactivateSubmit(true)
    }
})
$("#remove_file").on("click", function () {
    $("#file").val(null);
    $("#advise").hide();
    $("#remove_file").addClass("invisible")
    if ($("#fasta").val().length == 0) {
        desactivateSubmit(true)
    }
    $("#fasta").prop("disabled", false);
})
$("#submit").on("click", function(){
    desactivateSubmit(true);
    $(".loader").show()
    let pfam = $("#pfam").is(":checked");
    let go = $("#gene_ontology").is(":checked");
    let secondary = $("#secondary_structure").is(":checked");
    let formData = new FormData();
    let name
    if ($("#file")[0].files.length != 0) {
        name = $("#file")[0].files[0].name
        formData.append("file", $("#file")[0].files[0]);
    }
    else{
        name = "input.fasta" 
        let file = new File([$("textarea").val()], "input.fasta", { type: "text/plain" });
        formData.append("file", file)
    }
    $.ajax({
        url: window.location.origin + "/uploadFile",
        method: "POST",
        data: formData,
        dataType: "html",
        contentType: false,
        processData: false
    })
    $.when(go_ajax(name, go), pfam_ajax(name, pfam), secondary_ajax(name, secondary)).done(function(go_res, pfam_res, secondary_res){
        let go_data
        let pfam_data
        let secondary_data
        let pfam_column = table_results.column(2);
        let go_column = table_results.column(3);
        let second_column = table_results.column(4);
        pfam_column.visible(false)
        go_column.visible(false)
        second_column.visible(false)
        if(go_res != null){
            go_data = go_res[0].go_data
            go_column.visible(true)
        }
        if(pfam_res != null){
            pfam_data = pfam_res[0].pfam_predicts_response
            pfam_column.visible(true)
        }
        if(secondary_res != null){
            secondary_data = secondary_res[0].response
            second_column.visible(true)
        }
        fillData(name, go_data, pfam_data, secondary_data);
        $(".loader").hide()
        $("#results").show()
        desactivateSubmit(false)
    })
})
function go_ajax(name, go){
    if(go){
        return $.ajax({
            url: window.location.origin + "/ServiceGeneOntology/" + name,
            method: "GET"
        })
    }
}
function pfam_ajax(name, pfam){
    if(pfam){
        return $.ajax({
            url: window.location.origin + "/ServicePFam/" + name,
            method: "GET"
        })
    }
}
function secondary_ajax(name, secondary){
    if(secondary){
        return $.ajax({
            url: window.location.origin + "/ServiceStructural/" + name,
            method: "GET"
        })
    }
}
function fillData(name, go_data, pfam_data, secondary_data){
    $.ajax({
        url: window.location.origin + "/getFastaInfo/" + name,
        method: "GET"
    }).done(function(res){
        let matrix = []
        res.sequences.forEach((value, index)=>{
            row = []
            row.push(value.id)
            row.push(value.seq)
            row.push(`<button class='view_pfam bg-blue-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline' type='button' id='pfam_`+index+`'><i class='fas fa-eye'></i></button>`)
            row.push(`<button class='view_go bg-red-400 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline' type='button' id='go_`+index+`'><i class='fas fa-eye'></i></button>`)
            row.push(`<button class='view_second bg-green-400 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline' type='button' id='second_`+index+`'><i class='fas fa-eye'></i></button>`)
            matrix.push(row)
        })
        table_results.clear();
        table_results.rows.add(matrix).draw();
        $(".sequence").css("font-family", "'Courier New', monospace");

        $(".view_pfam").on("click", function(){
            let index = $(this).prop("id").split("_")[1];
            parsePfam(pfam_data[index].pfam_predicts)
        })
        $(".view_go").on("click", function(){
            let index = $(this).prop("id").split("_")[1];
            parseGO(go_data[index].go_predictions)
        })
        $(".view_second").on("click", function(){
            let index = $(this).prop("id").split("_")[1];
            let sequence = matrix[index][1];
            parseSecond(secondary_data[index].structural_predict, sequence)
        })
    })
}
function parsePfam(data){
    let matrix = []
    data.forEach((value, index)=>{
        row = []
        row.push(value.Accession)
        row.push(value.Id_accession)
        row.push(value.Type)
        row.push(value.Class)
        row.push(value.Evalue)
        row.push(value.Bitscore)
        matrix.push(row)
    })
    table_pfam.clear();
    table_pfam.rows.add(matrix).draw();
    $("#modal_pfam").modal({
        fadeDuration: 200,
        showClose: false
    });
    $(".modal").css("max-width", "100%")
    $(".modal").css("padding", "0px")
}
function parseGO(data){
    let matrix = []
    let row = []
    row.push("Biological Process")
    row.push(data.Biological_Process_GO)
    row.push(data.Predict_value_BPO)
    matrix.push(row)
    row = []
    row.push("Celular Component")
    row.push(data.Celular_Component_GO)
    row.push(data.Predict_value_CCO)
    matrix.push(row)
    row = []
    row.push("Molecular Function")
    row.push(data.Molecular_Function_GO)
    row.push(data.Predict_value_MFO)
    matrix.push(row)
    table_go.clear();
    table_go.rows.add(matrix).draw();
    $("#modal_go").modal({
        fadeDuration: 200,
        showClose: false
    });
    $(".modal").css("max-width", "100%")
    $(".modal").css("padding", "0px")
}
function parseSecond(data, sequence){
    let dict_ss3 = [{"name": "H", "y": parseInt(data.counts_ss3.H_ss3)}, 
                    {"name": "E", "y": parseInt(data.counts_ss3.E_ss3)},
                    {"name": "C", "y": parseInt(data.counts_ss3.C_ss3)}].filter(element => element.y != 0);
    let dict_diso =[{"name": "Order", "y": parseInt(data.counts_disorder["."])},
                    {"name": "Disorder", "y": parseInt(data.counts_disorder["*"])}].filter(element => element.y != 0);
    let dict_ss8 = [{"name": "H", "y": parseInt(data.counts_ss8.H_ss8)},
                    {"name": "G", "y": parseInt(data.counts_ss8.G_ss8)},
                    {"name": "I", "y": parseInt(data.counts_ss8.I_ss8)},
                    {"name": "E", "y": parseInt(data.counts_ss8.E_ss8)},
                    {"name": "B", "y": parseInt(data.counts_ss8.B_ss8)},
                    {"name": "T", "y": parseInt(data.counts_ss8.T_ss8)},
                    {"name": "S", "y": parseInt(data.counts_ss8.S_ss8)},
                    {"name": "L", "y": parseInt(data.counts_ss8.L_ss8)}].filter(element => element.y != 0);
    let dict_sac = [{"name": "B", "y": parseInt(data.counts_acc.B_acc)},
                    {"name": "M", "y": parseInt(data.counts_acc.M_acc)},
                    {"name": "E", "y": parseInt(data.counts_acc.E_acc)}].filter(element => element.y != 0);
    create_pie(dict_ss3, "ss3_plot", "SS3 Prediction")
    create_pie(dict_diso, "diso_plot", "DISO Prediction")
    create_pie(dict_ss8, "ss8_plot", "SS8 Prediction")
    create_pie(dict_sac, "sac_plot", "SAC Prediction")
    structuralProperties_aligns(data, sequence, 60)
    $("#modal_second").modal({
        fadeDuration: 100,
        showClose: false
    });
    $(".sequence_couple").css("height", "350px");
    $(".sequence_couple").css("overflow-y", "scroll");
    $(".sequence_couple").css("font-family", "'Courier New', monospace");
    $(".sequence_couple").css("font-size", "14px");
    $(".sequence_couple").css("text-align", "left");
    $(".sequence_couple").css("margin-bottom", "40px");
    $(".pie_struct").css("margin-bottom", "40px");
    $(".modal").css("max-width", "100%")
    $(".modal").css("padding", "0px")
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
};
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
};
function sequence_split(sequence, largo){
    sub_sequences = [];
    do{
        sub_sequences.push(sequence.substring(0, largo));
        sequence = sequence.substring(largo, sequence.length);
    } while(sequence.length >= largo);
    sub_sequences.push(sequence);
    return sub_sequences;
};