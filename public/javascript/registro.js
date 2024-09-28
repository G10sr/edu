
submit = document.getElementById("buton1");

document.querySelector(".form").addEventListener('submit', (event) => {
    event.preventDefault();
    
    const getuser1 = document.getElementById("usuario").value;
    const getname1 = document.getElementById("nombre").value;
    const getpassword1 = document.getElementById("password").value;
    const getpassword2 = document.getElementById("password2").value;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
if (!getuser1 || !getpassword1 || !getpassword2 || !getname1) {
        alert("Por favor ingresa todos los datos.");
        event.preventDefault;
}
else if (!emailPattern.test(getuser1)) {
    alert('Por favor, ingresa un correo electrónico válido.');
    event.preventDefault(); 
}
else if (getpassword1.length < 7) {
    alert('La contraseña debe tener al menos 7 caracteres.');
    event.preventDefault(); 
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