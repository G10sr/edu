var booling = 0; 
var fechaActual = new Date();
var dia = String(fechaActual.getDate()).padStart(2, '0');
var mes = String(fechaActual.getMonth() + 1).padStart(2, '0'); // Los meses empiezan en 0
var anio = fechaActual.getFullYear();

var fecha = `${anio}/${mes}/${dia}`;


async function mostrarTexto() {
    booling = 0; 
    let nomanuncios = [];
    let descripcionanuncios = [];
    let vigenciaanuncios = [];
    let usuarionom = [];
    let aula = [];
    let fecha1 = [];
    
    await fetch('/api/anuncios')
    .then(response => response.json())  
    .then(data2 => {
        nomanuncios = data2.map(item => item.nombre); 
        descripcionanuncios = data2.map(item => item.descripcion); 
        vigenciaanuncios = data2.map(item => item.vigencia); 
        usuarionom = data2.map(item => item.name);
        aula = data2.map(item => item.aula);
        fecha1 = data2.map(item => item.fecha);
    })
    .catch(error => {
        console.error('Error al obtener los reportes:', error);
    });

    var nomanunciosReverse = nomanuncios.reverse();
    var descanunciosReverse = descripcionanuncios.reverse();
    var vigenciaanunciosReverse = vigenciaanuncios.reverse();
    var usuarionomReverse = usuarionom.reverse(); 
    var aulaReverse = aula.reverse();
    var fecha1Reverse = fecha1.reverse();
    var thereissomething = 0;

    var contenedor = document.getElementById("grid");
   
    for (var i = 0; i < nomanuncios.length; i++) {
        let fechaSinHora = fecha1Reverse[i].split("T")[0];
        let fechaSinSimbolos = fechaSinHora.split("-").join("");
        let fecha4 = fecha.split("/").join(""); 
        console.log(fecha4+""+fechaSinSimbolos)
        if ((fecha4 == fechaSinSimbolos && vigenciaanunciosReverse[i] == 0) || 
        (vigenciaanunciosReverse[i] != 0)){
            thereissomething =1;
            console.log(fecha4+""+fechaSinSimbolos)
            let vigenciatotal = 'Resuelto ✔️';

            if (vigenciaanunciosReverse[i] == 0){
                vigenciatotal = 'Resuelto ✔️';
            } else if (vigenciaanunciosReverse[i] == 1) {
                vigenciatotal = 'En proceso 🔧';
            } else if (vigenciaanunciosReverse[i] == 2) {
                vigenciatotal = 'Pendiente ⌚';
            } else {
                
            }

            let usuario = document.createTextNode(usuarionomReverse[i]);
            let nombre = document.createTextNode(nomanunciosReverse[i]);
            let descripcion = document.createTextNode(descanunciosReverse[i]);
            let vigencia = document.createTextNode(vigenciatotal);
            let aula = document.createTextNode(aulaReverse[i]);

            let caja = document.createElement("div");
            caja.setAttribute("class", "boxgrid");

            let nom = document.createElement("p");
            nom.setAttribute("class", "titulobox");
            nom.appendChild(nombre.cloneNode(true));

            let usr = document.createElement("p");
            usr.setAttribute("class", "displayuser");
            usr.appendChild(usuario.cloneNode(true));

            let aul = document.createElement("p");
            aul.setAttribute("class", "aula");
            aul.appendChild(aula.cloneNode(true));

            let desc = document.createElement("p");
            desc.setAttribute("class", "descbox");
            desc.appendChild(descripcion.cloneNode(true));

            let vig = document.createElement("p");
            vig.setAttribute("class", "vig");
            vig.appendChild(vigencia.cloneNode(true));

            caja.appendChild(nom);
            caja.appendChild(desc);
            caja.appendChild(usr);
            caja.appendChild(aul);
            caja.appendChild(vig);
            contenedor.appendChild(caja);
        }
    }   
    if (thereissomething == 0){
        const mensajes = [
            "¡Sin anuncios hoy! 🎉",
            "No hay anuncios, ¡disfruta del momento! 🌟",
            "Hoy no hay novedades, ¡relájate! 😌",
            "Nada que anunciar, ¡la calma esta en aire! 🌈",
            "Sin anuncios, ¡así que a pensar en helados! 🍦",
            "Todo tranquilo, ¡a seguir soñando! 💭",
            "Nada por aquí, ¡a seguir brillando! ✨",
            "Sin anuncios, ¡dame un high five! 🙌",
            "No hay anuncios, ¡así que a bailar! 💃"
        ];
    
        const mensajeAleatorio = mensajes[Math.floor(Math.random() * mensajes.length)];
        let nombre = document.createTextNode(mensajeAleatorio);
        let nom = document.createElement("p");
        nom.setAttribute("class", "nothingnew");
        nom.appendChild(nombre.cloneNode(true));
        contenedor.append(nom);
    }
}

function refresh() {
    var contenedor = document.getElementById("grid");
    var refreshButton = document.getElementById("refresh");

    refreshButton.classList.remove("refresh_animation");
    setTimeout(function() {
        refreshButton.classList.add("refresh_animation");
    }, 10);

    contenedor.innerHTML = '';
    setTimeout(mostrarTexto, 300);
}
function showBox(){
    var issueBox = document.getElementById("issuebox");
    issueBox.style.display = 'flex'; 
    
}
function issueBox(){
    var issueBox = document.getElementById("issuebox");
    issueBox.style.display = 'none'; 
    var selector = document.querySelector('.selector');
    var checkbox = document.getElementById("repurgente");
    var titulo = document.getElementById("reptitulo");
    var reporte = document.getElementById("reporte");
    selector.value = '1'; 
    checkbox.checked = false;
    titulo.value= '';
    reporte.value= '';
}
async function createReport(){
    var lugar = document.getElementById('lugar').value;
    var titulo = document.getElementById("reptitulo").value;
    var reporte = document.getElementById("reporte").value;

    var data = {
        titulo: titulo,
        reporte: reporte,
        fecha: fecha,
        lugar: lugar,
    }

    if(titulo != '' && reporte != ''){
        fetch('/enviarAnuncio', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error en la solicitud"); 
            }
            return response.json(); 
        })
        .then(async data => {
            
            if (data == 1) {
                window.location.href = '/anuncios.html'; 
            } else {
                alert('Credenciales incorrectas');
            }
        })
        .catch(error => {
            console.error('Error:', error); 
        });
    } else{
        alert("Ingrese todos los datos"); 
    }
    
}

async function rolesfunc() {
    await fetch('/api/roles')
    .then(response => response.json())  
    .then(data => {
        let rol = data; 
        if (rol.rolId[0]==1){
            var hiper = document.getElementById("hipervinculos");
            let newListItem = document.createElement('li');

            newListItem.innerHTML = `
                <a href="manager.html" class="opciones">
                    <i class="fa-solid fa-clipboard-list"></i> ManagerRep
                </a>`;
            let newListItem2 = document.createElement('li');

            newListItem2.innerHTML = `
                <a href="manager2.html" class="opciones">
                    <i class="fa-solid fa-clipboard-list"></i> ManagerAnun
                </a>`;
                let newListItem3 = document.createElement('li');

                newListItem3.innerHTML = `
                    <a href="manager3.html" class="opciones">
                        <i class="fa-solid fa-clipboard-list"></i> ManagerUsers
                    </a>`;
            hiper.appendChild(newListItem);
            hiper.appendChild(newListItem2);
            hiper.appendChild(newListItem3);
        } else {
        }
    })
    .catch(error => {
        console.error('Error al obtener los reportes:', error);
    });
}
async function postverificacion() {
    await fetch('/api/verificacion')
    .then(response => response.json())  
    .then(data => {
        let ver = data; 
        if (ver.permisoid[0]==1){

        } else if (ver.permisoid[0]==0) {
            alert("You don't have permission for this")
            window.location.href = 'iniciosesion.html'; 
        }
    })
    .catch(error => {
        console.error('Error al obtener los reportes:', error);
    });
}


window.onload = function() {
    postverificacion();
    mostrarTexto();
    rolesfunc();
    verificarNuevosReportes();
    selec();
    var issueBox = document.getElementById("issuebox");
    issueBox.style.display = 'none';
};
let cantidadPrevReportes = 0;

function verificarNuevosReportes() {
    fetch('/contarReportes')
    .then(response => response.json())
    .then(data => {
    const bol = data;
    console.log(bol);
    if (bol == 1) {
        if (booling == 0){
        booling = 1; 
        const reporteLink = document.getElementById('reporteLink');
        reporteLink.innerHTML += " ⦿";}
        if (!document.title.startsWith("🔴")) {
            document.title = "🔴" + document.title;
        }
    }
    })
    .catch(error => {
        console.error('Error al verificar reportes:', error);
    });
        }

 setInterval(verificarNuevosReportes, 5000);

 function logout() {
    fetch('/api/logout', {
        method: 'POST'
    })
    .then(response => {
        if (response.ok) {
            window.location.href = '/iniciosesion.html'; 
        } else {
            console.error('Error al cerrar sesión');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
function selec(){
    fetch('/api/selector')
        .then(response => response.json())
        .then(data => {
            const select = document.getElementById('lugar');
            data.forEach(item => {
                const option = document.createElement('option');
                option.value = item.id; 
                option.textContent = item.aula; 
                select.appendChild(option);
            });
        })
        .catch(error => console.error('Error al obtener los datos:', error));
}
