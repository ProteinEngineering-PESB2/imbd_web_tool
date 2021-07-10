var id= localStorage.getItem("id");
var type = localStorage.getItem("type")
console.log(id, type)
$.ajax({
      url: `/profile`,
      method: "POST",
      data: { id: id, type: type }
    }).done((data) => {
      $("body").append(data);
      localStorage.removeItem("id");
      localStorage.removeItem("type");
})