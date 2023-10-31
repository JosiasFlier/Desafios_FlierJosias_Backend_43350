// Establecer una conexión con el servidor a través de WebSocket
const socket = io();

// Evento "submit" del formulario para agregar un nuevo producto
const form = document.getElementById("form");
const productsTable = document.querySelector("#productsTable");
const tbody = productsTable.querySelector("#tbody");

form.addEventListener("submit", async (evt) => {
    evt.preventDefault();

    // Recolectar los datos del formulario para crear un nuevo producto
    let product = {
        title: document.querySelector("#title").value,
        description: document.querySelector("#description").value,
        price: document.querySelector("#price").value,
        code: document.querySelector("#code").value,
        category: document.querySelector("#category").value,
        stock: document.querySelector("#stock").value,
    };

    try {
        // Enviar el producto al servidor mediante una solicitud POST a la API REST
        const res = await fetch("/api/products", {
            method: "POST",
            body: JSON.stringify(product),
            headers: {
                "Content-Type": "application/json",
            },
        });

        // Obtener la respuesta del servidor en formato JSON
        const result = await res.json();
        if (result.status === "error") {
            throw new Error(result.error);
        } else {
            // Si el producto se agrega con éxito, actualizar la lista de productos en la tabla
            const resultProducts = await fetch("/api/products");
            const results = await resultProducts.json();
            if (results.status === "error") {
                throw new Error(results.error);
            } else {
                // Emitir un evento al servidor para notificar la actualización de productos
                socket.emit("updatedProducts", results.products);

                // Mostrar una notificación de éxito utilizando la librería "Toastify"
                Toastify({
                    text: "New product added successfully",
                    duration: 3000,
                    gravity: "top",
                    position: "right",
                    style: {
                        backgroundImage: "linear-gradient(to right, #0AD100, #37B300)",
                        backgroundColor: "#37B300",
                    },
                    onClick: function () {},
                }).showToast();

                // Limpiar los campos del formulario
                form.reset();
            }
        }
    } catch (error) {
        console.log(error);
    }
});

// Función para eliminar un producto mediante una solicitud DELETE al servidor
const deleteProduct = async (id) => {
    try {
        const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
        const result = await res.json();
        if (result.status === "error") {
            throw new Error(result.error);
        } else {
            // Emitir un evento al servidor para notificar la actualización de productos
            socket.emit("updatedProducts", result.products);

            // Mostrar una notificación de éxito utilizando "Toastify"
            Toastify({
                text: "Product removed successfully",
                duration: 3000,
                gravity: "top",
                position: "right",
                style: {
                    background: "linear-gradient(to right, #FF0000, #FF2100)",
                },
                onClick: function () {},
            }).showToast();
        }
    } catch (err) {
        console.log(err.message);
    }
};

// Escuchar el evento "updatedProducts" enviado por el servidor cuando se agregan o eliminan productos
socket.on("updatedProducts", (products) => {
    console.log(products);
    // Limpiar la tabla antes de actualizarla
    tbody.innerHTML = "";

    // Actualizar la tabla con los nuevos productos recibidos
    products.forEach((item) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.title}</td>
            <td><img src="${item.thumbnails[0]}" style="max-width: 60px;"></td>
            <td>${item.description}</td>
            <td>${item.price}</td>
            <td>${item.code}</td>
            <td>${item.category}</td>
            <td>${item.stock}</td>
            <td>
                <button class="btn btn-danger" onclick="deleteProduct('${item._id}')">❌</button>
            </td>
        `;
        tbody.appendChild(row);
    });
});


