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
desactivateSubmit(true)
$("#antigen_form").hide()
$("#antibody_form").hide()
$("#epitope_form").hide()
$('#results-antibody').hide()
$('#results-antigen').hide()
$('#results-epitope').hide()
$('#results').hide()
var lengthTotal = 0;
var lengthQuery = 0;
$("#typeOfDatabase").on("change", function () {
  $("#results").hide()
  if (parseInt($("#typeOfDatabase option:selected").val()) == 0) {
    $("#Form").hide()
    desactivateSubmit(true)
  }
  else {
    $.ajax({
      url: `${window.location.origin}/getLengthCollection`,
      method: "POST",
      data: {
        col: $("#typeOfDatabase option:selected").text()
      }
    }).done(function (data) {
      lengthTotal = data.count
      if ($("#typeOfDatabase option:selected").text() == "Antibody") {
        $("#Form").show()
        $('#results-antibody').show()
        $('#results-antigen').hide()
        $('#results-epitope').hide()
        $("#antigen_form").hide()
        $("#antibody_form").show()
        $("#epitope_form").hide()
      }
      if ($("#typeOfDatabase option:selected").text() == "Antigen") {
        $("#Form").show()
        $('#results-antibody').hide()
        $('#results-antigen').show()
        $('#results-epitope').hide()
        $("#antigen_form").show()
        $("#antibody_form").hide()
        $("#epitope_form").hide()
      }
      if ($("#typeOfDatabase option:selected").text() == "Epitope") {
        $("#Form").show()
        $('#results-antibody').hide()
        $('#results-antigen').hide()
        $('#results-epitope').show()
        $("#antigen_form").hide()
        $("#antibody_form").hide()
        $("#epitope_form").show()
      }
      desactivateSubmit(false)
    })
  }
});
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
  if (query["col"] == "Epitope") {
    query["min"] = $("#epitope_slider_val1").text();
    query["max"] = $("#epitope_slider_val2").text();
    query["has_antigen"] = $("#checkbox_has_antigen").is(":checked");
    query["antigen_id"] = $("#antigen_input").select2("data")[0].text
    query["type_molecule"] = $("#type_input").select2("data")[0].text
  }
  $.ajax({
    url: `/getLengthCollectionQuery`,
    method: "POST",
    data: query
  }).done(function (data) {
    lengthQuery = data.count
  })
})

function getLengthTotal() {
  return $.ajax({
    url: `/getLengthCollection`,
    method: "POST",
    data: {
      col: $("#typeOfDatabase option:selected").text()
    }
  })
}
function getLengthQuery() {
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
  if (query["col"] == "Epitope") {
    query["min"] = $("#epitope_slider_val1").text();
    query["max"] = $("#epitope_slider_val2").text();
    query["has_antigen"] = $("#checkbox_has_antigen").is(":checked");
    query["antigen_id"] = $("#antigen_input").select2("data")[0].text
    query["type_molecule"] = $("#type_input").select2("data")[0].text
  }
  return $.ajax({
    url: `/getLengthCollectionQuery`,
    method: "POST",
    data: query
  })
}

var table_epitope = $('#results-table-epitope').DataTable({
  autoWidth: false,
  serverSide: true,
  searching: false,
  processing: true,
/*   processing: true,
 */  ajax: {
    url: `${window.location.origin}/SearchEpitope`,
    method: 'POST',
    data: function (query) {
      query["min"] = $("#epitope_slider_val1").text();
      query["max"] = $("#epitope_slider_val2").text();
      query["has_antigen"] = $("#checkbox_has_antigen").is(":checked");
      query["antigen_id"] = $("#antigen_input").select2("data")[0].text;
      query["type_molecule"] = $("#type_input").select2("data")[0].text;},
    dataSrc: function (response) {
      response.recordsTotal = lengthTotal
      response.recordsFiltered = lengthQuery
      return response.data
    }
  },
  columns: [
    { "data": "id_sequence", "width": "50%" },
    { "data": "Length", "width": "5%" },
    { "data": "Type", "width": "5%" },
    {
      "data": null,
      "defaultContent": `<button class='details w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline' type = 'button'>
      <i class='fas fa-eye'></i></button>`,
      "width": "5%"
    }
  ],
  columnDefs: [
    { orderable: false, targets: [0, 2, 3] }
  ],
});
var table_antibody = $('#results-table-antibody').DataTable({
  autoWidth: false,
  serverSide: true,
  searching: false,
  processing: true,
/*   processing: true,
 */  ajax: {
    url: `${window.location.origin}/SearchAntibody`,
    method: 'POST',
    data: function (query) {
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
    },
    dataSrc: function (response) {
      response.recordsTotal = lengthTotal
      response.recordsFiltered = lengthQuery
      return response.data
    }
  },
  columns: [
    { "data": "id_sequence", "width": "30%" },
    { "data": "Length", "width": "5%" },
    {
      "data": "GO_Celular_Component",
      "defaultContent": "",
      "width": "15%"
    },
    {
      "data": "GO_Molecular_Function",
      "defaultContent": "",
      "width": "15%"
    },
    {
      "data": "GO_Biological_Process",
      "defaultContent": "",
      "width": "15%"
    },
    {
      "data": "Type",
      "defaultContent": "",
      "width": "5%"
    },
    {
      "data": null,
      "defaultContent": `<button class='details w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline' type = 'button'>
      <i class='fas fa-eye'></i></button>`,
      "width": "5%"
    }
  ],
  columnDefs: [
    { orderable: false, targets: [0, 2, 3, 4, 5, 6] }
  ],
});
var table_antigen = $('#results-table-antigen').DataTable({
  autoWidth: false,
  serverSide: true,
  searching: false,
  processing: true,
  //processing: true,
  ajax: {
    url: `/SearchAntigen`,
    method: 'POST',
    data: function (query) {
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
    },
    dataSrc: function (response) {
      response.recordsTotal = lengthTotal
      response.recordsFiltered = lengthQuery
      return response.data
    }
  },
  columns: [
    { "data": "id_sequence", "width": "30%" },
    { "data": "Length", "width": "5%" },
    {
      "data": "GO_Celular_Component",
      "defaultContent": "",
      "width": "15%"
    },
    {
      "data": "GO_Molecular_Function",
      "defaultContent": "",
      "width": "15%"
    },
    {
      "data": "GO_Biological_Process",
      "defaultContent": "",
      "width": "15%"
    },
    {
      "data": null,
      "defaultContent": `<button class='details w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline' type = 'button'>
      <i class='fas fa-eye'></i></button>`,
      "width": "5%"
    }
  ],
  columnDefs: [
    { orderable: false, targets: [0, 2, 3, 4, 5] }
  ],
});
$("#submit").on("click", function () {
  if (parseInt($("#typeOfDatabase option:selected").val()) != 0) {
    $("#results").show();
    let query = {}
    query["type"] = $("#typeOfDatabase option:selected").text();
    if (query["type"] == "Antibody") {
      table_antibody.ajax.reload()
    }
    if (query["type"] == "Antigen") {
      table_antigen.ajax.reload()
    }
    if (query["type"] == "Epitope") {
      table_epitope.ajax.reload()
    }
  }
})
dbs = ["Antibody", "Antigen", "Epitope"]
dbs.forEach(function (d) {
  $(`#results-table-${d.toLowerCase()} tbody`).on('click', 'button', function () {
    let id = $(this).parents('tr').children().html()
    localStorage.setItem("id", id)
    localStorage.setItem("type", d)
    window.open('profileBase', "_blank")
  });
})
