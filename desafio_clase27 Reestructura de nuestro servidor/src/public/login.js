document.addEventListener('DOMContentLoaded', () => {
    const login = document.getElementById('loginForm')

    login.addEventListener('submit', async (evt) => {
        evt.preventDefault(); //No se envia el formulario por defecto

        const email = document.getElementById('email').value
        const password = document.getElementById('password').value

        try {
            const response = await fetch('/api/sessions/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            })

            const data = await response.json()

            if (response.ok) return window.location.href = "/products"
            // agregar swett alert
            alert(data.message)
            
        } catch (err) {
            res.status(500).json({ status: 'error', message: err.message })
        }
    })
})