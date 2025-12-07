const dictionary = {
    "bonjour": {
        type: "nom masculin",
        definitions: [
            {
                text: "Salutation dont on se sert pendant la journée quand on aborde quelqu'un ou qu'on le rencontre.",
                example: "Dire bonjour à quelqu'un."
            }
        ],
        synonyms: ["salut", "salutation", "bienvenue"]
    },
    "livre": {
        type: "nom masculin",
        definitions: [
            {
                text: "Assemblage de feuilles imprimées et réunies en un volume, broché ou relié.",
                example: "Lire un livre passionnant."
            },
            {
                text: "Ouvrage de l'esprit, en prose ou en vers, d'une assez longue étendue pour faire au moins un volume.",
                example: "Écrire un livre sur l'histoire."
            }
        ],
        synonyms: ["ouvrage", "bouquin", "volume", "écrit"]
    },
    "maison": {
        type: "nom féminin",
        definitions: [
            {
                text: "Bâtiment d'habitation, généralement destiné au logement d'une seule famille.",
                example: "Acheter une maison à la campagne."
            },
            {
                text: "Lieu où l'on habite, foyer domestique.",
                example: "Rentrer à la maison."
            }
        ],
        synonyms: ["demeure", "habitation", "domicile", "foyer", "logement"]
    },
    "amour": {
        type: "nom masculin",
        definitions: [
            {
                text: "Sentiment d'affection et d'attachement envers un être ou une chose.",
                example: "L'amour maternel."
            },
            {
                text: "Inclination d'une personne pour une autre, de caractère passionnel et/ou sexuel.",
                example: "Déclarer son amour à quelqu'un."
            }
        ],
        synonyms: ["affection", "tendresse", "passion", "attachement"]
    },
    "soleil": {
        type: "nom masculin",
        definitions: [
            {
                text: "Étoile autour de laquelle gravite la Terre.",
                example: "Le soleil se lève à l'est."
            },
            {
                text: "Lumière, chaleur et rayonnement de cet astre.",
                example: "Profiter du soleil sur la plage."
            }
        ],
        synonyms: ["astre", "étoile"]
    },
    "eau": {
        type: "nom féminin",
        definitions: [
            {
                text: "Liquide naturel, inodore, incolore et transparent quand il est pur.",
                example: "Boire un verre d'eau."
            },
            {
                text: "Étendue de ce liquide : mer, lac, rivière.",
                example: "Naviguer sur l'eau."
            }
        ],
        synonyms: ["flotte", "liquide"]
    },
    "temps": {
        type: "nom masculin",
        definitions: [
            {
                text: "Milieu indéfini où paraissent se dérouler les existences et les événements.",
                example: "Le temps passe vite."
            },
            {
                text: "État de l'atmosphère à un moment donné.",
                example: "Quel temps fait-il aujourd'hui ?"
            }
        ],
        synonyms: ["durée", "époque", "période", "météo"]
    },
    "ville": {
        type: "nom féminin",
        definitions: [
            {
                text: "Agglomération relativement importante et dont les habitants ont des activités professionnelles diversifiées.",
                example: "Habiter en ville."
            }
        ],
        synonyms: ["cité", "agglomération", "métropole"]
    },
    "enfant": {
        type: "nom",
        definitions: [
            {
                text: "Garçon ou fille avant l'adolescence.",
                example: "Des enfants jouent dans le parc."
            },
            {
                text: "Fils ou fille, quel que soit l'âge.",
                example: "C'est l'enfant de mes voisins."
            }
        ],
        synonyms: ["bambin", "gosse", "môme", "petit"]
    },
    "travail": {
        type: "nom masculin",
        definitions: [
            {
                text: "Activité de l'homme appliquée à la production, à la création, à l'entretien de quelque chose.",
                example: "Se rendre au travail."
            },
            {
                text: "Exercice d'une activité professionnelle.",
                example: "Chercher du travail."
            }
        ],
        synonyms: ["labeur", "ouvrage", "tâche", "besogne", "emploi"]
    }
};

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const resultsDiv = document.getElementById('results');

function normalizeText(text) {
    return text.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function searchWord() {
    const query = searchInput.value.trim();
    
    if (!query) {
        resultsDiv.innerHTML = '<p class="no-results">Veuillez entrer un mot à rechercher.</p>';
        return;
    }
    
    resultsDiv.innerHTML = '<p class="loading">Recherche en cours...</p>';
    
    setTimeout(() => {
        const normalizedQuery = normalizeText(query);
        const results = [];
        
        for (const [word, data] of Object.entries(dictionary)) {
            if (normalizeText(word).includes(normalizedQuery)) {
                results.push({ word, data });
            }
        }
        
        if (results.length === 0) {
            resultsDiv.innerHTML = `
                <p class="no-results">
                    Aucun résultat trouvé pour "<strong>${query}</strong>".<br>
                    <small style="margin-top: 10px; display: block;">
                        Mots disponibles : ${Object.keys(dictionary).join(', ')}
                    </small>
                </p>
            `;
        } else {
            resultsDiv.innerHTML = results.map(({ word, data }) => `
                <div class="word-entry">
                    <h2 class="word-title">${word}</h2>
                    <p class="word-type">${data.type}</p>
                    ${data.definitions.map((def, index) => `
                        <div class="definition">
                            <span class="definition-number">${data.definitions.length > 1 ? (index + 1) + '.' : ''}</span>
                            <span class="definition-text">${def.text}</span>
                            ${def.example ? `<p class="example">« ${def.example} »</p>` : ''}
                        </div>
                    `).join('')}
                    ${data.synonyms && data.synonyms.length > 0 ? `
                        <div class="synonyms">
                            <span class="synonyms-label">Synonymes :</span>
                            ${data.synonyms.join(', ')}
                        </div>
                    ` : ''}
                </div>
            `).join('');
        }
    }, 300);
}

searchBtn.addEventListener('click', searchWord);

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchWord();
    }
});

resultsDiv.innerHTML = `
    <p class="no-results">
        Entrez un mot dans la barre de recherche pour commencer.<br>
        <small style="margin-top: 15px; display: block; line-height: 1.6;">
            Mots disponibles dans le dictionnaire :<br>
            <strong>${Object.keys(dictionary).join(', ')}</strong>
        </small>
    </p>
`;
