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
                <a href="manager" class="opciones">
                    <i class="fa-solid fa-clipboard-list"></i> Gestor 
                    Reportes
                </a>`;
            let newListItem2 = document.createElement('li');

            newListItem2.innerHTML = `
                <a href="manager2" class="opciones">
                    <i class="fa-solid fa-clipboard-list"></i> Gestor 
                    Anuncios
                </a>`;
                let newListItem3 = document.createElement('li');

                newListItem3.innerHTML = `
                    <a href="manager3" class="opciones">
                        <i class="fa-solid fa-clipboard-list"></i> Gestor 
                        Usuarios
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
            window.location.href = '/iniciosesion'; 
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
    agregarIcono();
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
                    window.location.href = '/iniciosesion'; 
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
    async function agregarIcono() {
        const svg = document.getElementById('ey40nT29W7O1');
        
        let posicion = [];
        let vigencia = [];
    
        await fetch('/api/mapa')
        .then(response => response.json())  
        .then(data => {
            posicion = data.map(item => item.posicion); 
            vigencia = data.map(item => item.vigencia)
        })
        .catch(error => {
            console.error('Error al obtener los reportes:', error);
        });
       
        for (let i = 0; i < posicion.length; i++) {
            let imagen = document.createElementNS("http://www.w3.org/2000/svg", "image");
            imagen.setAttribute("href", "../imagenes/icon.png");
            imagen.setAttribute("width", "20"); // ancho
            imagen.setAttribute("height", "20"); // alto
            imagen.style.boxShadow = "0 0 20px 5px rgba(255, 255, 0, 0.7)";

            if (vigencia[i] != 0){
            // Manejar las posiciones
            if (posicion[i] == 1) {
                imagen.setAttribute("x", "350");  // Bloque 1
                imagen.setAttribute("y", "332");  // Bloque 1
            } else if (posicion[i] == 2) {
                imagen.setAttribute("x", "368");  // Bloque 2
                imagen.setAttribute("y", "340");  // Bloque 2
            } else if (posicion[i] == 3) {
                imagen.setAttribute("x", "382");  // Bloque 3
                imagen.setAttribute("y", "350");  // Bloque 3
            } else if (posicion[i] == 4) {
                imagen.setAttribute("x", "400");  // Bloque 4
                imagen.setAttribute("y", "360");  // Bloque 4
            } else if (posicion[i] == 5) {
                imagen.setAttribute("x", "380");  // Aulas Técnicas
                imagen.setAttribute("y", "325");  // Aulas Técnicas
            } else if (posicion[i] == 6) {
                imagen.setAttribute("x", "380");  // Comedor y Aulas Técnicas
                imagen.setAttribute("y", "325");  // Comedor y Aulas Técnicas
            } else if (posicion[i] == 7) {
                imagen.setAttribute("x", "360");  // Lab
                imagen.setAttribute("y", "312");  // Lab
            } else if (posicion[i] == 8) {
                imagen.setAttribute("x", "363");  // Torre Steam
                imagen.setAttribute("y", "290");  // Torre Steam
            } else if (posicion[i] == 9) {
                imagen.setAttribute("x", "334");  // Recepción
                imagen.setAttribute("y", "325");  // Recepción
            } else if (posicion[i] == 10) {
                imagen.setAttribute("x", "347");  // TI
                imagen.setAttribute("y", "400");  // TI
            } else if (posicion[i] == 11) {
                imagen.setAttribute("x", "347");  // Comedor Externo
                imagen.setAttribute("y", "460");  // Comedor Externo
            } else if (posicion[i] == 12) {
                imagen.setAttribute("x", "315");  // DAI
                imagen.setAttribute("y", "370");  // DAI
            } else if (posicion[i] == 13) {
                imagen.setAttribute("x", "315");  // SODA
                imagen.setAttribute("y", "240");  // SODA
            } else if (posicion[i] == 14) {
                imagen.setAttribute("x", "159");  // Guarda
                imagen.setAttribute("y", "280");  // Guarda
            } else if (posicion[i] == 15) {
                imagen.setAttribute("x", "400");  // Piscina
                imagen.setAttribute("y", "416");  // Piscina
            } else if (posicion[i] == 16) {
                imagen.setAttribute("x", "440");  // Cancha Interna
                imagen.setAttribute("y", "450");  // Cancha Interna
            }
            if(posicion[i]!= 100){
                svg.appendChild(imagen);
            }
        }
            
        }
    }
    
    
        
    
        
    const imageContainer = document.getElementById('map');
    let isDragging = false;
    let startX, startY, scrollLeft, scrollTop;
    
    imageContainer.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX - imageContainer.offsetLeft;
        startY = e.pageY - imageContainer.offsetTop;
        scrollLeft = imageContainer.scrollLeft;
        scrollTop = imageContainer.scrollTop;
        imageContainer.style.cursor = 'grabbing'; // Cambia el cursor cuando estás arrastrando
    });
    
    imageContainer.addEventListener('mouseleave', () => {
        isDragging = false;
        imageContainer.style.cursor = 'grab';
    });
    
    imageContainer.addEventListener('mouseup', () => {
        isDragging = false;
        imageContainer.style.cursor = 'grab';
    });
    
    imageContainer.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault(); // Evita comportamientos indeseados
        const x = e.pageX - imageContainer.offsetLeft;
        const y = e.pageY - imageContainer.offsetTop;
        const walkX = (x - startX); // Cantidad de píxeles a desplazar horizontalmente
        const walkY = (y - startY); // Cantidad de píxeles a desplazar verticalmente
        imageContainer.scrollLeft = scrollLeft - walkX;
        imageContainer.scrollTop = scrollTop - walkY;
    });