let reportIds = [];
let ids = [];
var booling = 0; 
var booling1 = 0; 
let notdone=0;

async function mostrarTexto() {
    booling = 0; 
    booling1 = 0; 
    let nomreportes = [];
    let descripcionreportes = [];
    let vigenciareportes = [];
    let usuarionom = [];
    let tiporeporte = [];
    let aula = [];
    
    await fetch('/api/reportes')
    .then(response => response.json())  
    .then(data => {
        nomreportes = data.map(item => item.nombre); 
        descripcionreportes = data.map(item => item.descripcion); 
        vigenciareportes = data.map(item => item.vigencia); 
        usuarionom = data.map(item => item.name);
        tiporeporte = data.map(item => item.tipo_reporte);
        aula = data.map(item => item.aula);
        ids = data.map(item => item.id);
    })
    .catch(error => {
        console.error('Error al obtener los reportes:', error);
    });

    let idReverse = ids.reverse();
    let nomreportesReverse = nomreportes.reverse();
    let descreportesReverse = descripcionreportes.reverse();
    let vigenciareportesReverse = vigenciareportes.reverse();
    let tiporeporteReverse = tiporeporte.reverse();
    let aulaReverse = aula.reverse();
    
    let contenedor = document.getElementById("grid");
    for (let i = 0; i < nomreportes.length; i++) {
        let vigenciatotal = 'Resuelto ✔️';
        let tiporeportetotal = 'Ninguno Especifico';

        if (vigenciareportesReverse[i] === 0) {
            vigenciatotal = 'Resuelto ✔️';
        } else if (vigenciareportesReverse[i] === 1) {
            vigenciatotal = 'En proceso 🔧';
        } else if (vigenciareportesReverse[i] === 2) {
            vigenciatotal = 'Pendiente ⌚';
        }

        if (tiporeporteReverse[i] === 0) {
            // No hay tipo especificado
        } else if (tiporeporteReverse[i] === 1) {
            tiporeportetotal = 'Limpieza';
        } else if (tiporeporteReverse[i] === 2) {
            tiporeportetotal = 'TI';
        } else if (tiporeporteReverse[i] === 3) {
            tiporeportetotal = 'Estructura';
        } else if (tiporeporteReverse[i] === 4) {
            tiporeportetotal = 'Eléctrico';
        }
    

        let nombre = document.createTextNode(nomreportesReverse[i]);
        let descripcion = document.createTextNode(descreportesReverse[i]);
        let vigencia = document.createTextNode("  -  "+vigenciatotal);
        let tiporep = document.createTextNode(tiporeportetotal);
        let aula = document.createTextNode("  -  "+aulaReverse[i]);


        let caja = document.createElement("div");
        caja.setAttribute("class", "minigrid");
        caja.setAttribute("id", `minibox-${idReverse[i]}`);

        let nom = document.createElement("p");
        nom.setAttribute("class", "titulobox");
        nom.appendChild(nombre.cloneNode(true));

        let desc = document.createElement("p");
        desc.setAttribute("class", "descbox");
        desc.appendChild(descripcion.cloneNode(true));

        let vig = document.createElement("p");
        vig.setAttribute("class", "vig");
        nom.appendChild(vigencia.cloneNode(true));

        let tip = document.createElement("p");
        tip.setAttribute("class", "tip");
        nom.appendChild(tiporep.cloneNode(true));

        let aul = document.createElement("p");
        aul.setAttribute("class", "aula");
        nom.appendChild(aula.cloneNode(true));

        const opcion0 = document.createElement('div');

        for (let l = 0; l <= 2; l++) {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'checkbox'; 
            checkbox.dataset.i = i; 
            checkbox.dataset.l = l; 
            checkbox.onclick = (event) => handleCheckboxClick(event, idReverse[i]); // Llama a la función de manejo de checkbox

            const label = document.createElement('label');
            label.className = 'labelsmanager';
            label.htmlFor = checkbox.id; 
            label.textContent = l === 0 ? 'Hecho' : (l === 1 ? 'En proceso' : 'Pendiente');

            // Pre-check the correct checkbox based on vigencia
            checkbox.checked = vigenciareportesReverse[i] === l;

            opcion0.appendChild(checkbox);
            opcion0.appendChild(label);
            opcion0.appendChild(document.createElement('br'));
        }

        caja.appendChild(nom);
        caja.appendChild(desc);
        desc.append(opcion0);
        caja.appendChild(tip);
        contenedor.appendChild(caja);
    }
}

async function handleCheckboxClick(event, reportId) {
    const checkbox = event.target; // Obtener el checkbox que fue clicado
    const newVigencia = parseInt(checkbox.dataset.l); // Obtener la nueva vigencia desde el dataset del checkbox

    // Uncheck all other checkboxes in the same group
    const sameIGroupCheckboxes = document.querySelectorAll(`.checkbox[data-i="${checkbox.dataset.i}"]`);
    sameIGroupCheckboxes.forEach((cb) => {
        if (cb !== checkbox) {
            cb.checked = false;
        }
    });
    const verificacion = await postverificacion();
    const roles = await rolesfunc();

    if (verificacion === 1 || roles === 1) {
        return; 
    } else {
        await fetch('/api/roles')
        .then(response => response.json())  
        .then(data => {
        let rol = data; 
        if (rol.rolId[0]==1){
            fetch('/api/update-report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ reportId: reportId, newVigencia: newVigencia }) 
            })
            .then(response => response.json())
            .then(data => {
                console.log('Report updated successfully:', data);
            })
            .catch(error => {
                console.error('Error updating report:', error);
            });
        } else {
            console.log('No tienes permisos para asignar este rol.');
            window.location.href = '/reportes.html'; 
        }         
    })
    .catch(error => {
        console.error('Error al obtener los reportes:', error);
    });
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

async function rolesfunc() {
    await fetch('/api/roles')
    .then(response => response.json())  
    .then(data => {
        let rol = data; 
        if (rol.rolId[0]==1){
            if(notdone == 0){
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
            notdone = 1;
            }
            
        } else {
            alert("You don't have permission for this")
            window.location.href = '/reportes.html'; 
            return 1;
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
            window.location.href = '/iniciosesion.html'; 
            return 1;
        }
    })
    .catch(error => {
        console.error('Error al obtener los reportes:', error);
    });
}

window.onload = function() {
    mostrarTexto();
    postverificacion();
    rolesfunc();
    verificarNuevosReportes();
    verificarNuevosAnuncios();
};

async function verificarNuevosReportes() {
    fetch('/contarReportes')
    .then(response => response.json())
    .then(data => {
    const bol = data;
    if (bol == 1) {
        if (booling1 == 0){
        booling1 = 1; 
        const reporteLink = document.getElementById('reporteLink');
        reporteLink.innerHTML += " ⦿";}
        if (!document.title.startsWith("🔴")) {
            document.title = "🔴 " + document.title;
        }
    }
    })
    .catch(error => {
        console.error('Error al verificar reportes:', error);
    });
        }

        setInterval(function() {
            verificarNuevosReportes();
            verificarNuevosAnuncios();
        }, 5000); 
    async function verificarNuevosAnuncios() {
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


