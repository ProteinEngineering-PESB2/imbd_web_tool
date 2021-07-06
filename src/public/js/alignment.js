$("textarea").css("font-family", "monospace")
desactivateSubmit(false)
$("#results").hide()
fillSelects("Antibody")
var matrix = [];
var table_results = $("#table-results").DataTable({
    bInfo: false,
    autoWidth: false,
    order: [[ 2, "desc" ]],
    columns: [
        {width: '20%'},
        {width: '60%'},
        {width: '10%'},
        {width: '10%'},
    ],
    columnDefs: [
        {
            targets: 0,
            render: function ( data ) {
                if(data.length >= 50){
                    let new_data = data.substr(0, 50) + "...";
                    return new_data 
                }
                return data
            },
            orderable: false
        },
        { "className": "dt-center", "targets": [0, 2, 3]},

        { "className": "dt-body-left", "targets": 1 }
    ]
})

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
var slider = $("#ex2").slider({
    range: true,
    step: 1,
    value: [0, 10]
});
//Estilos del slider. 
$(".loader").hide()
$(".tooltip-inner").css("display", "none");
$(".slider-selection").css("background", "#0378B3");
$(".slider-track-low").css("background", "grey");
$(".slider-track-high").css("background", "grey");
$(".slider").css("width", "90%");
//Creación de los select, vacíos de momento.
var pfam_select = $("#pfam_input").select2();
var cc_select = $("#cc_input").select2();
var mf_select = $("#mf_input").select2();
var bp_select = $("#bp_input").select2();

function updateLengths(min, max) {
    slider.slider("setAttribute", "min", min);
    slider.slider("setAttribute", "max", max);
    slider.slider("setAttribute", "value", [min, max]);
    slider.slider("refresh");
    $(".slider").css("width", "90%");
    $("#ex2SliderVal1").text(min)
    $("#ex2SliderVal2").text(max)
}
$("#ex2").on("change", function (slideEvt) {
    $("#ex2SliderVal1").text(slideEvt.value.newValue[0]);
    $("#ex2SliderVal2").text(slideEvt.value.newValue[1]);
});

function fillSelects() {
    let type = $("#typeOfDatabase option:selected").text()
    $.ajax({
        url: window.location.origin + "/getGO/",
        method: 'POST',
        data: {
            "type": type
        }
    }).done(function (data) {
        //Se llama a la función que rellena el slider
        min = data.minLength
        max = data.maxLength
        updateLengths(min, max)
        //Obtener los arrays
        pfam = data.Pfam
        cellular_component = data.Cellular_component
        molecular_function = data.Molecular_function
        biological_process = data.Biological_process
        //Genera unos placeholders de mentira
        pfam.unshift("")
        cellular_component.unshift("")
        molecular_function.unshift("")
        biological_process.unshift("")
        pfam_select.empty().select2({
            data: pfam
        });
        cc_select.empty().select2({
            data: cellular_component
        });
        mf_select.empty().select2({
            data: molecular_function
        });
        bp_select.empty().select2({
            data: biological_process
        });
    })
}
$("#typeOfDatabase").on("change", function () {
    let type = $("#typeOfDatabase option:selected").text()
    fillSelects(type)
})
$("#submit").on("click", function(){
    $(".loader").show()
    $("#results").hide();
    let selected = $("#typeOfDatabase option:selected").text()
    let map_sequence = $("#fasta_query").val()
    query = {}
    query["database"] = selected
    query["map_sequence"] = map_sequence
    query["min"] = $("#ex2SliderVal1").text();
    query["max"] = $("#ex2SliderVal2").text();
    query["pfam"] = pfam_select.select2("data")[0].text;
    query["go_cc"] = cc_select.select2("data")[0].text;
    query["go_mf"] = mf_select.select2("data")[0].text;
    query["go_bp"] = bp_select.select2("data")[0].text;
    $.ajax({
        url: window.location.origin + "/ServiceAlignment",
        method: "POST",
        data: query
    }).done(function (data) {
        fillData(data.align_service)
        $(".loader").hide()
        $('#table-results tbody').on( 'click', 'button', function () {
            let selected = $("#typeOfDatabase option:selected").text();
            let id = $(this).parents('tr').children().html()
            route = "/profile/" + selected + "/" + id;
            console.log(route)
            window.open(route, "_blank")
        } );
    })
})
function fillData(data,) {
    matrix = []
    data.forEach((value, index) => {
        let id_sequence = value.id_sequence
        let align_results = value.response_search
        row = []
        row.push(id_sequence)
        let align = `<span class="align" style='font-family: Courier New, monospace'>`+align_results.input_sequence+'<br>   '+align_results.space_format+'<br>'+align_results.compare_sequence+'</span>'
        row.push(align)
        row.push(align_results.distance_sequences)
        row.push(`<button class='view_profile bg-blue-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline' type='button' id='view_`+index+`'><i class='fas fa-eye'></i></button>`)
        matrix.push(row)
    });
    table_results.clear();
    table_results.rows.add(matrix).draw();
    $("#results").show()
}