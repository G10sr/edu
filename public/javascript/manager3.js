let reportIds = [];
let ids = [];

var booling = 0; 
var booling1 = 0; 

async function mostrarUsuarios() {
    booling = 0; 
    booling1 = 0; 
    let nombresUsuarios = [];
    let correosUsuarios = [];
    let permisosUsuarios = [];
    let rolesUsuarios = [];
    let rolIds = [];
    let ids = [];

    // Petición a la API para obtener los datos de usuarios
    await fetch('/api/usuarios')
    .then(response => response.json())
    .then(data => {
        nombresUsuarios = data.map(item => item.name);
        correosUsuarios = data.map(item => item.email);
        permisosUsuarios = data.map(item => item.permiso);  // Nuevos datos de permisos
        rolesUsuarios = data.map(item => item.rol);
        rolIds = data.map(item => item.rol_id);  // ID de los roles
        ids = data.map(item => item.id);
    })
    .catch(error => {
        console.error('Error al obtener los usuarios:', error);
    });

    let contenedor = document.getElementById("grid");

    // Bucle para mostrar los usuarios
    for (let i = 0; i < nombresUsuarios.length; i++) {

        if (ids[i] == 4){
        } else {
        let nombre = document.createTextNode(nombresUsuarios[i]);
        let correo = document.createTextNode(correosUsuarios[i]);
        let permisoTexto = permisosUsuarios[i] === 1 ? "✔️" : "❌"; // Texto de permiso
        let permiso = document.createTextNode("Permiso: " + permisoTexto); 
        let rol = document.createTextNode("Rol: " + rolesUsuarios[i]);

        let caja = document.createElement("div");
        caja.setAttribute("class", "minigrid");
        caja.setAttribute("id", `minibox-${ids[i]}`);

        let nom = document.createElement("p");
        nom.setAttribute("class", "titulobox");
        nom.appendChild(nombre);

        let mail = document.createElement("p");
        mail.setAttribute("class", "descbox");
        mail.appendChild(correo);

        let permisoP = document.createElement("p");
        permisoP.setAttribute("class", "permisobox");
        permisoP.appendChild(permiso);

        let role = document.createElement("p");
        role.setAttribute("class", "rol");
        role.appendChild(rol);

        // Crear checkboxes para los roles (0: Sin Rol, 1: Admin, 2: Profesor)
        const checkboxContainer = document.createElement('div');

        for (let l = 0; l <= 2; l++) {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'checkbox';
            checkbox.dataset.i = i;   // Asigna el índice de usuario al dataset
            checkbox.dataset.l = l;   // Asigna el rol al dataset
            checkbox.dataset.userid = ids[i]; // Asignar el id del usuario al dataset

            // Asignar evento onclick para actualizar el rol
            checkbox.onclick = function(event) {
                handleCheckboxClick(event, ids[i], permisosUsuarios[i], l);
            };

            const label = document.createElement('label');
            label.className = 'labelsmanager';
            label.textContent = l === 0 ? 'None' : (l === 1 ? 'Admin' : 'Profesor');

            checkbox.checked = (rolIds[i] === 0 && l === 0) ||
                               (rolIds[i] === 1 && l === 1) ||
                               (rolIds[i] === 2 && l === 2);

            checkboxContainer.appendChild(checkbox);
            checkboxContainer.appendChild(label);
            checkboxContainer.appendChild(document.createElement('br'));
            checkboxContainer.className = "chex";
        }

        // Checkbox para el permiso
        const permisoCheckbox = document.createElement('input');
        permisoCheckbox.type = 'checkbox';
        permisoCheckbox.className = 'permiso-checkbox';
        permisoCheckbox.checked = permisosUsuarios[i] === 1;

        // Asignar evento onclick para actualizar el permiso
        permisoCheckbox.onclick = function(event) {
            handlePermisoCheckboxClick(event, ids[i], rolIds[i]);
        };

        const permisoLabel = document.createElement('label');
        permisoLabel.textContent = "Permiso";
        permisoLabel.className = "Nox";
        permisoLabel.appendChild(permisoCheckbox);
        permisoP.appendChild(document.createElement('br'));
        permisoP.appendChild(permisoLabel);
        permisoP.className = "peng";

        nom.appendChild(mail);
        caja.appendChild(nom);
        caja.appendChild(permisoP);
        caja.appendChild(checkboxContainer); 
        
        contenedor.appendChild(caja);
    }
    }
}
function handleCheckboxClick(event, userId, currentPermiso, newRol) {
    // Si el nuevo rol es undefined o null, asignar 0 (o el valor que signifique "sin rol")
    if (newRol === null || newRol === undefined) {
        newRol = 0; // Cambia este valor si "0" no representa el estado correcto de "sin rol"
    }

    console.log(`userId: ${userId}, newRol: ${newRol}, currentPermiso: ${currentPermiso}`);

    // Desmarcar otros checkboxes del mismo grupo (i)
    const sameIGroupCheckboxes = document.querySelectorAll(`.checkbox[data-i="${event.target.dataset.i}"]`);
    sameIGroupCheckboxes.forEach((cb) => {
        if (cb !== event.target) {
            cb.checked = false; // Desmarca todos los demás checkboxes del mismo grupo
        }
    });

    // Realizar la solicitud para actualizar el rol y el permiso del usuario
    fetch('/api/update-user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, newRol, currentPermiso }) // Enviar el ID del usuario y el nuevo rol
    })
    .then(response => response.json())
    .then(data => {
        console.log('User role updated successfully:', data);
    })
    .catch(error => {
        console.error('Error updating user role:', error);
    });
}

function handlePermisoCheckboxClick(event, userId, currentRol) {
    const checkbox = event.target;
    let newPermiso = checkbox.checked ? 1 : 0; // Solo 1 o 0 deberían ser válidos

    // Verificar si newPermiso tiene un valor válido
    if (newPermiso !== 1 && newPermiso !== 0) {
        console.error('Invalid value for permiso:', newPermiso);
        newPermiso = 0;
    }

    console.log(`userId: ${userId}, currentRol: ${currentRol}, newPermiso: ${newPermiso}`);

    // Realizar la solicitud para actualizar el permiso y el rol del usuario
    fetch('/api/update-user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: userId, newRol: currentRol, newPermiso: newPermiso }) // Enviar el ID del usuario, el nuevo rol y el nuevo permiso
    })
    .then(response => response.json())
    .then(data => {
        console.log('User permiso updated successfully:', data);
    })
    .catch(error => {
        console.error('Error updating user permiso:', error);
    });
}

function refresh() {
    var contenedor = document.getElementById("grid");
    var refreshButton = document.getElementById("refresh");

    refreshButton.classList.remove("refresh_animation");
    setTimeout(function() {
        refreshButton.classList.add("refresh_animation");
    }, 10);

    contenedor.innerHTML = '';
    setTimeout(mostrarUsuarios, 300);
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
            alert("You don't have permission for this")
            window.location.href = '/reportes.html'; 
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
            window.location.href = 'iniciosesion.html'; 
        }
    })
    .catch(error => {
        console.error('Error al obtener los reportes:', error);
    });
}
window.onload = function() {
    mostrarUsuarios()
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
    console.log(bol);
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