const deleteProduct = async (id) => {

    const cartId = window.location.pathname.match(/\/products\/carts\/(.+)/)[1];
    try {
        const res = await fetch(`/api/carts/${cartId}/products/${id}`, { method: "DELETE" })
        const result = await res.json();

        console.log(result)
        if (result.status === "error") {
            throw new Error(result.error);
        } else {

            // Mostrar una notificación de éxito utilizando "Toastify"
            Toastify({
                text: "Producto eliminado del carrito",
                duration: 3000,
                gravity: "top",
                position: "right",
                style: {
                    background: "linear-gradient(to right, #FF0000, #FF2100)",
                },
                onClick: function () {},
            }).showToast();
        }
        
        //  Reload (Actualizar Carrito)
        setTimeout(() => {
            location.reload() 
        }, 1500);
        
        
    } catch (err) {
        console.log(err.message);
    }
}

const deleteCart = async () => {

    const cartId = window.location.pathname.match(/\/products\/carts\/(.+)/)[1];
    try {
        const res = await fetch(`/api/carts/${cartId}`, { method: "DELETE" })
        const result = await res.json();

        console.log(result)
        if (result.status === "error") {
            throw new Error(result.error);
        } else {

            // Mostrar una notificación de éxito utilizando "Toastify"
            Toastify({
                text: "Todos los productos eliminados",
                duration: 3000,
                gravity: "top",
                position: "right",
                style: {
                    background: "linear-gradient(to right, #FF0000, #FF2100)",
                },
                onClick: function () {},
            }).showToast();
        }
        
        //  Reload (Actualizar Carrito)
        setTimeout(() => {
            location.reload() 
        }, 1500);
        
        
    } catch (err) {
        console.log(err.message);
    }
}

//Evento para finalizar compra
document.addEventListener('DOMContentLoaded', () => {
    const purchase = document.getElementById('purchase');

    if (purchase) {
        const cartId = purchase.getAttribute('data-cart');

        purchase.addEventListener('click', async () => {
            console.log(cartId);
            try {
                const response = await fetch(`/api/carts/${cartId}/purchase`, {
                    method: 'GET'
                });

                if (response.ok) {
                    const data = await response.json(); //Traigo los datos de la compra

                    console.log(data)
                    displayPurchaseAlert(data); //Mensaje con los datos de la compra
                    
                    setTimeout(() => {
                        location.reload() 
                    }, 5000);

                } else {
                    const errorMessage = await response.text(); // Obtener el mensaje de error del cuerpo de la respuesta
                    displayErrorAlert(errorMessage);
                }
            } catch (err) {
                console.log('Error en el proceso de compra', err);
            }
        });
    }
});

//Alerta de agradecimiento
function displayThanksAlert() {
    Swal.fire({
        title: '¡¡Muchas Gracias!!',
        icon: 'success'
    });
}

//Funcion cuando a todos los productos le faltan stock
function displayErrorAlert(errorMessage) {
    Swal.fire({
        title: 'Error en la compra',
        text: 'No se pudo realizar la compra por faltante de stock en todos los productos seleccionados',
        icon: 'error'
    });
}

//Funcion con datos de la compra
function displayPurchaseAlert(data) {
    // Obtener la información necesaria para el SweetAlert
    const purchasedProducts = data.purchasedProducts;
    const unprocessedProducts = data.unprocessedProducts;
    const ticketNumber = data.ticket ? data.ticket._id : 'N/A';
    const ticketAmount = data.ticket ? data.ticket.amount : 'N/A';

    // Crear el contenido del SweetAlert, 
    // Se imprimen los datos de la compra y los productos q no se pudieron comprar
    const alertContent = `
        <div>
            <p>Productos comprados:</p>
            <ul>
                ${purchasedProducts.map(product => `<li>${product.product.title} - Cantidad: ${product.quantity}</li>`).join('')}
            </ul>
            <p>Monto total: $${ticketAmount}</p>
            <p>N° de ticket: ${ticketNumber}</p>
            ${unprocessedProducts.length > 0 ? `<p>Productos no facturados por faltante de stock:</p>
                <ul>
                    ${unprocessedProducts.map(product => `<li>${product.product.title} - Cantidad solicitada: ${product.quantity}</li>`).join('')}
                </ul>` : ''}
        </div>
    `;

    // Mostrar el SweetAlert
    Swal.fire({
        title: 'Compra realizada con éxito',
        html: alertContent,
        icon: 'success'
    });
}
