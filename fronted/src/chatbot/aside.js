
/*=== Variables === */
const homeIcon = document.getElementById('home');
const contenedorChats = document.getElementById('chats');
const nuevoChat = document.getElementById('nuevo');
const aside = document.getElementById('aside');
const delChat = document.getElementById('delChat');

// Objeto chat
let chat = [
    {
        name: "",
        conversacion: {},
        id: ""
    }
];

// Objeto conversacion
const conversacion = [
    {
        bot: "Bienvenido",
        user: ""
    },
]


// Historial de chats (almacenar de forma local)
let historialChats = [];

console.log(chat)
console.log(historialChats)

/*=== Eventos === */
eventListeners();

function eventListeners() {
    homeIcon.addEventListener('click', inicio);
    nuevoChat.addEventListener('click', agregarChat);
}

/*=== Funciones === */
function inicio() {
    const url = 'adminUsuario.html';
    window.location.href = url;
}

// Funcion para agregar chat al aside
function agregarChat() {
    // alert para agregar titulo al nuevo chat
    const nombre = prompt('Nombre: ');

    const item = document.createElement('div');
    item.classList.add('item');
    // elemntos para nuevo item
    const titulo = document.createElement('P');
    titulo.textContent = nombre;

    const icon = document.createElement('img');
    icon.src = '../../icons/delete-chat.svg';
    icon.alt = 'icon';
    icon.classList.add('icon');

    // Agregar elementos al item
    item.appendChild(titulo);
    item.appendChild(icon);

    // Agregar item al contenedor
    contenedorChats.appendChild(item);

    // Agregar elementos a los objetos
    id = Date.now(); // id del chat en caso de que haya dos con el mismo nombre

    agregarInformacion(id);

    // Eliminar el item si presiono sobre el icono
    icon.onclick = () => {
        item.remove()
        eliminarChat(id);
    }
}

// Agregar informacion a los arrays
function agregarInformacion(id) {
    chat.push({
        name: name,
        conversacion: {},
        id: id
    });

    // Agregar el nombre y id
    historialChats.push({
        id: id
    })
}

// Eliminar el chat del historialChats
function eliminarChat(idAEliminar) {
    // Reasignar historialChats
    historialChats = historialChats.filter(item => item.id !== idAEliminar);

    // Reasignar chat
    chat = chat.filter(item => item.id !== idAEliminar);

    console.log(historialChats);
}

