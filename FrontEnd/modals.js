// variables
const modalContainer = document.querySelector('.modals');
const closeModalButton = document.querySelector('.fa-xmark');
const modals = document.querySelector('.modals')
const projectModal = document.querySelector(".modalProject")
const btnAddModal = document.querySelector(".modalProject button")
const modalAddProject = document.querySelector(".containerModals2")
const modalProjects = document.querySelector(".modalProject")
const arrowLeft = document.querySelector(".fa-arrow-left")
const xmarkAdd = document.querySelector(".containerModals2 .fa-xmark")
const formModals2 = document.querySelector('.formModals2');

// Afficher la modale
editSection.onclick = () => {
    modalContainer.classList.remove('hidden')
};

// Fermer la modale
closeModalButton.onclick = () => {
    modalContainer.classList.add('hidden')
};

modalContainer.addEventListener('click', (event) => {
    if (event.target === modalContainer) {
        modalContainer.classList.add('hidden')
    }
});


//Fonction pour afficher les projets dans la modal
async function displayProjectModal() {
    const modalProjects = document.querySelector(".projectModal");
    modalProjects.innerHTML = "";
    const projects = await getWorks();

    // Vérifier si des projets sont récupérés
    if (!projects || !Array.isArray(projects) || projects.length === 0) {
        console.log("Aucun projet trouvé");
        return;
    }

    // Afficher chaque projet
    projects.forEach(project => {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        const span = document.createElement("span");
        const trash = document.createElement("i");
        trash.classList.add("fa-solid", "fa-trash-can");
        trash.id = project.id;
        img.src = project.imageUrl;

        span.appendChild(trash);
        figure.appendChild(span);
        figure.appendChild(img);
        modalProjects.appendChild(figure);
    });
    DeleteProject();
}
displayProjectModal();

// Fonction pour supprimer un projet
function DeleteProject() {
    const trashAll = document.querySelectorAll(".fa-trash-can");
    trashAll.forEach(trash => {
        trash.addEventListener("click", async (e) => {
            const id = trash.id;
            const authToken = localStorage.getItem('authToken');
            const init = {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authToken}`
                },
            };
            try {
                const response = await fetch(`http://localhost:5678/api/works/${id}`, init);

                if (!response.ok) {
                    let errorMessage = `La suppression a échoué : ${response.status}`;
                    if (response.status !== 204) {
                        const errorData = await response.text();
                        if (errorData) {
                            errorMessage += ` - ${errorData}`;
                        }
                    }
                    throw new Error(errorMessage);
                }
                if (response.status === 204) {
                    console.log("La suppression a réussi.");
                } else {
                    const data = await response.json();
                    console.log("La suppression a réussi, voici la data :", data);
                }
                await loadAndDisplayWorks();
                displayProjectModal();
            } catch (error) {
                console.error("Erreur lors de la suppression :", error);
            }
        });
    });
}
// Afficher modale 2
function displayAddModal() {
    btnAddModal.addEventListener("click", () => {
        modalAddProject.style.display = "flex"
        modalProjects.style.display = "none"
    })
    arrowLeft.addEventListener("click", () => {
        modalAddProject.style.display = "none"
        modalProjects.style.display = "flex"
    })
    xmarkAdd.addEventListener("click", () => {
        modals.style.display = "none"
    })
}
displayAddModal()

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
    formModals2.addEventListener('submit', addProject);
}
displayCategoryModal();

// Méthode POST pour ajouter un projet
async function addProject(event) {
    const authToken = localStorage.getItem("authToken");
    event.preventDefault();
    console.log("we are here ");
    console.log("event", event);

    const formData = new FormData(event.target);
    console.log("formData", formData);

    if (!authToken) return console.error("Aucun token d'authentification trouvé.");

    try {
        const response = await fetch(`http://localhost:5678/api/works`, {
            method: "POST",
            body: formData,
            headers: { "Authorization": `Bearer ${authToken}` },
        });

        if (response.ok) {
            console.log(`Projet est ajouté avec succès.`);
            event.target.reset();
            const modal2 = document.querySelector(".containerModals2");
            if (modal2) {
                modal2.style.display = "none";
            }
            const modal1 = document.querySelector(".modals");
            if (modal1) {
                modal1.classList.add("hidden");
            }
            window.location.reload();
        } else {
            console.error(`Erreur: Impossible d'ajouter le projet`);
        }
    } catch (error) {
        console.error("Erreur lors de l'ajout du projet :", error);
    }
}

const submitButton = document.getElementById('submitBtn');
const fileInput = document.getElementById('file');
const titleInput = document.getElementById('title');
const categoryInput = document.getElementById('category');

// Fonction pour vérifier si tous les champs sont remplis
function checkFormCompletion() {
    const isFormValid = fileInput.files.length > 0 && 
                        titleInput.value.trim() !== "" && 
                        categoryInput.value.trim() !== "";

    if (isFormValid) {
        submitButton.disabled = false;
        submitButton.style.backgroundColor = '#1D6154';
    } else {
        submitButton.disabled = true;
        submitButton.style.backgroundColor = '';
    }
}

fileInput.addEventListener('change', checkFormCompletion);
titleInput.addEventListener('input', checkFormCompletion);
categoryInput.addEventListener('change', checkFormCompletion);

checkFormCompletion();









