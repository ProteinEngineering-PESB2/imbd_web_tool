$("#antigen_form").hide()
$("#antibody_form").hide()
$("#epitope_form").hide()
$('#results-antibody').hide()
$('#results-antigen').hide()
$('#results-epitope').hide()
/* Se rellenan los sliders. */
dbs = ["Antibody", "Antigen", "Epitope"]
dbs.forEach(function (value) {
  $(`#${value.toLowerCase()}_slider_input`).slider({
    range: true,
    step: 1,
  })
  $(".slider").css("width", "90%");
  $.ajax({
    url: `${window.location.origin}/getGO/`,
    method: 'POST',
    data: {
      "type": value
    }
  }).done((data) => {
    min = data.minLength
    max = data.maxLength
    value = value.toLowerCase()
    $(`#${value}_slider_input`).slider("setAttribute", "min", min);
    $(`#${value}_slider_input`).slider("setAttribute", "max", max);
    $(`#${value}_slider_input`).slider("setAttribute", "value", [min, max]);
    $(`#${value}_slider_val1`).text(min)
    $(`#${value}_slider_val2`).text(max)
    $(`#${value}_slider_input`).on("change", function (slideEvt) {
      $(`#${value}_slider_val1`).text(slideEvt.value.newValue[0]);
      $(`#${value}_slider_val2`).text(slideEvt.value.newValue[1]);
    });
    $(`#${value}_slider_input`).slider("refresh");
    $(".tooltip-inner").css("display", "none");
    $(".slider-selection").css("background", "#0378B3");
    $(".slider-track-low").css("background", "grey");
    $(".slider-track-high").css("background", "grey");
    $(".slider").css("width", "90%");  })
})
$("#pfam_input_antibody").select2({
  ajax:{
    url: `${window.location.origin}/getTerms/Antibody/Pfam`,
    dataType: 'json',
    type: "GET",
    data: function (params) {
      var query = {
        search: params.term
      }
      return query;
    }
  }
})
var cc_select = $(".cc_input").select2();
var mf_select = $(".mf_input").select2();
var bp_select = $(".bp_input").select2();
var pdb_select = $(".pdb_input").select2();
var chain_select = $("#chain_input").select2();
var interaction_select = $(".interaction_input").select2();
var antigen_select = $("#antigen_input").select2();
var type_select = $("#type_input").select2();
$(".select2").css("width", "90%");
/* var results_table = $("#results-table").DataTable({
  "autoWidth": false,
  "columns": [
    {"data": "id_sequence", "width": "30%"},
    {"data": "Length", "width": "5%"},
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
}) */
//Función que actualiza el slider y el small. 
/* function updateLengths(min, max){
  slider.slider("setAttribute", "min", min);
  slider.slider("setAttribute", "max", max);
  slider.slider("setAttribute", "value", [min, max]);
  slider.slider("refresh");
  $(".slider").css("width", "90%");
  $("#ex2SliderVal1").text(min)
  $("#ex2SliderVal2").text(max)
}
//Cuando se generen cambios en el slider, se actualizan los valores del small.
$("#ex2").on("change", function (slideEvt) {
  $("#ex2SliderVal1").text(slideEvt.value.newValue[0]);
  $("#ex2SliderVal2").text(slideEvt.value.newValue[1]);
});
//Muestra lo que tiene que mostrar en antibodies. 
function renderAntibodies(){
  $("#antibody_form").show();
  $("#antigen_form").hide();
  $("#epitope_form").hide();
}
//Muestra lo que tiene que mostrar en antigens. 
function renderAntigens(){
  $("#antibody_form").hide();
  $("#antigen_form").show();
  $("#epitope_form").hide();
}
//Muestra lo que tiene que mostrar en epitopes.
function renderEpitopes(){
  $("#antibody_form").hide();
  $("#antigen_form").hide();
  $("#epitope_form").show();
} */
//Rellena los selects con la información correspondiente
/* function fillSelects(selected){
  $.ajax({
    url: window.location.origin + "/getGO/",
    method: 'POST',
    data: {
      "type": selected
    }
  }).done( function(data) {
    //Se llama a la función que rellena el slider
    min = data.minLength
    max = data.maxLength
    updateLengths(min, max)
    if(selected != "Epitope"){
      //Obtener los arrays
      pfam = data.Pfam
      cellular_component = data.Cellular_component
      molecular_function = data.Molecular_function
      biological_process = data.Biological_process
      pdb = data.pdb
      interactions = data.interactions
      cadenas = ["", "Heavy", "Light"]
      //Genera unos placeholders de mentira
      pfam.unshift("")
      cellular_component.unshift("")
      molecular_function.unshift("")
      biological_process.unshift("")
      pdb.unshift("")
      interactions.unshift("")
      //Rellena los select
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
      pdb_select.empty().select2({
        data: pdb
      });
      chain_select.empty().select2({
        data: cadenas
      });
      interaction_select.empty().select2({
        data: interactions
      });
    }
    else{
      antigens = data.antigens
      types = ["", "linear", "structural"]
      antigens.unshift("")
      antigen_select.empty().select2({
        data: antigens
      })
      type_select.empty().select2({
        data: types
      })
    }
  })
} */
//Cambios en las opciones dependiendo de la bd. 
/* var selected;
$("#typeOfDatabase").on("change", function () {
  //Esconde todo
  $("#info").remove();
  $("#checkbox_structure").prop( "checked", false );
  selected = $("#typeOfDatabase option:selected").text()
  //Rellena con la info correspondiente
  if (selected == 'Antibody') {
    fillSelects(selected)
    renderAntibodies();
  }
  else if (selected == 'Antigen') {
    fillSelects(selected);
    renderAntigens();
  }
  else if (selected == 'Epitope') {
    fillSelects(selected);
    renderEpitopes();
  }
});
//Detecta el checkbuton de has structure y muestra el formulario del pdb.
$("#checkbox_structure").on("click", function(){
  value = $(this).is(":checked");
  if(value){
    $("#div_pdb").show()
  }
  else{
    $("#div_pdb").hide()
  }
  $(".select2").css("width", "100%");
})
//Detecta el checkbuton de has interaction y muestra el formulario de la interacción.
$("#checkbox_relation").on("click", function(){
  value = $(this).is(":checked");
  if(value){
    $("#div_relation_id").show()
  }
  else{
    $("#div_relation_id").hide()
  }
  $(".select2").css("width", "100%");
})
//Detecta el checkbuton de has antigen y muestra el formulario de la relación.
$("#checkbox_has_antigen").on("click", function(){
  value = $(this).is(":checked");
  if(value){
    $("#div_antigen").show()
  }
  else{
    $("#div_antigen").hide()
  }
  $(".select2").css("width", "100%");
}) */
//Va a buscar la data solicitada
/* $("#submit").on("click", function(){
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
var table_epitope = $('#results-table-epitope').DataTable({
  autoWidth: false,
  serverSide: true,
  searching: false,
  processing: true,
  ajax: {
    url: `${window.location.origin}/SearchEpitope`,
    method: 'POST',
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
});
var table_antigen = $('#results-table-antigen').DataTable({
  autoWidth: false,
  serverSide: true,
  searching: false,
  processing: true,
  ajax: {
    url: `${window.location.origin}/SearchAntigen`,
    method: 'POST',
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
  ]
});
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
  return $.ajax({
    url: `${window.location.origin}/getLengthCollection`,
    method: "POST",
    data: {
      col: $("#typeOfDatabase option:selected").text()
    }
  })
}
//Detecta el checkbuton de has interaction y muestra el formulario de la interacción.
$(".checkbox_relation").on("click", function () {
  value = $(this).is(":checked");
  if (value) {
    $(".div_relation_id").show()
  }
  else {
    $(".div_relation_id").hide()
  }
})
//Detecta el checkbuton de has antigen y muestra el formulario de la relación.
$("#checkbox_has_antigen").on("click", function () {
  value = $(this).is(":checked");
  if (value) {
    $("#div_antigen").show()
  }
  else {
    $("#div_antigen").hide()
  }
})
//Detecta el checkbuton de has structure y muestra el formulario del pdb.
$(".checkbox_structure").on("click", function () {
  value = $(this).is(":checked");
  if (value) {
    $(".div_pdb").show()
  }
  else {
    $(".div_pdb").hide()
  }
})

