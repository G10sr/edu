
submit = document.getElementById("buton1");

document.querySelector(".form").addEventListener('submit', (event) => {
    event.preventDefault();
    
    const getuser = (document.getElementById("usuario").value).trim();
    const getpassword = document.getElementById("pasword").value.trim();
    
    if (!getuser || !getpassword) {
        alert("Por favor ingresa usuario y contraseña.");
        return;
    }
    
    const data = { getuser, getpassword }; 
    console.log(data)
    fetch('/enviarDatos', {
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
        
        if (data == 2) {
            alert('Inicio de sesion no autorizado');
        } else if (data == 1) {
            window.location.href = '/reportes.html'; 
        } else {
            alert('Credenciales Invalidas');
        }
    })
    .catch(error => {
        console.error('Error:', error); 
    });
});