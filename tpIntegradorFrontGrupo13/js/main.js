//////////////////////// Declaración de variables //////////////////////////

// Lista de objetos.
let listaProductos = [];

// ---- contenedores de categorías ----
const contenedorFilosofia  = document.getElementById("contenedor-filosofia");
const contenedorLiteratura = document.getElementById("contenedor-literatura");

// input de búsqueda. Cuando escribo llama a la función que filtra productos
let inputBuscar = document.getElementById("barra-busqueda")
inputBuscar.addEventListener("keyup", filtrarProductos);


// Variables para manejar el carrito
let totalCarritoProductos = 0;
let carritoProductos = [];

// elementos del DOM para mostrar el carrito
let totalCarrito = document.getElementById("precio-total");
let itemsCarrito = document.getElementById("items-carrito");
let contadorCarrito = document.getElementById("contador-carrito");


const nombreUsuario = sessionStorage.getItem("userName");

////////////////////comprobar sesión//////////////////

if (!nombreUsuario) {
    
    window.location.replace("login.html");
} else {

    document.getElementById("saludo-usuario").textContent = `¡Hola, ${nombreUsuario}!`;
}



//////////////////////// Funciones ////////////////////////


// Muestro los productos en el contenedor
function mostrarProductos(listaProductos, contenedorProductos){
    let htmlProductos = "";

    listaProductos.forEach(producto => {
        htmlProductos += `
            <div class="card-producto">
                <img src=${producto.image} alt="imagen-${producto.name}">
                <h3>${producto.name}</h3>
                <p>$${producto.price}</p>
                <button onclick="agregarCarrito(${producto.id})">Agregar a carrito</button>
            </div>`
    });

    contenedorProductos.innerHTML = htmlProductos;
}

// Filtro los productos según el texto ingresado en el input de búsqueda
function filtrarProductos() {
    const q = inputBuscar.value.toLowerCase();
    const filosofia  = listaProductos.filter(p => p.category === "filosofia"  && p.name.toLowerCase().includes(q));
    const literatura = listaProductos.filter(p => p.category === "literatura" && p.name.toLowerCase().includes(q));

    mostrarProductos(filosofia,  contenedorFilosofia);
    mostrarProductos(literatura, contenedorLiteratura);
}


// Muestro los productos del carrito
function mostrarCarrito() {
    // Recupera carrito y total desde sessionStorage
    
    carritoProductos = JSON.parse(sessionStorage.getItem("Carrito")) || [];
    totalCarritoProductos = parseFloat(sessionStorage.getItem("Total")) || 0;

    let htmlProductos = "";
    let contador = 0;

    // Si hay productos en el carrito, los muestro
    if (carritoProductos.length >= 1){
        for (let i = 0; i < carritoProductos.length; i++) {
            contador++;
            htmlProductos += `
                <li class="bloque-item">
                    <p class="nombre-item">${carritoProductos[i].name} - ${carritoProductos[i].price}</p>
                    <button class="boton-eliminar" onclick="eliminarCarrito(${carritoProductos[i].id})">Eliminar</button>
                </li>`;
        }
    } else {
         // Si no hay productos, muestro mensaje de que está vacio
        htmlProductos = `<p class="bloque-item" id="carrito-vacio">No hay elementos en el carrito.</p>`;
    }

    console.log(carritoProductos);

    // Visualizo  los datos actualizados
    itemsCarrito.innerHTML = `${htmlProductos} <button id="limpiar" class="bloque-item" onclick="limpiarCarrito()">Limpiar carrito</button>`;
    totalCarrito.innerHTML = `$${totalCarritoProductos}`;
    contadorCarrito.textContent = contador;
}

// Agrego un producto al carrito utilizando el id
function agregarCarrito(id) {
    let producto = listaProductos.find(p => p.id === id);
    carritoProductos.push(producto);
    totalCarritoProductos += Number(producto.price);

    // Guardo el carrito y total en sessionStorage
    sessionStorage.setItem("Carrito", JSON.stringify(carritoProductos));
    sessionStorage.setItem("Total", totalCarritoProductos.toString());

    mostrarCarrito();
}

// Elimino un producto del carrito utilizando el id
function eliminarCarrito(id) {
    const index = carritoProductos.findIndex(p => p.id === id);
    totalCarritoProductos -= Number(carritoProductos[index].price);
    carritoProductos.splice(index, 1);

    // Actualizo el sessionStorage
    sessionStorage.setItem("Carrito", JSON.stringify(carritoProductos));
    sessionStorage.setItem("Total", totalCarritoProductos.toString());

    mostrarCarrito();
}

// Vacío todo el carrito y reinicio el total
function limpiarCarrito(){
    totalCarritoProductos = 0;
    carritoProductos = [];

    sessionStorage.setItem("Carrito", JSON.stringify([]));
    sessionStorage.setItem("Total", "0");

    mostrarCarrito();
}


//Cargo los productos de una api

async function cargarProductos() {
    try {

    contenedorFilosofia.textContent  = "Cargando...";
    contenedorLiteratura.textContent = "Cargando...";

    const res = await fetch("http://localhost:3000/api/products");

    if (!res.ok){
        throw new Error(`Error ${res.status}: ${res.statusText}`);
    } 

    const data = await res.json();       
    listaProductos = data.payload;

    
    const librosFilosofia  = listaProductos.filter(p => p.category === "filosofia");
    const librosLiteratura = listaProductos.filter(p => p.category === "literatura");

    mostrarProductos(librosFilosofia,  contenedorFilosofia);
    mostrarProductos(librosLiteratura, contenedorLiteratura);

            
    } catch (err) {

    console.error(err);
    contenedorFilosofia.innerHTML  = "<p class='error'>No se pudieron cargar los productos.</p>";
    contenedorLiteratura.innerHTML = contenedorFilosofia.innerHTML;
    }
}

async function init(){
    await cargarProductos();
    mostrarCarrito();
}

// Inicializo la pagina
init();
