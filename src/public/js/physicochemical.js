desactivateSubmit(true)
$("#results").hide()
var table_results = $("#table-results").DataTable({
    bInfo: false,
    ordering: false,
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
$("#submit").on("click", function () {
    $(".loader").show();
    $("#results").hide();
    $("#error").hide();
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
        url: "/uploadFile",
        method: "POST",
        data: formData,
        dataType: "html",
        contentType: false,
        processData: false
    })
    $.ajax({
        url: `/ServicePhysicochemical/${name}`,
        method: "GET"
    }).done((res) => {
        parseResponse(res)
    })
    $("#file").val(null);
})
function parseResponse(res) {
    if (res["fasta_length"] == "OK") {
        data = res["get_physicochemical_properties"]
        let matriz = []
        data.forEach((x) => {
            row = []
            row.push(x.id_sequence)
            if (x.process_status == "OK") {
                properties = x.properties
                if (properties.length != "ERR") { row.push(properties.length) }
                else { row.push("") }
                if (properties.MolecularWeight != "ERR") { row.push(properties.MolecularWeight) }
                else { row.push("") }
                if (properties.Isoelectric_point != "ERR") { row.push(properties.Isoelectric_point) }
                else { row.push("") }
                if (properties.Charge_density != "ERR") { row.push(properties.Charge_density) }
                else { row.push("") }
                if (properties.Charge != "ERR") { row.push(properties.Charge) }
                else { row.push("") }
                matriz.push(row)
            }
            else {
                row.push("")
                row.push("")
                row.push("")
                row.push("")
                row.push("")
            }
        })
        table_results.clear()
        table_results.rows.add(matriz).draw()
        $("#results").show()
    }
    else {
        $("#error").show()
    }
    $(".loader").hide();
}