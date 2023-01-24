let fecha_container = document.querySelector(".fecha_container");
let lista = document.querySelector("#lista");
let input = document.querySelector("#input");
let btnEnter = document.querySelector("#enter");

let check = "bi-circle";
let uncheck = "bi-check-circle";
let subrayado = "subrayado";
let id;
let listaElementos;

let longitud;
let latidud;

let ciudad = document.getElementById("ciudad");
let grados = document.getElementById("grados");
let icono = document.getElementById("iconos");

if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(posicion => {
        longitud = posicion.coords.longitude;
        latidud = posicion.coords.latitude;

        let url = `https://api.openweathermap.org/data/2.5/weather?lat=${latidud}&lon=${longitud}&lang=es&units=metric&appid=abad954ca549aad324470f40ca8c5315`;

        fetch(url)
            .then(Response => {return Response.json()})
            .then(data => {
                let ubicacion = data.name;
                let temp = Math.round(data.main.temp);
                let iconCode = data.weather[0].icon;
                let iconoImagen = `http://openweathermap.org/img/wn/${iconCode}.png`;

                let div = document.createElement("div");
                div.classList.add("fecha");
                div.innerHTML = `
                                <span id="ciudad">${ubicacion}</span>
                                <span id="grados">${temp}°C</span>
                                <img src="${iconoImagen}" alt="" id="icono"></img>
                                `;
                fecha_container.append(div);
            })
            .catch(error => {
                console.log(error);
            })
    })
        
}

function agregarTarea(tarea, id , realizado, eliminado) {

    if(eliminado) {
        return
    }

    let cambio_icono = realizado ? uncheck : check;
    let linea = realizado ? subrayado : "";

    let elemento = document.createElement("li");
    elemento.innerHTML =  `<i class="check bi ${cambio_icono}" data="realizado" id="${id}"></i>
                            <p class="text ${linea}">${tarea}</p>
                            <i class="borrar bi bi-trash3-fill" data="eliminado" id="${id}"></i>
                            `;
    lista.appendChild(elemento);
};

btnEnter.addEventListener("click", () => {
    let tarea = input.value;
    if(tarea) {
        agregarTarea(tarea, id, false, false);
        listaElementos.push({
            nombre: tarea, id: id, realizado: false, eliminado: false
        })
    }
    localStorage.setItem("lista", JSON.stringify(listaElementos));
    input.value = "";
    id++
});

function tareaCompletada(elemento) {
    elemento.classList.toggle(uncheck);
    elemento.classList.toggle(check);
    elemento.parentNode.querySelector(".text").classList.toggle(subrayado);
    listaElementos[elemento.id].realizado = listaElementos[elemento.id].realizado ? false : true;
};

function tareaEliminada(e) {
    let padre = e.parentNode;
    padre.remove();
    listaElementos[e.id].eliminado = true;
    Toastify({
        text: "Tarea Eliminada",
        className: "info",
        duration: 3000,
        style: {
          background: "#cf6679",
        }
      }).showToast();
};

lista.addEventListener("click", function(event) {
    let elemento = event.target;
    let datos = elemento.attributes.data.value;
    
    if(datos === "realizado") {
        tareaCompletada(elemento);
    } else {
        tareaEliminada(elemento);
    }
    localStorage.setItem("lista", JSON.stringify(listaElementos));
});

function cargarLista(i) {
    i.forEach(function(e){
        agregarTarea(e.nombre, e.id, e.realizado, e.eliminado);
    })
};

let info = localStorage.getItem("lista")
if(info) {
    listaElementos = JSON.parse(info);
    id = listaElementos.length;
    cargarLista(listaElementos)
} else {
    listaElementos = [];
    id = 0
};