formModals2.addEventListener('submit', addProject);

async function addProject(event) {
    const authToken = localStorage.getItem("authToken")
    event.preventDefault();
    console.log("we are here ")
    console.log("event",event)

    const formData = new FormData(event.target);
    
    console.log("formData",formData)

    if (!authToken) return console.error("Aucun token d'authentification trouvé.")

    try {
        const response = await fetch(`http://localhost:5678/api/works`, {
            method: "POST",
            body: formData,
            headers: { "Authorization": `Bearer ${authToken}` }
        })

        if (response.ok) {
            console.log(`Projet est ajouté avec succès.`);
        } else {
            console.error(`Erreur: Impossible d'ajouter le projet`)
        }
    } catch (error) {
        console.error("Erreur lors de l'ajout du projet :", error)
    }
}


/////////////////////////////////////
// Prévisualisation de l'image

const previewImg = document.querySelector(".containerFile img")
const inputFile = document.querySelector(".containerFile input")
const labelFile = document.querySelector(".containerFile label")
const InconFile = document.querySelector(".containerFile .fa-image")
const pFile = document.querySelector(".containerFile p")

inputFile.addEventListener("change", () => {
    const file = inputFile.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            previewImg.src = e.target.result;
            previewImg.style.display = "flex";
            labelFile.style.display = "none";
            InconFile.style.display = "none";
            pFile.style.display = "none";
        };
        reader.readAsDataURL(file);
    }
});

// List category Select
async function displayCategoryModal() {
    const select = document.querySelector(".modalProject select");
    const categories = await getCategories();
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        select.appendChild(option);
    });
}
displayCategoryModal();

// Méthode POST pour ajouter un projet
const form = document.querySelector(".modalProject form")
const title = document.querySelector(".modalProject #title")
const category = document.querySelector(".modalProject #category")

form.addEventListener("submit", async (e) => {
    e.preventDefault()
    const authToken = localStorage.getItem("authToken")
    if (!authToken) 
        return console.error("Aucun token d'authentification trouvé.")
    const formData = new FormData(e.target);
    console.log("formData", formData)
    try {
        const response = await fetch(`http://localhost:5678/api/works`, {
            method: "POST",
            body: formData,
            headers: { "Authorization": `Bearer ${authToken}` }
        })
        if (response.ok) {
            console.log(`Projet est ajouté avec succès.`);
        } else {
            console.error(`Erreur: Impossible d'ajouter le projet`)
        }
    } catch (error) {
        console.error("Erreur lors de l'ajout du projet :", error)
    }
})