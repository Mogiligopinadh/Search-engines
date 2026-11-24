
"use strict";

// Application directory.
// Add more application objects to expand the search engine.
const apps = [
    {
        id: 1,
        name: "ChatGPT",
        category: "AI",
        icon: "🤖",
        description: "An AI assistant for writing, learning, coding and problem solving.",
        url: "https://chatgpt.com",
        keywords: "artificial intelligence chatbot generative ai assistant"
    },
    {
        id: 2,
        name: "Google Gemini",
        category: "AI",
        icon: "✨",
        description: "An AI assistant for exploring ideas and completing tasks.",
        url: "https://gemini.google.com",
        keywords: "artificial intelligence chatbot generative ai google"
    },
    {
        id: 3,
        name: "Google",
        category: "Productivity",
        icon: "🔎",
        description: "Find websites, information, images and answers on the web.",
        url: "https://www.google.com",
        keywords: "search engine internet web information"
    },
    {
        id: 4,
        name: "YouTube",
        category: "Entertainment",
        icon: "▶️",
        description: "Explore videos, tutorials, music and educational content.",
        url: "https://www.youtube.com",
        keywords: "video streaming music tutorials entertainment"
    },
    {
        id: 5,
        name: "GitHub",
        category: "Development",
        icon: "🐙",
        description: "Host code, manage repositories and collaborate on projects.",
        url: "https://github.com",
        keywords: "programming software developer git source code"
    },
    {
        id: 6,
        name: "Visual Studio Code",
        category: "Development",
        icon: "💻",
        description: "A code editor for building websites and software.",
        url: "https://code.visualstudio.com",
        keywords: "coding html css javascript editor programming"
    },
    {
        id: 7,
        name: "freeCodeCamp",
        category: "Education",
        icon: "🎓",
        description: "Learn programming and web development through practical lessons.",
        url: "https://www.freecodecamp.org",
        keywords: "learn coding html css javascript courses"
    },
    {
        id: 8,
        name: "Coursera",
        category: "Education",
        icon: "📚",
        description: "Explore online courses and professional learning programs.",
        url: "https://www.coursera.org",
        keywords: "education online learning courses university"
    },
    {
        id: 9,
        name: "Spotify",
        category: "Entertainment",
        icon: "🎵",
        description: "Discover music, podcasts and audio content.",
        url: "https://open.spotify.com",
        keywords: "songs music podcast audio entertainment"
    },
    {
        id: 10,
        name: "Google Maps",
        category: "Productivity",
        icon: "🗺️",
        description: "Explore places, maps, directions and local businesses.",
        url: "https://maps.google.com",
        keywords: "navigation maps location directions travel"
    },
    {
        id: 11,
        name: "Canva",
        category: "Productivity",
        icon: "🎨",
        description: "Create presentations, posters, graphics and social media designs.",
        url: "https://www.canva.com",
        keywords: "design images graphics presentations posters"
    },
    {
        id: 12,
        name: "TensorFlow",
        category: "AI",
        icon: "🧠",
        description: "Build and train machine learning and neural network models.",
        url: "https://www.tensorflow.org",
        keywords: "machine learning deep learning neural networks python"
    }
];

// Get HTML elements.
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const appGrid = document.getElementById("appGrid");
const resultCount = document.getElementById("resultCount");
const resultsTitle = document.getElementById("resultsTitle");
const emptyState = document.getElementById("emptyState");
const categoryList = document.getElementById("categoryList");
const sortSelect = document.getElementById("sortSelect");
const favoritesBtn = document.getElementById("favoritesBtn");
const resetBtn = document.getElementById("resetBtn");

// Application state.
let selectedCategory = "All";
let favoritesOnly = false;
let searchTerm = "";
let sortMode = "popular";

// Read favorites safely from browser storage.
function loadFavorites() {
    try {
        const saved = JSON.parse(
            localStorage.getItem("smartFindFavorites") || "[]"
        );

        if (!Array.isArray(saved)) {
            return new Set();
        }

        return new Set(
            saved.filter(id =>
                Number.isInteger(id) &&
                apps.some(app => app.id === id)
            )
        );
    } catch (error) {
        return new Set();
    }
}

const favorites = loadFavorites();

// Save favorite IDs.
function saveFavorites() {
    try {
        localStorage.setItem(
            "smartFindFavorites",
            JSON.stringify([...favorites])
        );
    } catch (error) {
        console.warn("Favorites could not be saved in this browser.");
    }
}

// Check whether an app matches the search query.
function matchesSearch(app, query) {
    const searchableText = [
        app.name,
        app.category,
        app.description,
        app.keywords
    ].join(" ").toLowerCase();

    // Support multiple search words.
    const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);

    return words.every(word => searchableText.includes(word));
}

// Get filtered and sorted results.
function getResults() {
    let results = apps.filter(app => {
        const categoryMatches =
            selectedCategory === "All" ||
            app.category === selectedCategory;

        const textMatches = matchesSearch(app, searchTerm);

        const favoriteMatches =
            !favoritesOnly || favorites.has(app.id);

        return categoryMatches && textMatches && favoriteMatches;
    });

    if (sortMode === "az") {
        results.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortMode === "za") {
        results.sort((a, b) => b.name.localeCompare(a.name));
    }

    return results;
}

// Create text elements without inserting app content as HTML.
function createTextElement(tag, className, text) {
    const element = document.createElement(tag);
    element.className = className;
    element.textContent = text;
    return element;
}

// Build a card for one app.
function createAppCard(app) {
    const card = document.createElement("article");
    card.className = "app-card";

    const top = document.createElement("div");
    top.className = "app-top";

    const icon = createTextElement("div", "app-icon", app.icon);
    icon.setAttribute("aria-hidden", "true");

    const information = document.createElement("div");

    const title = createTextElement("h3", "app-title", app.name);
    const category = createTextElement(
        "span",
        "app-category",
        app.category
    );

    information.append(title, category);

    const favoriteButton = document.createElement("button");
    favoriteButton.type = "button";
    favoriteButton.className = "favorite-btn";

    const isFavorite = favorites.has(app.id);

    favoriteButton.classList.toggle("active", isFavorite);
    favoriteButton.textContent = isFavorite ? "♥" : "♡";
    favoriteButton.setAttribute(
        "aria-label",
        isFavorite
            ? `Remove ${app.name} from favorites`
            : `Add ${app.name} to favorites`
    );
    favoriteButton.setAttribute("aria-pressed", String(isFavorite));

    favoriteButton.addEventListener("click", () => {
        toggleFavorite(app.id);
    });

    top.append(icon, information, favoriteButton);

    const description = createTextElement(
        "p",
        "app-description",
        app.description
    );

    const actions = document.createElement("div");
    actions.className = "app-actions";

    const linkType = createTextElement(
        "span",
        "",
        "Official website"
    );

    const visitLink = createTextElement("a", "visit-btn", "Visit App ↗");
    visitLink.href = app.url;
    visitLink.target = "_blank";
    visitLink.rel = "noopener noreferrer";
    visitLink.setAttribute("aria-label", `Visit ${app.name} website`);

    actions.append(linkType, visitLink);
    card.append(top, description, actions);

    return card;
}

// Render the current results.
function renderApps() {
    const results = getResults();

    appGrid.replaceChildren();

    results.forEach(app => {
        appGrid.appendChild(createAppCard(app));
    });

    resultCount.textContent =
        `${results.length} ${results.length === 1 ? "app" : "apps"} found`;

    emptyState.hidden = results.length !== 0;
    appGrid.hidden = results.length === 0;

    if (favoritesOnly) {
        resultsTitle.textContent = "Your Favorite Apps";
    } else if (searchTerm) {
        resultsTitle.textContent = "Search Results";
    } else if (selectedCategory !== "All") {
        resultsTitle.textContent = `${selectedCategory} Applications`;
    } else {
        resultsTitle.textContent = "Popular Applications";
    }

    favoritesBtn.classList.toggle("active", favoritesOnly);
    favoritesBtn.setAttribute("aria-pressed", String(favoritesOnly));
}

// Search as the user types.
searchInput.addEventListener("input", () => {
    searchTerm = searchInput.value.trim();
    favoritesOnly = false;
    renderApps();
});

// Keep form submission working with Enter.
searchForm.addEventListener("submit", event => {
    event.preventDefault();
    searchTerm = searchInput.value.trim();
    renderApps();

    document.getElementById("results").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});

// Change selected category.
categoryList.addEventListener("click", event => {
    const button = event.target.closest("[data-category]");

    if (!button) return;

    selectedCategory = button.dataset.category;
    favoritesOnly = false;

    categoryList.querySelectorAll(".category").forEach(category => {
        const active = category === button;
        category.classList.toggle("active", active);
        category.setAttribute("aria-pressed", String(active));
    });

    renderApps();
});

// Sorting.
sortSelect.addEventListener("change", () => {
    sortMode = sortSelect.value;
    renderApps();
});

// Favorite toggle.
function toggleFavorite(id) {
    if (favorites.has(id)) {
        favorites.delete(id);
    } else {
        favorites.add(id);
    }

    saveFavorites();
    renderApps();
}

// Show only favorite apps.
favoritesBtn.addEventListener("click", () => {
    favoritesOnly = !favoritesOnly;
    renderApps();
});

// Suggested searches.
document.querySelectorAll(".suggestion").forEach(button => {
    button.addEventListener("click", () => {
        searchInput.value = button.dataset.query;
        searchTerm = button.dataset.query;
        selectedCategory = "All";
        favoritesOnly = false;

        categoryList.querySelectorAll(".category").forEach(category => {
            const active = category.dataset.category === "All";
            category.classList.toggle("active", active);
            category.setAttribute("aria-pressed", String(active));
        });

        renderApps();

        document.getElementById("results").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
});

// Clear search and filters.
function resetSearch() {
    searchInput.value = "";
    searchTerm = "";
    selectedCategory = "All";
    favoritesOnly = false;
    sortSelect.value = "popular";
    sortMode = "popular";

    categoryList.querySelectorAll(".category").forEach(category => {
        const active = category.dataset.category === "All";
        category.classList.toggle("active", active);
        category.setAttribute("aria-pressed", String(active));
    });

    renderApps();
}

resetBtn.addEventListener("click", resetSearch);

// Display current year.
document.getElementById("year").textContent = new Date().getFullYear();

// Initial display.
categoryList.querySelector('[data-category="All"]')
    .setAttribute("aria-pressed", "true");

renderApps();
