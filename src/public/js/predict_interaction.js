$("#results").hide()
var table_results = $('#table-results').DataTable({
    paging: false,
    searching: false,
    bInfo: false,
    ordering: false,
});
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
$("#pdb_file").on("change", function () {
    let name = $("#pdb_file")[0].files[0].name
    let end = name.substring(name.length - 4, name.length)
    if (end != ".pdb") {
        $("#advise").text("This is not a .pdb file")
        $("#advise").show();
        $("#pdb_file").val(null);
        $("#pdb").prop("disabled", true);
        desactivateSubmit(true)
    }
    else {
        $("#advise").text(name)
        $("#advise").show();
        $("#pdb").prop("disabled", true);
        desactivateSubmit(false)
    }
    $("#remove_file").removeClass("invisible")
})
$("#remove_file").on("click", function () {
    $("#pdb_file").val(null);
    $("#advise").hide();
    $("#remove_file").addClass("invisible")
    if ($("#pdb").val().length == 0) {
        desactivateSubmit(true)
    }
    $("#pdb").prop("disabled", false);
    $("#pdb").removeClass("text-gray-200")
})
function parseResponse(res) {
    console.log(res)
    data = []
    res.forEach((x) => {
        row_cords = {
            "member_1": { "position": x.member1.info_pos, "chain": x.member1.info_residue.chain, "pos": x.member1.info_residue.pos, "res": x.member1.info_residue.residue },
            "member_2": { "position": x.member2.info_pos, "chain": x.member2.info_residue.chain, "pos": x.member2.info_residue.pos, "res": x.member2.info_residue.residue },
            "interaction": { "position": { "x": (parseFloat(x.member1.info_pos.x) + parseFloat(x.member2.info_pos.x)) / 2, "y": (parseFloat(x.member1.info_pos.y) + parseFloat(x.member2.info_pos.y)) / 2, "z": (parseFloat(x.member1.info_pos.z) + parseFloat(x.member2.info_pos.z)) / 2 }, "value": x.value_interaction },
            "visible": true
        }
        data.push(row_cords)
    })
    return data
}
$("#pdb").keyup(function () {
    if ($("#pdb").val().length >= 1) {
        desactivateSubmit(false)
    }
    else {
        desactivateSubmit(true)
    }
});
//Obtención de la respuesta del servicio
$("#submit").on("click", () => {
    $('#molecule').hide();
    desactivateSubmit(true)
    let pdb;
    if ($("#pdb_file")[0].files.length != 0) {//Si usa el form file.
        let formData = new FormData();
        formData.append("file", $("#pdb_file")[0].files[0]);
        $.ajax({
            url: window.location.origin + "/uploadFile",
            method: "POST",
            data: formData,
            dataType: "html",
            contentType: false,
            processData: false
        })
        pdb = $("#pdb_file")[0].files[0].name.split(".")[0];
        $(".loader").show();
        $("#results").hide();
        $.ajax({
            url: window.location.origin + "/ServiceInteractions/" + pdb + "/1",
            method: "GET"
        }).done((res) => {
            pdb = pdb.split(".")[0]
            display_table_molecule(res, pdb);
        })
    }
    else {//Si usa el form text.
        pdb = $("#pdb").val();
        $(".loader").show();
        $("#results").hide();
        $.ajax({
            url: window.location.origin + "/ServiceInteractions/" + pdb + "/2",
            method: "GET"
        }).done((res) => {
            display_table_molecule(res, pdb);
        })
    }
    $("#pdb_file").val(null);

})
function display_table_molecule(res, pdb){
    data = parseResponse(res["response_service"]["detected_interactions"])
    display_results(data);
    render_structure("../services/" + pdb + ".pdb", data)
    $(".loader").hide();
    $("#results").show();
    $('#molecule').show();
    window.scrollTo(0, document.body.scrollHeight);
    $("#Download").on("click", () => {
        download(JSON.stringify(res["response_service"]["detected_interactions"]), pdb + "_interactions.json", "text/plain");
    })
}
function download(content, fileName, contentType) {
    const a = document.createElement("a");
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}
function display_results(data) {
    let matriz = [];
    data.forEach((row) => {
        let arr = [];
        arr.push(row.member_1.chain);
        arr.push(row.member_1.pos);
        arr.push(row.member_1.res);
        arr.push(row.member_2.chain);
        arr.push(row.member_2.pos);
        arr.push(row.member_2.res);
        arr.push(row.interaction.value);
        matriz.push(arr);
    });
    table_results.clear()
    table_results.rows.add(matriz).draw()
    $("#results").addClass("float-left")
    $(".datatables_wrapper").css("height", "500px")
    $(".datatables_wrapper").addClass("overflow-y-scroll")
    desactivateSubmit(false)
}
function render_structure(pdbUri, res) {
    let element = $('#molecule');
    element.addClass("w-1/2")
    element.addClass("relative")
    element.addClass("float-right")
    element.css("margin-top", "30px")
    element.css("height", "660px")
    element.hide()
    var config = { backgroundColor: 'white' };//#83C576
    var viewer = $3Dmol.createViewer(element, config);
    $.ajax(pdbUri, {
        success: function (molecule) {
            let v = viewer;
            v.addModel(molecule, "pdb");
            v.setStyle({}, { cartoon: { colorscheme: 'chain' } });
            addLinesLabels(res, v);
            v.zoomTo();
            v.render();
            v.zoom(1.2, 2000);
        },
        error: function (hdr, status, err) {
            console.error("Failed to load PDB " + pdbUri + ": " + err);
        }
    });
}
function addLinesLabels(data, viewer) {
    data.forEach((x) => {
        if (x.visible) {
            console.log(x)
            viewer.addLabel(x.member_1.chain + "-" + x.member_1.res + "-" + x.member_1.pos, { position: x.member_1.position })
            viewer.addLabel(x.member_2.chain + "-" + x.member_2.res + "-" + x.member_2.pos, { position: x.member_2.position })
            viewer.addLabel(x.interaction.value, { position: x.interaction.position })
            viewer.addLine({ linewidth: 10, color: 'black', start: x.member_1.position, end: x.member_2.position })
        }
    })
}