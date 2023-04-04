document.addEventListener('DOMContentLoaded', function () { // Wait for the page to be fully loaded before executing the JavaScript code
    // Get the container of the products
    const productosContainer = document.querySelector("#productos-container");
    const gridProductos = document.querySelector("#grid-productos");
    const carritoContainer = document.querySelector("#carrito-container");
    const carritoTotalElement = document.querySelector(".carrito-total");
    const hacerPedidoElement = document.querySelector(".hacer-pedido");

window.addEventListener('load', function() { //Event listener to detect when the page is reloaded
      if (carrito.length > 0) {
          mostrarTotalYPedido();
      }
});

let carrito = [];

inicializarCarrito(); // Call the function inicializarCarrito() to load the saved cart products

function crearElementoProducto(producto) { // Function that creates an HTML element for a product and returns it

    const divProducto = document.createElement('div'); // Creamos un elemento div para contener la información del producto
    divProducto.classList.add('col-md-3');
    divProducto.innerHTML = // Create the div content using the product information
        `<img src="${producto.imagen}" alt="${producto.nombre}">
        <h2>${producto.nombre}</h2>
        <p>Precio: $${producto.precio}</p>
        <p>Descripción: ${producto.descripcion}</p>`
    ;
    const imgProducto = divProducto.querySelector('img');

    const infoBtn = document.createElement('button');
    infoBtn.textContent = 'Más información';
    infoBtn.classList.add('info-btn');
    infoBtn.style.visibility = 'hidden';
    infoBtn.addEventListener('click', mostrarInfoProducto.bind(infoBtn, producto));
    divProducto.appendChild(infoBtn);

    
    const botonAgregar = document.createElement('button'); // Create a button element to add the product to the cart
    botonAgregar.id = 'boton-agregar';
    botonAgregar.textContent = 'Agregar al carrito';
    botonAgregar.addEventListener('click', function () { // Add an event listener to the button to execute a function when clicked
        console.log(`Se agregó al carrito el producto: ${producto.nombre}`);
        agregarAlCarrito(producto);
        actualizarTotalCarrito(); // Update the cart total
    }); 
    divProducto.appendChild(botonAgregar); // Add the button to the product div

    divProducto.addEventListener('mouseover', mostrarBotonInfo);
    divProducto.addEventListener('mouseout', ocultarBotonInfo);
    
    return divProducto; // Return the div with the product information and the button to add it to the cart
} 

function agregarAlCarrito(producto) { // Function to add a product to the cart
  
    const itemCarrito = { // Create an object that represents a cart item with the product information
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen: producto.imagen,
        cantidad: 1
    };
    carrito.push(itemCarrito); // Add the cart item to the cart array
    agregarProductoCarrito(itemCarrito); // Add the product to the cart in the interface
    carritoContainer.classList.remove('oculto');
    localStorage.setItem('carrito', JSON.stringify(carrito)); // Update the saved cart in local storage
    mostrarTotalYPedido();
}

function agregarProductoCarrito(producto) { // Function to add a product to the cart in the interface
    const carritoItem = document.createElement('div');
    carritoItem.classList.add('carrito-item');
    carritoItem.dataset.id = producto.id;
    carritoItem.innerHTML = `
    <img src="${producto.imagen}" alt="${producto.nombre}" class="carrito-item-img">
    <span>${producto.nombre}</span>
    <span class="precio-unitario">Valor unitario: $${producto.precio}</span>
    <div>
      <button class="disminuir-cantidad">-</button>
      <span class="cantidad">${producto.cantidad}</span>
      <button class="aumentar-cantidad">+</button>
    </div>
    <button class="eliminar-producto">X</button>
  `;
  carritoContainer.appendChild(carritoItem);
  // Add event listeners for the increase and decrease quantity buttons and delete product button
  carritoItem.querySelector('.aumentar-cantidad').addEventListener('click', () => aumentarCantidad(producto.id));
  carritoItem.querySelector('.disminuir-cantidad').addEventListener('click', () => disminuirCantidad(producto.id));
  carritoItem.querySelector('.eliminar-producto').addEventListener('click', () => {eliminarProducto(producto.id, carritoItem);}); 
}
        
function aumentarCantidad(id) { // Function to increase the quantity of a product in the cart
    
    const itemCarrito = carrito.find((item) => item.id === id); // Find the cart item with the provided ID
    if (itemCarrito) { // If the item is found, increase its quantity
          itemCarrito.cantidad += 1;
          if (itemCarrito.cantidad < 1) {
            eliminarProducto(id);
          } 
          actualizarCarritoEnInterfaz();
          actualizarTotalCarrito();
    }
}    

function disminuirCantidad(id) { // Function to decrease the quantity of a product in the cart
        
        const itemCarrito = carrito.find((item) => item.id === id); // Find the cart item with the provided ID
        if (itemCarrito && itemCarrito.cantidad > 1) { // If the item is found and its quantity is greater than 1, decrease its quantity
            itemCarrito.cantidad--;   
            actualizarTotalCarrito();
            actualizarCarritoEnInterfaz();// Update the cart total
        }
}
    
function eliminarProducto(id, carritoItem) { // Function to delete a product from the cart
  
    if (!carritoItem) { // If the HTML element is not found as a parameter, search for the corresponding element in the DOM
        carritoItem = carritoContainer.querySelector(`[data-id="${id}"]`);
    }
    const index = carrito.findIndex((item) => item.id === id); // Find the index of the cart item with the provided ID
    if (index !== -1) { // If the item is found, remove it from the cart array and the graphic interface
        carrito.splice(index, 1);
        carritoContainer.removeChild(carritoItem);
        mostrarTotalYPedido();
        actualizarTotalCarrito(); // Update the cart total
        if (carrito.length === 0) { // If the cart is empty, hide the "total" and "make order" elements
          carritoTotalElement.classList.add("oculto");
          if (hacerPedidoElement) {
            hacerPedidoElement.classList.add("oculto-boton");
          }
        }
        localStorage.setItem("carrito", JSON.stringify(carrito));
      }
      else {
        console.error("El objeto carrito[index] es undefined");
      }
}

function actualizarTotalCarrito() { // Function to update the cart total and save it in local storage
        // Finds the HTML element that shows the cart total
        const carritoTotalElement = document.querySelector('.carrito-total');
        let total = 0;
    
        // Calculates the total by adding the price of each item multiplied by its quantity
        carrito.forEach((item) => {
            total += item.precio * item.cantidad;
        });
    
        // Updates the text of the HTML element for the cart total
        carritoTotalElement.textContent = `Total: $${total}`;

        localStorage.setItem('carrito', JSON.stringify(carrito));

}

function inicializarCarrito() { // Loads the products from the cart saved in local storage and adds the products to the cart in the interface
      const carritoGuardado = localStorage.getItem('carrito'); // Checks if there is a cart in local storage
      if (carritoGuardado) { // If it exists, converts the stored JSON into an array of JavaScript objects
          const carritoParseado = JSON.parse(carritoGuardado);
          carrito = carritoParseado; // Assigns the saved cart to the current cart
          carritoParseado.forEach((producto) => { // Adds each product from the saved cart to the cart in the interface
              agregarProductoCarrito(producto);
          });
          carritoContainer.querySelectorAll('.aumentar-cantidad').forEach((btn, index) => {  // Add event listeners for the buttons to increase and decrease quantity and delete product
              btn.addEventListener('click', () => aumentarCantidad(carrito[index].id));
          });
          carritoContainer.querySelectorAll('.disminuir-cantidad').forEach((btn, index) => {
              btn.addEventListener('click', () => disminuirCantidad(carrito[index].id));
          });
          carritoContainer.querySelectorAll('.eliminar-producto').forEach((btn, index) => {
              btn.addEventListener('click', () => {
                  if (carrito[index]) {
                      eliminarProducto(carrito[index].id, carritoContainer.querySelector(`[data-id="${carrito[index].id}"]`));
                  }
              });
          });      
          actualizarTotalCarrito(); // Updates the cart total
          carritoContainer.classList.remove("oculto");  // Show the cart if it has items
      } else {
          carritoContainer.classList.add("oculto"); // If there are no items in the cart, hide it
      }
      mostrarTotalYPedido()
}

function mostrarTotalYPedido() {// Shows or hides the total and the "Make order" button depending on whether the cart has items or not.
        const total = document.querySelector("#total");
        const carritoTotal = document.querySelector(".carrito-total");
        const hacerPedido = document.querySelector("#hacer-pedido");
        const carritoElement = document.querySelector("#carrito");
        const carritoContainer = document.querySelector("#carrito-container");
        
      if (carrito.length > 0) {
        actualizarTotalCarrito();
        carritoTotal.classList.remove("oculto");
        hacerPedido.classList.remove("oculto");
        carritoElement.classList.remove("oculto");
        carritoContainer.classList.remove("oculto");
      } else {
        carritoTotal.classList.add("oculto");
        hacerPedido.classList.add("oculto");
        carritoElement.classList.add("oculto");
        carritoContainer.classList.add("oculto");
      }
}
    
function actualizarCarritoEnInterfaz() { // Updates the cart in the interface and shows the total and the "Make order" button.
      carritoContainer.innerHTML = "";
      carrito.forEach((producto) => {
        agregarProductoCarrito(producto);
      });
      actualizarTotalCarrito();
      mostrarTotalYPedido();
}

function mostrarBotonInfo() { // Show info button
    const botonInfo = this.querySelector('.info-btn');
    if (botonInfo) {
        botonInfo.style.visibility = 'visible';
    }
}

function ocultarBotonInfo() { // Hide info button
    const botonInfo = this.querySelector('.info-btn');
    if (botonInfo) {
        botonInfo.style.visibility = 'hidden';
    }
}

async function mostrarInfoProducto(producto) { // Show product info with a modal
  const detalles = producto.detalles_nutricionales;
  const beneficios = producto.beneficios_salud;
  const respuesta = await fetch('./json/productos.json');
  const productos = await respuesta.json();
  const indexProducto = productos.findIndex(p => p.id === producto.id);

  // Create the HTML content for the product information window
  const contenidoHTML = `
      <div class="modal fade" id="infoModal" tabindex="-1" role="dialog" aria-labelledby="infoModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <div class="d-flex align-items-center">
                <img class="img-fluid img-thumbnail" src="${productos[indexProducto].imagen}" alt="${productos[indexProducto].nombre}" style="max-width: 150px;">
                <h2 class="ml-3">${productos[indexProducto].nombre}</h2>
              </div>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <h3>Detalles nutricionales:</h3>
              <ul>
                <li>Calorías: ${detalles.calorias}</li>
                <li>Proteína: ${detalles.proteina}g</li>
                <li>Carbohidratos: ${detalles.carbohidratos}g</li>
                <li>Grasas: ${detalles.grasas}g</li>
              </ul>
              <h3>Beneficios para la salud:</h3>
              <ul>
                ${beneficios.map(b => `<li>${b}</li>`).join('')}
              </ul>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    `;

  // Remove the previous content of the modal if it exists
  const modalExistente = document.querySelector('#infoModal');
  if (modalExistente) {
    modalExistente.remove();
  }

  // Add the new HTML content to the body of the HTML
  document.body.insertAdjacentHTML('beforeend', contenidoHTML);

  // Show the modal
  $('#infoModal').modal('show');
}
  

fetch('./json/productos.json') // Load product data from JSON file
  .then(response => response.json())
  .then(productos => {
    const gridProductos = document.getElementById('grid-productos');
    productos.forEach(producto => {
      gridProductos.appendChild(crearElementoProducto(producto));
    });
    return productos; // retornar los datos de los productos
  })
  .then(producto => {
    console.log(producto); // acceso a los datos de los productos
  })
  .catch(error => console.error('Error al cargar los datos de los productos:', error));


function generarMensajeWhatsApp() { // Generate WhatsApp message
    
    let mensaje = "¡Hola! Me gustaría hacer un pedido:\n";
    carrito.forEach((producto) => {
        mensaje += `\n* ${producto.nombre} - Cantidad: ${producto.cantidad}`;
    });
    const carritoTotal = carrito.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0);
    mensaje += `\n\nTotal: $${carritoTotal}`;
    return mensaje;
}
if (hacerPedidoElement) {
    hacerPedidoElement.addEventListener("click", () => {
        const mensaje = encodeURIComponent(generarMensajeWhatsApp());
        const numeroWhatsApp = "2234219779"; // Reemplaza este número por el número de teléfono al que deseas enviar el pedido
        window.open(`https://wa.me/${numeroWhatsApp}?text=${mensaje}`, "_blank");
    });
} else {
    console.error('No se encontró el elemento ".hacer-pedido" en el DOM');
}
});    