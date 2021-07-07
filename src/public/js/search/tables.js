$("#antigen_form").hide()
$("#antibody_form").hide()
$("#epitope_form").hide()
$('#results-antibody').hide()
$('#results-antigen').hide()
$('#results-epitope').hide()
$('#results').hide()
/* 
//Va a buscar la data solicitada
/*$("#submit").on("click", function(){
  $(".loader").show()
  $("#results").hide();
  query = {}
  query["type"] = $("#typeOfDatabase option:selected").text();
  query["min"] = $("#ex2SliderVal1").text();
  query["max"] = $("#ex2SliderVal2").text();
  if(query["type"] == "Antibody"){
    query["pfam"] = pfam_select.select2("data")[0].text;
    query["go_cc"] = cc_select.select2("data")[0].text;
    query["go_mf"] = mf_select.select2("data")[0].text;
    query["go_bp"] = bp_select.select2("data")[0].text;
    query["chain"] = chain_select.select2("data")[0].text;
    query["has_pdb"] = $("#checkbox_structure").is(":checked");
    query["pdb_id"] = pdb_select.select2("data")[0].text;
    query["has_interaction"] = $("#checkbox_relation").is(":checked");
    query["interaction_id"] = interaction_select.select2("data")[0].text;
  }
  if(query["type"] == "Antigen"){
    query["pfam"] = pfam_select.select2("data")[0].text;
    query["go_cc"] = cc_select.select2("data")[0].text;
    query["go_mf"] = mf_select.select2("data")[0].text;
    query["go_bp"] = bp_select.select2("data")[0].text;
    query["has_pdb"] = $("#checkbox_structure").is(":checked");
    query["pdb_id"] = pdb_select.select2("data")[0].text;
    query["has_epitope"] = $("#checkbox_epitope").is(":checked"),
    query["has_interaction"] = $("#checkbox_relation").is(":checked");
    query["interaction_id"] = interaction_select.select2("data")[0].text;
  }
  if(query["type"] == "Epitope"){
    query["has_antigen"] = $("#checkbox_has_antigen").is(":checked"),
    query["antigen_id"] = antigen_select.select2("data")[0].text
    query["type_molecule"] = type_select.select2("data")[0].text
    $('#results-table').DataTable( {
      serverSide: true,
      searching: false,
      processing: true,
      ajax: {
          url: window.location.origin + '/testDatatable',
          method: 'POST',
          data: query
      },
      columns: [
          { "data": "id_sequence" },
          { "data": "Length" },
      ]
    });
    $(".loader").hide();
    $("#results").show();
    window.scrollTo(0,document.body.scrollHeight);
  } */
/* 
$.ajax({
    url: window.location.origin + "/getSearch",
    method: "POST",
    data: query
}).done(function(data){
    selected = $("#typeOfDatabase option:selected").text();
    results_table.clear()
    results_table.rows.add(data).draw()
    let cc_go = results_table.column(2);
    let bp_go = results_table.column(3);
    let mf_go = results_table.column(4);
    let chain = results_table.column(5);
    let type = results_table.column(6);
    let details = results_table.column(7);
    if(selected == "Antigen"){
      chain.visible(false)
      type.visible(false)
    }
    if(selected == "Antibody"){
      chain.visible(true)
      type.visible(false)
    }
    if(selected == "Epitope"){
    } */


//})

/* $('#results-table tbody').on( 'click', 'button', function () {
  let selected = $("#typeOfDatabase option:selected").text();
  let id = $(this).parents('tr').children().html()
  route = "/profile/" + selected + "/" + id;
  console.log(route)
  window.open(route, "_blank")
} );
*/
var lengthTotal = 0;
var lengthQuery = 0;
$("#typeOfDatabase").on("change", function () {
  $.when(getLengthTotal(), getLengthQuery()).done(function (length_total, length_query) {
    lengthTotal = length_total[0].count
    lengthQuery = length_query[0].count
    if ($("#typeOfDatabase option:selected").text() == "Antibody") {
      $('#results-antibody').show()
      $('#results-antigen').hide()
      $('#results-epitope').hide()
      $("#antigen_form").hide()
      $("#antibody_form").show()
      $("#epitope_form").hide()
      table_antibody.ajax.reload()
    }
    if ($("#typeOfDatabase option:selected").text() == "Antigen") {
      $('#results-antibody').hide()
      $('#results-antigen').show()
      $('#results-epitope').hide()
      $("#antigen_form").show()
      $("#antibody_form").hide()
      $("#epitope_form").hide()
      table_antigen.ajax.reload()
    }
    if ($("#typeOfDatabase option:selected").text() == "Epitope") {
      $('#results-antibody').hide()
      $('#results-antigen').hide()
      $('#results-epitope').show()
      $("#antigen_form").hide()
      $("#antibody_form").hide()
      $("#epitope_form").show()
      table_epitope.ajax.reload()
    }
  })
});
function getLengthTotal() {
  return $.ajax({
    url: `${window.location.origin}/getLengthCollection`,
    method: "POST",
    data: {
      col: $("#typeOfDatabase option:selected").text()
    }
  })
}
function getLengthQuery() {
  let query = {};
  query["col"] = $("#typeOfDatabase option:selected").text();
  if(query["col"] == "Antibody"){
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
  if(query["col"] == "Antigen"){
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
  if(query["col"] =="Epitope"){
    query["min"] = $("#epitope_slider_val1").text();
    query["max"] = $("#epitope_slider_val2").text();
    query["has_antigen"] = $("#checkbox_has_antigen").is(":checked");
    query["antigen_id"] = $("#antigen_input").select2("data")[0].text
    query["type_molecule"] = $("#type_input").select2("data")[0].text
  }
  return $.ajax({
    url: `${window.location.origin}/getLengthCollectionQuery`,
    method: "POST",
    data: query
  })
}

var table_epitope = $('#results-table-epitope').DataTable({
  autoWidth: false,
  serverSide: true,
  searching: false,
  processing: true,
  ajax: {
    url: `${window.location.origin}/SearchEpitope`,
    method: 'POST',
    data: function (query) {
      query["min"] = $("#epitope_slider_val1").text();
      query["max"] = $("#epitope_slider_val2").text();
      query["has_antigen"] = $("#checkbox_has_antigen").is(":checked");
      query["antigen_id"] = $("#antigen_input").select2("data")[0].text;
      query["type_molecule"] = $("#type_input").select2("data")[0].text;
    },
    dataSrc: function (response) {
      response.recordsTotal = lengthQuery
      response.recordsFiltered = lengthQuery
      return response.data
    }
  },
  columns: [
    { "data": "id_sequence", "width": "30%" },
    { "data": "Length", "width": "5%" },
    {
      "data": null,
      "defaultContent": `<button class='details w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline' type = 'button'>
      <i class='fas fa-eye'></i></button>`,
      "width": "5%"
    }
  ]
});
var table_antibody = $('#results-table-antibody').DataTable({
  autoWidth: false,
  serverSide: true,
  searching: false,
  processing: true,
  ajax: {
    url: `${window.location.origin}/SearchAntibody`,
    method: 'POST',
    data: function(query){
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
      response.recordsTotal = lengthQuery
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
});
var table_antigen = $('#results-table-antigen').DataTable({
  autoWidth: false,
  serverSide: true,
  searching: false,
  processing: true,
  ajax: {
    url: `${window.location.origin}/SearchAntigen`,
    method: 'POST',
    data: function(query){
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
      response.recordsTotal = lengthQuery
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
  ]
});
$("#submit").on("click", function () {
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
})