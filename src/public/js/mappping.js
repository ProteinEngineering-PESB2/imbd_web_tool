$("textarea").css("font-family", "monospace")
desactivateSubmit(true)
$("#results").hide()
var table_results = $("#table-results").DataTable({
    bInfo: false,
    autoWidth: false,
    columns: [
        null,
        { width: '60%' },
        null,
    ],
    columnDefs: [
        {
            targets: 1,
            render: function (data) {
                return `<span class="sequence">` + data + `</span>`
            }
        },
        { "className": "dt-center", "targets": [0, 2] },

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

$("#file").on("change", function () {
    let name = $("#file")[0].files[0].name
    let end = name.substring(name.length - 6, name.length)
    if (end != ".fasta") {
        $("#advise").text("This is not a .fasta file")
        $("#advise").show();
        $("#file").val(null);
        $("#fasta").prop("disabled", true);
    }
    else {
        $("#advise").text(name)
        $("#advise").show();
        $("#fasta").prop("disabled", true);
    }
    $("#remove_file").removeClass("invisible")
})
$("#remove_file").on("click", function () {
    $("#file").val(null);
    $("#advise").hide();
    $("#remove_file").addClass("invisible")
    if ($("#fasta").val().length == 0) {
    }
    $("#fasta").prop("disabled", false);
})
$("form").on("change", function () {
    let type_database = $("#typeOfDatabase option:selected").text()
    let fasta_query = $("#fasta_query").val()
    let fasta_db = $("#fasta_db").val()
    let filename
    try {
        filename = $("#file")[0].files[0].name
    }
    catch {
        filename = ""
    }
    let end = filename.substring(filename.length - 6, filename.length)
    if (type_database == "Antigen database") {
        if(fasta_query != ""){
            desactivateSubmit(false)
        }
        else{
            desactivateSubmit(true)
        }
    }
    if (type_database == "Fasta") {
        if (fasta_query != "" && (fasta_db != "" || (end == ".fasta" && end != ""))) {
            desactivateSubmit(false)
        }
        else {
            desactivateSubmit(true)
        }
    }
})
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
    $.ajax({
        url: window.location.origin + "/getGO/",
        method: 'POST',
        data: {
            "type": "Antigen"
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
fillSelects("Antigen")
$("#typeOfDatabase").on("change", function () {
    $("#filters").hide()
    $("#fasta_input").hide()
    selected = $("#typeOfDatabase option:selected").text()
    if (selected == "Antigen database") {
        $("#filters").show()
    }
    else {
        $("#fasta_input").show()
    }
})
$("#submit").on("click", function () {
    let selected = $("#typeOfDatabase option:selected").text()
    map_sequence = $("#fasta_query").val()
    if (selected == "Antigen database") {
        $(".loader").show()
        $("#results").hide();
        query = {}
        query["map_sequence"] = map_sequence
        query["min"] = $("#ex2SliderVal1").text();
        query["max"] = $("#ex2SliderVal2").text();
        query["pfam"] = pfam_select.select2("data")[0].text;
        query["go_cc"] = cc_select.select2("data")[0].text;
        query["go_mf"] = mf_select.select2("data")[0].text;
        query["go_bp"] = bp_select.select2("data")[0].text;
        console.log(query)
        $.ajax({
            url: window.location.origin + "/ServiceMappingFilters",
            method: "POST",
            data: query
        }).done(function (data) {
            console.log(data)
            fillData(data.mapping_service, map_sequence)
            $(".loader").hide()
        })
    }
    if (selected == "Fasta") {
        $(".loader").show()
        $("#results").hide();
        let formData = new FormData();
        let name
        if ($("#file")[0].files.length != 0) {
            name = $("#file")[0].files[0].name
            formData.append("file", $("#file")[0].files[0]);
        }
        else {
            name = "input.fasta"
            let file = new File([$("#fasta_db").val()], "input.fasta", { type: "text/plain" });
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
            url: window.location.origin + "/ServiceMappingFasta/" + name,
            method: "POST",
            data: { "file": name, "map_sequence": map_sequence }
        }).done((data) => {
            console.log(data)
            fillData(data.mapping_service, map_sequence)
            $(".loader").hide()
        })
    }
});
function fillData(data, map_sequence) {
    length_sequence = map_sequence.length
    let matrix = []
    data.forEach(value => {
        let sequence = value.Sequence
        row = []
        row.push(value.id_sequence)
        let array = sequence.match(/.{1,80}/g)
        let chain = array.join("\n");
        if (value.response_search != "ERR") {
            let positions = value.response_search.positions
            positions.forEach((val, index) => {
                let inicio = val;
                let final = val + length_sequence;
                for (let i = 0; i < inicio; i++) {
                    if (chain[i] == "\n") {
                        inicio++
                    }
                    if (chain[i] == "=") {
                        inicio = inicio + 34
                    }
                }
                for (let i = 0; i < final; i++) {
                    if (chain[i] == "\n") {
                        final++
                    }
                    if (chain[i] == "=") {
                        final = final + 34
                    }
                }
                let part_1 = chain.substring(0, inicio)
                let part_2 = chain.substring(inicio, final)
                let part_3 = chain.substring(final)
                chain = part_1 + `<span class="bg-green-500">` + part_2 + `</span>` + part_3
            })
            row.push(chain)
            row.push(`<i class="text-green-500 fas fa-check"></i>`)
        }
        else {
            row.push(chain)
            row.push(`<i class="text-red-500 fas fa-times"></i>`)
        }
        matrix.push(row)
    });
    table_results.clear();
    table_results.rows.add(matrix).draw();
    $(".sequence").css("font-family", "'Courier New', monospace");
    $("#results").show()
}