let response = document.getElementById("success");
console.log(response)
response.style.display = "block";

setTimeout(id, 6000);

function id() {
    response.id='id';
    let another_response = document.getElementById(response.id);
    another_response.style.display = "none";
    console.log(response.id)
    return another_response.style.display;
    
}

