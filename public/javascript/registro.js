
submit = document.getElementById("buton1");

document.querySelector(".form").addEventListener('submit', (event) => {
    event.preventDefault();
    
    const getuser1 = (document.getElementById("usuario").value).trim();
    const getname1 = document.getElementById("nombre").value;
    const getpassword1 = document.getElementById("password").value.trim();
    const getpassword2 = document.getElementById("password2").value.trim();
    
if (!getuser1 || !getpassword1 || !getpassword2 || !getname1) {
        alert("Por favor ingresa todos los datos.");
        event.preventDefault;
}
else if (getpassword1 == getpassword2){
    
    const data = { getname1, getuser1, getpassword1 }; 

    fetch('/registrarUsuario', {
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
            window.location.href = '/iniciosesion.html'; 
            alert('Usuario creado, espera la autorización');
        } else  if (data == 2) {
            alert('Credenciales Repetidas o Invalidas');
        } else {
            alert ('Algo salió mal')
        }
    })
    .catch(error => {
        console.error('Error:', error); 
    });
} else {
 alert('Datos mal colocados');
}
});