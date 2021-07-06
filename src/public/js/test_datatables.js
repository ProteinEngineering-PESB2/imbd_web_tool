var table = $('#example').DataTable( {
    serverSide: true,
    searching: false,
    processing: true,
    ajax: {
        url: window.location.origin + '/testDatatable',
        method: 'POST',
    },
    columns: [
        { "data": "id_sequence" },
        { "data": "Length" },
    ]
} );