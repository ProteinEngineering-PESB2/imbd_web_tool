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
        {"className": "dt-center", "targets": [0,2,3]},

        {"className": "dt-body-left", "targets": 1}
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
    $.ajax({
        url: window.location.origin + "/ServiceStatistical/" + name,
        method: "GET"
    }).done((data)=>{
        fillData(data, name)
    })
});

function fillData(data, name){
    $.ajax({
        url: window.location.origin + "/getFastaInfo/" + name,
        method: "GET"
    }).done(function(res){
        let matrix = []
        res.sequences.forEach((value, index)=>{
            row = []
            row.push(value.id)
            row.push(value.seq)
            row.push(`<button class='view_res bg-blue-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline' type='button' id='res_`+index+`'><i class='fas fa-eye'></i></button>`)
            row.push(`<button class='view_group bg-red-400 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline' type='button' id='group_`+index+`'><i class='fas fa-eye'></i></button>`)
            matrix.push(row)
        })
        table_results.clear();
        table_results.rows.add(matrix).draw();
        $(".sequence").css("font-family", "'Courier New', monospace");
        $(".view_res").on("click", function(){
            let index = $(this).prop("id").split("_")[1];
            parseColumns(data.statistical_process[index].canonical_residues, "Residues")
            $("#modal").modal({
                fadeDuration: 200,
                showClose: false
            });
            $(".modal").css("max-width", "60%")
            $(".modal").css("padding", "0px")
        })
        $(".view_group").on("click", function(){
            let index = $(this).prop("id").split("_")[1];
            parseColumns(data.statistical_process[index].group_residues, "Groups")
            $("#modal").modal({
                fadeDuration: 200,
                showClose: false
            });
            $(".modal").css("max-width", "60%")
            $(".modal").css("padding", "0px")
        })
        Error_Graph(data.statistical_summary.statistic_residues, "res_bar", "Residue")
        Error_Graph(data.statistical_summary.statistic_groups, "group_bar", "Groups")
        $("#results").show()
        $(".loader").hide()
    })
}
function parseColumns(data, type){
    oneLettertoFull = {
        "A": "ALA", "R": "ARG", "N": "ASP", "D": "ASN",
        "C": "CYS", "Q": "GLU", "E": "GLN", "G": "GLY", 
        "H": "HYS", "I": "ILE", "L": "LEU", "K": "LYS", 
        "M": "MET", "F": "PHE", "P": "PRO", "S": "SER",
        "T": "THR", "W": "TRP", "Y": "TYR", "V": "VAL"
    }
    let xAxis;
    if(type == "Residues"){
        xAxis = Object.keys(data).map(function(x){return oneLettertoFull[x]})
    }
    if(type == "Groups"){
        xAxis = Object.keys(data)
    }
    Highcharts.chart("modal_bar", {
        chart: {
            type: 'column',
            margin: 30,
        },    
        legend: {
            enabled: false
        },
        title: {
            text: type + "Frecuency"
        },
        tooltip: {
			formatter: function() {
				return '' + this.series.name + ': ' + this.y.toPrecision(3) + '%';
        		}
      	},
        xAxis: [{
            categories: xAxis
        }],
        series: [{
            name: "Frecuency",
            data: Object.values(data)
        }],
        credits: {
            enabled: false
        },
    })
}
function Error_Graph(data, id, type){
    oneLettertoFull = {
        "A": "ALA", "R": "ARG", "N": "ASP", "D": "ASN",
        "C": "CYS", "Q": "GLU", "E": "GLN", "G": "GLY", 
        "H": "HYS", "I": "ILE", "L": "LEU", "K": "LYS", 
        "M": "MET", "F": "PHE", "P": "PRO", "S": "SER",
        "T": "THR", "W": "TRP", "Y": "TYR", "V": "VAL"
    }
    let error = []
    data.mean_values.forEach((value, index)=>{
        let a = value - data.std_values[index]
        let b = value + data.std_values[index]
        error.push([a,b])
    })
    Highcharts.chart(id, {
        chart: {
          margin: 30
        },
        legend: {
            enabled: false
        },
        title: {
          text: type + ' Summary'
        },
        xAxis: [{
          categories: data.array_keys
        }],
        series: [{
          name: 'Mean',
          type: 'column',
          data: data.mean_values
        }, {
          name: 'Error',
          type: 'errorbar',
          data: error
        }],
        credits:{
            enabled: false
        }
    });
}