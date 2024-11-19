// Variables globales
const gallery = document.querySelector("#project");
const filters = document.querySelector(".filters");
const editDiv = document.querySelector('.edit');
const editSection = document.getElementById('editSection');

// Appel API pour obtenir les œuvres
async function getWorks() {
    try {
        const response = await fetch("http://localhost:5678/api/works");
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching works:', error);
        return [];
    }
}

// Chargement et affichage des œuvres
async function loadAndDisplayWorks() {
    const works = await getWorks();
    displayWorks(works);
}

// Afficher Works 
function displayWorks(worksArray) {
    gallery.innerHTML = "";
    if (worksArray.length === 0) {
        gallery.innerHTML = "<p>Aucun projet à afficher</p>";
    } else {
        worksArray.forEach(work => {
            const figure = document.createElement("figure");
            const img = document.createElement("img");
            const figcaption = document.createElement("figcaption");
            img.src = work.imageUrl;
            figcaption.textContent = work.title;
            figure.appendChild(img);
            figure.appendChild(figcaption);
            gallery.appendChild(figure);
        });
    }
}

// Afficher boutons catégories 
async function getCategories() {
    const response = await fetch("http://localhost:5678/api/categories");
    return await response.json();
}

async function displayCategoriesBtn() {
    filters.innerHTML = "";
    if (localStorage.getItem('authToken')) {
        return;
    }
    const categories = await getCategories();
    const allBtn = document.createElement("button");
    allBtn.textContent = "Tous";
    allBtn.id = "0";
    filters.appendChild(allBtn);
    categories.forEach((category) => {
        const btn = document.createElement("button");
        btn.textContent = category.name;
        btn.id = category.id;
        filters.appendChild(btn);
        btn.addEventListener("click", async () => {
            await filterWorks(category.id);
        });
    });

    allBtn.addEventListener("click", async () => {
        await loadAndDisplayWorks();
    });
}

//Filtrer par catégories 
async function filterWorks(categoryId) {
    const works = await getWorks();
    if (categoryId === "0") {
        displayWorks(works);
    } else {
        const filteredWorks = works.filter(work => work.categoryId == categoryId);
        displayWorks(filteredWorks);
    }
}

// Gestion de la connexion/déconnexion
document.addEventListener('DOMContentLoaded', async () => {
    const authButton = document.getElementById('auth-button');
    await displayCategoriesBtn();
    await loadAndDisplayWorks();
    updateAuthUI(authButton);

    authButton.onclick = event => {
        event.preventDefault();
        if (localStorage.getItem('authToken')) {
            logout();
        } else {
            window.location.href = 'login.html';
        }
    };
});

// Met à jour l'interface utilisateur en fonction de l'état de connexion
function updateAuthUI(authButton) {
    if (localStorage.getItem('authToken')) {
        authButton.textContent = 'Logout';
        editDiv.classList.remove('hidden');
        editSection.classList.remove('hidden');
    } else {
        authButton.textContent = 'Login';
        editDiv.classList.add('hidden');
        editSection.classList.add('hidden');
    }
}

// Gérer la déconnexion
async function logout() {
    localStorage.removeItem('authToken');
    updateAuthUI(document.getElementById('auth-button'));
    await displayCategoriesBtn();
    await loadAndDisplayWorks();
}











