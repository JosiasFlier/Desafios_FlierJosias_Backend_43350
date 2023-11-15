const addProductToCart = async (id, cartId) => {
    try {
        const res = await fetch(`/api/carts/${cartId}/products/${id}`, {
            method: "POST",
        });
        const result = await res.json();
        if (result.status === "error") {
            throw new Error(result.error);
        } else {
            // Mostrar una notificación de éxito utilizando "Toastify"
            Toastify({
                text: "producto agregado con exito",
                duration: 3000,
                gravity: "top",
                position: "right",
                style: {
                    backgroundImage:
                        "linear-gradient(to right, #0AD100, #37B300)",
                    backgroundColor: "#37B300",
                },
                onClick: function () {},
            }).showToast();
        }
    } catch (err) {
        console.log(err.message);
    }
};



const addProductToCart2 = async (pid, cartId) => {
    try {
        console.log(cartId)
        const res = await fetch(`/api/carts/${cartId}/products/${pid}`, {
            method: "POST",
        });
        const result = await res.json();
        if (result.status === "error") {
            throw new Error(result.error);
        } else {

            console.log(result, res, cartId)
            // Mostrar una notificación de éxito utilizando "Toastify"
            Toastify({
                text: "producto agregado con exito",
                duration: 3000,
                gravity: "top",
                position: "right",
                style: {
                    backgroundImage:
                        "linear-gradient(to right, #0AD100, #37B300)",
                    backgroundColor: "#37B300",
                },
                onClick: function () {},
            }).showToast();
        }
    } catch (err) {
        console.log(err.message);
    }
};