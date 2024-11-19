// Variables
const email = document.querySelector("form #email");
const password = document.querySelector("form #password");
const form = document.querySelector("form");
const errorMessage = document.querySelector(".loginSection p");

// Fonction de connexion 
async function loginUser() {
    try {
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email.value,
                password: password.value
            })
        })
        if (!response.ok) {
            throw new Error("Erreur de connexion")
        }

        const data = await response.json()
        console.log("Utilisateur connecté :", data)
        if (data.token) {
            localStorage.setItem('authToken', data.token)
        } else {
            throw new Error("Token manquant dans la réponse")
        }
        window.location.href = "index.html"
    } catch (error) {
        console.error("Erreur:", error);
        errorMessage.textContent = "Erreur de connexion. Veuillez vérifier vos identifiants."
    }
}

// Gestion de l'envoi du formulaire 
form.addEventListener("submit", (event) => {
    event.preventDefault()
    loginUser()
})

