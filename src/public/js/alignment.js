$("textarea").css("font-family", "monospace")
desactivateSubmit(false)
$("#results").hide()
$("#antibody_form").show()
getLengthTotal()
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
                    let new_data = `${data.substr(0, 50)}...`;
                    return `<span class = "fullname" hidden>${data}</span>
                            <span>${new_data}</span
                    `
                }
                return `<span class = "fullname">${data}</span>`
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
$("#typeOfDatabase").on("change", function () {
    getLengthTotal()
    let type = $("#typeOfDatabase option:selected").text()
    if(type == "Antigen"){
        $("#antigen_form").show()
        $("#antibody_form").hide()
    }
    if(type == "Antibody"){
        $("#antibody_form").show()
        $("#antigen_form").hide()
    }
})
$("#submit").on("click", function(){
    $("#warning").empty()
    $(".loader").show()
    $("#results").hide();
    let selected = $("#typeOfDatabase option:selected").text()
    let map_sequence = $("#fasta_query").val()
    query = {}
    query["database"] = selected
    query["map_sequence"] = map_sequence
    if(selected == "Antibody"){
        query["min"] = $("#antibody_slider_val1").text();
        query["max"] = $("#antibody_slider_val2").text();
        query["pfam"] = $("#pfam_input_antibody").select2("data")[0].text;
        query["go_cc"] = $("#cc_input_antibody").select2("data")[0].text;
        query["go_mf"] = $("#mf_input_antibody").select2("data")[0].text;
        query["go_bp"] = $("#bp_input_antibody").select2("data")[0].text;
        query["chain"] = $("#chain_input").select2("data")[0].text;
        query["has_pdb"] = $("#checkbox_structure_antibody").is(":checked");
        query["pdb_id"] = $("#pdb_input_antibody").select2("data")[0].text;
        query["has_interaction"] = $("#checkbox_relation_antibody").is(":checked");
        query["interaction_id"] = $("#interaction_input_antibody").select2("data")[0].text;
    }
    if(selected == "Antigen"){
        query["min"] = $("#antigen_slider_val1").text();
        query["max"] = $("#antigen_slider_val2").text();
        query["pfam"] = $("#pfam_input_antigen").select2("data")[0].text;
        query["go_cc"] = $("#cc_input_antigen").select2("data")[0].text;
        query["go_mf"] = $("#mf_input_antigen").select2("data")[0].text;
        query["go_bp"] = $("#bp_input_antigen").select2("data")[0].text;
        query["has_pdb"] = $("#checkbox_structure_antigen").is(":checked");
        query["pdb_id"] = $("#pdb_input_antigen").select2("data")[0].text;
        query["has_epitope"] = $("#checkbox_epitope").is(":checked");
        query["has_interaction"] = $("#checkbox_relation_antigen").is(":checked");
        query["interaction_id"] = $("#interaction_input_antigen").select2("data")[0].text;
    }
    $.ajax({
        url: "/ServiceAlignment",
        method: "POST",
        data: query
    }).done(function (data) {
        console.log(data)
        $(".loader").hide()
        if(data.isFasta == "ERR"){
            $("#warning").html(`<span class="text-red-700">ERROR: Query is not in .fasta format.</span>`)
        }
        else if(data.FastaLength == "ERR"){
            $("#warning").html(`<span class="text-red-700">ERROR: Try with only one sequence.</span>`)
        }
        else if(data.length_string_map == "ERR"){
            $("#warning").html(`<span class="text-red-700">ERROR: Sequence length. Try with a sequence between 5 and 50 residues.</span>`)
        }
        else{
            fillData(data.align_service)
        }
        $('#table-results tbody').on( 'click', 'button', function () {
            let selected = $("#typeOfDatabase option:selected").text();
            let id = $(this).parents('tr').children().find(".fullname").html()
            localStorage.setItem("id", id)
            localStorage.setItem("type", selected)
            window.open('profileBase', "_blank")
        })
    })
})
function fillData(data,) {
    matrix = []
    data.forEach((value, index) => {
        let id_sequence = value.id_sequence
        let align_results = value.response_search
        row = []
        row.push(id_sequence)
        let align = `<span class="align" style='font-family: Courier New, monospace'>${align_results.input_sequence}<br> ${align_results.space_format}<br>${align_results.compare_sequence}</span>`
        row.push(align)
        row.push(align_results.distance_sequences)
        row.push(`<button class='view_profile bg-blue-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline' type='button' id='view_${index}'><i class='fas fa-eye'></i></button>`)
        matrix.push(row)
    });
    table_results.clear();
    table_results.rows.add(matrix).draw();
    $("#results").show()
}

$("form").on("change", function () {
    let query = {};
    query["col"] = $("#typeOfDatabase option:selected").text();
    if (query["col"] == "Antibody") {
      query["min"] = $("#antibody_slider_val1").text();
      query["max"] = $("#antibody_slider_val2").text();
      query["pfam"] = $("#pfam_input_antibody").select2("data")[0].text;
      query["go_cc"] = $("#cc_input_antibody").select2("data")[0].text;
      query["go_mf"] = $("#mf_input_antibody").select2("data")[0].text;
      query["go_bp"] = $("#bp_input_antibody").select2("data")[0].text;
      query["chain"] = $("#chain_input").select2("data")[0].text;
      query["has_pdb"] = $("#checkbox_structure_antibody").is(":checked");
      query["pdb_id"] = $("#pdb_input_antibody").select2("data")[0].text;
      query["has_interaction"] = $("#checkbox_relation_antibody").is(":checked");
      query["interaction_id"] = $("#interaction_input_antibody").select2("data")[0].text;
    }
    if (query["col"] == "Antigen") {
      query["min"] = $("#antigen_slider_val1").text();
      query["max"] = $("#antigen_slider_val2").text();
      query["pfam"] = $("#pfam_input_antigen").select2("data")[0].text;
      query["go_cc"] = $("#cc_input_antigen").select2("data")[0].text;
      query["go_mf"] = $("#mf_input_antigen").select2("data")[0].text;
      query["go_bp"] = $("#bp_input_antigen").select2("data")[0].text;
      query["has_pdb"] = $("#checkbox_structure_antigen").is(":checked");
      query["pdb_id"] = $("#pdb_input_antigen").select2("data")[0].text;
      query["has_epitope"] = $("#checkbox_epitope").is(":checked");
      query["has_interaction"] = $("#checkbox_relation_antigen").is(":checked");
      query["interaction_id"] = $("#interaction_input_antigen").select2("data")[0].text;
    }
    $.ajax({
        url: `/getLengthCollectionQuery`,
        method: "POST",
        data: query
    }).done((data)=>{
        if(parseInt(data.count) <= 50){
            $("#count").html(`<span class="text-blue-700">${data.count} elements</span>`)
            desactivateSubmit(false)
        }
        else{
            $("#count").html(`<span class="text-red-700">${data.count} elements</span>`)
            desactivateSubmit(true)
        }
    })
})
function getLengthTotal() {
    $.ajax({
      url: `/getLengthCollection`,
      method: "POST",
      data: {
        col: $("#typeOfDatabase option:selected").text()
      }
    }).done((data)=>{
        if(parseInt(data.count) <= 50){
            $("#count").html(`<span class="text-blue-700">${data.count} elements</span>`)
            desactivateSubmit(false)
        }
        else{
            $("#count").html(`<span class="text-red-700">${data.count} elements</span>`)
            desactivateSubmit(true)
        }
    })
}
