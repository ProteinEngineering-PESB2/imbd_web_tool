/* Se rellenan los sliders. */
var select = $("#typeOfDatabase option")
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
    $(`#${value.toLowerCase()}_slider_input`).slider("setAttribute", "min", min);
    $(`#${value.toLowerCase()}_slider_input`).slider("setAttribute", "max", max);
    $(`#${value.toLowerCase()}_slider_input`).slider("setAttribute", "value", [min, max]);
    $(`#${value.toLowerCase()}_slider_val1`).text(min)
    $(`#${value.toLowerCase()}_slider_val2`).text(max)
    $(`#${value.toLowerCase()}_slider_input`).on("change", function (slideEvt) {
      $(`#${value.toLowerCase()}_slider_val1`).text(slideEvt.value.newValue[0]);
      $(`#${value.toLowerCase()}_slider_val2`).text(slideEvt.value.newValue[1]);
    });
    $(`#${value.toLowerCase()}_slider_input`).slider("refresh");
    $(".tooltip-inner").css("display", "none");
    $(".slider-selection").css("background", "#0378B3");
    $(".slider-track-low").css("background", "grey");
    $(".slider-track-high").css("background", "grey");
    $(".slider").css("width", "90%");  
  })
})
dbs=["Antibody", "Antigen"]
dbs.forEach(function(value){
  inputs = ["pfam", "bp", "mf", "cc", "pdb", "interaction"]
  inputs.forEach(function(rol){
    $(`#${rol}_input_${value.toLowerCase()}`).select2({
      ajax:{
        url: `${window.location.origin}/getTerms/`,
        dataType: 'json',
        type: "GET",
        data: function (params) {
          var query = {
            search: params.term || "",
            col: value,
            rol: rol,
            type: "public"
          }
          return query;
        },
        processResults: function(data){
          let array = data.data
          array.forEach(function(value, index){
            value["id"] = index;
            array[index] = value
          })
          return {results: array}
        }
      }
    })
  })
})
$("#chain_input").select2({
  data: ["", "Heavy", "Light"]
})
$("#type_input").select2({
  data: ["", "linear", "structural"]
})
$(`#antigen_input`).select2({
  ajax:{
    url: `${window.location.origin}/getTerms/`,
    dataType: 'json',
    type: "GET",
    data: function (params) {
      var query = {
        search: params.term || "",
        col: "Epitope",
        rol: "relation",
        type: "public"
      }
      return query;
    },
    processResults: function(data){
      let array = data.data
      array.forEach(function(value, index){
        value["id"] = index;
        array[index] = value
      })
      return {results: array}
    }
  }
})
$(".select2").css("width", "90%");

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
//Detecta el checkbuton de has structure y relation. Muestra el formulario del pdb y la relacion.
dbs = ["antibody", "antigen"]
dbs.forEach((db)=>{
  $(`#checkbox_structure_${db}`).on("click", function () {
    value = $(this).is(":checked");
    if (value) {
      $(`#div_pdb_${db}`).show()
    }
    else {
      $(`#div_pdb_${db}`).hide()
    }
  })
  $(`#checkbox_relation_${db}`).on("click", function () {
    value = $(this).is(":checked");
    if (value) {
      $(`#div_relation_${db}`).show()
    }
    else {
      $(`#div_relation_${db}`).hide()
    }
  })
})