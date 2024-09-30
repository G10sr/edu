var booling = 0; 
var fechaActual = new Date();
var dia = String(fechaActual.getDate()).padStart(2, '0');
var mes = String(fechaActual.getMonth() + 1).padStart(2, '0'); // Los meses empiezan en 0
var anio = fechaActual.getFullYear();

var fecha = `${anio}/${mes}/${dia}`;

async function mostrarTexto() {
    booling = 0; 
    let nomreportes = [];
    let descripcionreportes = [];
    let urgenciareportes = [];
    let vigenciareportes = [];
    let usuarionom = [];
    let tiporeporte = [];
    let aula = [];
    let fecha1 = [];
    
    await fetch('/api/reportes')
    .then(response => response.json())  
    .then(data => {
        nomreportes = data.map(item => item.nombre); 
        descripcionreportes = data.map(item => item.descripcion); 
        urgenciareportes = data.map(item => item.urgencia); 
        vigenciareportes = data.map(item => item.vigencia); 
        usuarionom = data.map(item => item.name);
        tiporeporte = data.map(item => item.tipo_reporte);
        aula = data.map(item => item.aula);
        fecha1 = data.map(item => item.fecha);
    })
    .catch(error => {
        console.error('Error al obtener los reportes:', error);
    });

    var nomreportesReverse = nomreportes.reverse();
    var descreportesReverse = descripcionreportes.reverse();
    var urgenciareportesReverse = urgenciareportes.reverse();
    var vigenciareportesReverse = vigenciareportes.reverse();
    var usuarionomReverse = usuarionom.reverse(); 
    var tiporeporteReverse = tiporeporte.reverse();
    var aulaReverse = aula.reverse();
    var fecha1Reverse = fecha1.reverse();
    var thereissomething = 0;


    var contenedor = document.getElementById("grid");
    for (var i = 0; i < nomreportes.length; i++) {
        let fechaSinHora = fecha1Reverse[i].split("T")[0];
        let fechaSinSimbolos = fechaSinHora.split("-").join("");
        let fecha4 = fecha.split("/").join(""); 
        if ((fecha4 == fechaSinSimbolos && vigenciareportesReverse[i] == 0) || 
        (vigenciareportesReverse[i] != 0)){
                thereissomething = 1;
                let vigenciatotal = 'Resuelto ✔️';
                let tiporeportetotal = 'Ninguno Especifico';

                if (vigenciareportesReverse[i] == 0){
                    vigenciatotal = 'Resuelto ✔️';
                } else if (vigenciareportesReverse[i] == 1) {
                    vigenciatotal = 'En proceso 🔧';
                } else if (vigenciareportesReverse[i] == 2) {
                    vigenciatotal = 'Pendiente ⌚';
                } else {
                    
                }

                if (tiporeporteReverse[i] == 0){
                } else if (tiporeporteReverse[i] == 1) {
                    tiporeportetotal = 'Limpieza 🧹';
                } else if (tiporeporteReverse[i] == 2) {
                    tiporeportetotal = 'TI 👩‍💻';
                } else if (tiporeporteReverse[i] == 3) {
                    tiporeportetotal = 'Estructura 🧰';
                } else if (tiporeporteReverse[i] == 4) {
                    tiporeportetotal = 'Eléctrico ⚡';
                } else {}
                
                let usuario = document.createTextNode(usuarionomReverse[i]);
                let nombre = document.createTextNode(nomreportesReverse[i]);
                let descripcion = document.createTextNode(descreportesReverse[i]);
                let vigencia = document.createTextNode(vigenciatotal);
                let tiporep = document.createTextNode(tiporeportetotal);
                let aula = document.createTextNode(aulaReverse[i]);


                let caja = document.createElement("div");
                caja.setAttribute("class", "boxgrid");

                let nom = document.createElement("p");
                nom.setAttribute("class", "titulobox");
                nom.appendChild(nombre.cloneNode(true));

                let usr = document.createElement("p");
                usr.setAttribute("class", "displayuser");
                usr.appendChild(usuario.cloneNode(true));

                let desc = document.createElement("p");
                desc.setAttribute("class", "descbox");
                desc.appendChild(descripcion.cloneNode(true));

                let vig = document.createElement("p");
                vig.setAttribute("class", "vig");
                vig.appendChild(vigencia.cloneNode(true));

                let tip = document.createElement("p");
                tip.setAttribute("class", "tip");
                tip.appendChild(tiporep.cloneNode(true));

                let aul = document.createElement("p");
                aul.setAttribute("class", "aula");
                aul.appendChild(aula.cloneNode(true));

                let urg = document.createElement("div");
                if (urgenciareportesReverse[i] == 1){
                    urg.setAttribute("class", "urgbox1");
                }else{
                    urg.setAttribute("class", "urgbox0");
                }

                caja.appendChild(nom);
                caja.appendChild(desc);
                caja.appendChild(usr);
                caja.appendChild(urg);
                caja.appendChild(vig);
                caja.appendChild(aul);
                caja.appendChild(tip);
                contenedor.appendChild(caja);
            }
    }
    if (thereissomething == 0){
        const mensajes = [
            "¡Nada que reportar! 💤",
            "Todo tranquilo por aquí. 🌊",
            "Silencio absoluto. 🤫",
            "Nada por el momento, ¡disfruta un café! ☕",
            "No hay reportes, ¡a seguir sonriendo! 😄",
            "Todo en calma, como un gato en el sol. ☀️",
            "Sin novedades, ¡dame un aplauso! 👏",
            "¿Vacaciones? ¡Casi! Sin reportes hoy. 🏖️",
            "Sin reportes, ¡así que a bailar! 💃",
            "Todo bien, ¡nada de dramas aquí! 🎭"
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

function getmore() {
    var contenedor= document.getElementById("grid");
    var caja=document.createElement("div");
    caja.setAttribute("class","boxgrid");
    contenedor.appendChild(caja);
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
    var problema = document.getElementById('problema').value;
    var checkbox = document.getElementById("repurgente");
    var titulo = document.getElementById("reptitulo").value;
    var reporte = document.getElementById("reporte").value;

    
    var urgencia = 0;

    if (checkbox.checked)
    {
        urgencia = 1;
    } else {}

    var data = {
        titulo: titulo,
        reporte: reporte,
        urgencia: urgencia,
        fecha: fecha,
        lugar: lugar,
        problema: problema
    }
    if(titulo != '' && reporte != ''){
    fetch('/enviarReporte', {
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
            window.location.href = '/reportes.html'; 
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
            window.location.href = '/iniciosesion.html'; 
        }
    })
    .catch(error => {
        console.error('Error al obtener los reportes:', error);
    });
}
let cantidadPrevReportes = 0;

function verificarNuevosAnuncios() {
    fetch('/contarAnuncios')
    .then(response => response.json())
    .then(data => {
    const bol = data;
    if (bol == 1) {
        if (booling == 0){
        booling = 1; 
        const anunciosLink = document.getElementById('anunciosLink');
        anunciosLink.innerHTML += " ⦿";}
        if (!document.title.startsWith("🔴")) {
            document.title = "🔴 " + document.title;
        }
    }
    })
    .catch(error => {
        console.error('Error al verificar reportes:', error);
    });
        }

 setInterval(verificarNuevosAnuncios, 5000);
window.onload = function() {
    postverificacion();
    selec();
    verificarNuevosAnuncios();
    mostrarTexto();
    rolesfunc();
    var issueBox = document.getElementById("issuebox");
    issueBox.style.display = 'none';
};
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
