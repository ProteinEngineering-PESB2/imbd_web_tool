//Creación del slider de los largos. En un principio se encuentra vacío.
var slider = $(".ex2").slider({
    range: true,
    step: 1,
    value: [0, 10]
  });
  //Estilos del slider. 
  $(".tooltip-inner").css("display", "none");
  $(".slider-selection").css("background", "#0378B3");
  $(".slider-track-low").css("background", "grey");
  $(".slider-track-high").css("background", "grey");
  $(".slider").css("width", "90%");
  //Creación de los select, vacíos de momento.
  var pfam_select = $(".pfam_input").select2();
  var cc_select = $(".cc_input").select2();
  var mf_select = $(".mf_input").select2();
  var bp_select = $(".bp_input").select2();
  var pdb_select = $(".pdb_input").select2();
  var chain_select = $("#chain_input").select2();
  var interaction_select = $(".interaction_input").select2();
  var antigen_select = $("#antigen_input").select2();
  var type_select = $("#type_input").select2();
  $(".select2").css("width", "100%");
  slider.each(function(i){
    if(i==0){
      $(this).attr("id", "antibody_ex2")
    }
    if(i==1){
      $(this).attr("id", "antigen_ex2")
    }
    if(i==2){
      $(this).attr("id", "epitope_ex2")
    }
  })
  pfam_select.each(function(i){
    if(i==0){
      $(this).attr("id", "antibody_pfam_select")
    }
    else{
      $(this).attr("id", "antigen_pfam_select")
    }
  })
  cc_select.each(function(i){
    if(i==0){
      $(this).attr("id", "antibody_cc_select")
    }
    else{
      $(this).attr("id", "antigen_cc_select")
    }
  })
  mf_select.each(function(i){
    if(i==0){
      $(this).attr("id", "antibody_mf_select")
    }
    else{
      $(this).attr("id", "antigen_mf_select")
    }
  })
  bp_select.each(function(i){
    if(i==0){
      $(this).attr("id", "antibody_bp_select")
    }
    else{
      $(this).attr("id", "antigen_bp_select")
    }
  })
  pdb_select.each(function(i){
    if(i==0){
      $(this).attr("id", "antibody_pdb_select")
    }
    else{
      $(this).attr("id", "antigen_pdb_select")
    }
  })
  interaction_select.each(function(i){
    if(i==0){
      $(this).attr("id", "antibody_interaction_select")
    }
    else{
      $(this).attr("id", "antigen_interaction_select")
    }
  })