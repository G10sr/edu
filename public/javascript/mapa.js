var booling = 0; 
var booling1 = 0; 
async function rolesfunc() {
    await fetch('/api/roles')
    .then(response => response.json())  
    .then(data => {
        booling = 0; 
        booling1 = 0; 
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
    verificarNuevosAnuncios();
    verificarNuevosReportes();
    rolesfunc();
    const mapContainer = document.getElementById('map');
        const svgElement = document.getElementById('ey40nT29W7O1');
        
        mapContainer.scrollTop = (svgElement.clientHeight - mapContainer.clientHeight) / 2;
        mapContainer.scrollLeft = (svgElement.clientWidth - mapContainer.clientWidth) / 2;
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


        //controles del mapa 

    let currentHeight = 1000; 
    const minHeight = 500; 
    const maxHeight = 3000; 

    function zoomIn() {
        currentHeight = Math.min(maxHeight, currentHeight + 100);
        document.getElementById('ey40nT29W7O1').style.height = `${currentHeight}px`;
    }

    function zoomOut() {
        currentHeight = Math.max(minHeight, currentHeight - 100);
        document.getElementById('ey40nT29W7O1').style.height = `${currentHeight}px`;
    }