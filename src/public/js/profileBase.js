var id = localStorage.getItem("id");
var type = localStorage.getItem("type")
var length = localStorage.length
console.log(length)
if(length != 0){
  sessionStorage.setItem("id", id)
  sessionStorage.setItem("type", type)
  fillbody()
}
else{
  id = sessionStorage.getItem("id")
  type = sessionStorage.getItem("type")
  length = sessionStorage.length
  if(length != 0){
    fillbody()
  }
  else{
    $("body").append("<h1>Data not found<h1>");
  }
}
function fillbody(){
  $.ajax({
    url: `/profile`,
    method: "POST",
    data: { id: id, type: type }
  }).done((data) => {
    $("body").append(data);
    localStorage.removeItem("id");
    localStorage.removeItem("type");
  })
}