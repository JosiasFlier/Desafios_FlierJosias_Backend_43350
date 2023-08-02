const socket = io();

// apreton de manos, en el servidor ( app ) se llama io
// y en el cliente lo llamo socket ( index.js )

const form = document.getElementById("form");
const productsTable = document.querySelector("#productsTable");
const tbody = productsTable.querySelector("#tbody");


form.addEventListener("submit", async (evt) => {
    evt.preventDefault();

    let product = {
        title: document.querySelector("#title").value,
        description: document.querySelector("#description").value,
        price: document.querySelector("#price").value,
        code: document.querySelector("#code").value,
        category: document.querySelector("#category").value,
        stock: document.querySelector("#stock").value,
    };

    const res = await fetch("/api/products", {
        method: "POST",
        body: JSON.stringify(product),
        headers: {
            "Content-Type": "application/json",
        },
    });

    try {
        const result = await res.json();
        if (result.status === "error") {
            throw new Error(result.error);
        } else {
            const resultProducts = await fetch("/api/products");
            const results = await resultProducts.json();
            if (results.status === "error") {
                throw new Error(results.error);
            } else {
                socket.emit("updatedProducts", results.products);

                Toastify({
                    text: "New product added successfully",
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

                form.reset();
            }
        }
    } catch (error) {
        console.log(error);
    }
});

const deleteProduct = async (id) => {
    try {
        const res = await fetch(`/api/products/${id}`, { method: "DELETE"});
        const result = await res.json();
        if (result.status === "error") {
            throw new Error(result.error);
        } else {
            socket.emit("updatedProducts", result.products);

            Toastify({
                text: "Product removed successfully",
                duration: 3000,
                gravity: "top",
                position: "right",
                style: {
                    background: "linear-gradient(to right, #FF0000, #FF2100)",
                },
                onClick: function(){},
            }).showToast();
        }
    } catch (err) {
        console.log(err.message);
    }
};

socket.on("updatedProducts", (products) => {
    console.log(products);
    tbody.innerHTML = "";

    products.forEach((item) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.title}</td>
            <td>${item.description}</td>
            <td>${item.price}</td>
            <td>${item.code}</td>
            <td>${item.category}</td>
            <td>${item.stock}</td>
            <td>
                <button class="btn btn-danger" onclick="deleteProduct(${item.id})">❌</button>
            </td>
        `;
        tbody.appendChild(row);
    });
});

