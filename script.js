let allData = [];
const cardsContainer = document.querySelector('.cards-container');
const campoBusca = document.getElementById('campo-busca');
const botaoBusca = document.getElementById('botao-busca');
const clearSearchBtn = document.getElementById('clear-search-btn');

async function fetchData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        allData = await response.json();
        displayCards(allData);
    } catch (error) {
        console.error("Não foi possível carregar os dados:", error);
        cardsContainer.innerHTML = "<p>Erro ao carregar conteúdo. Tente recarregar a página.</p>";
    }
}

function displayCards(data, termoBusca = '') {
    cardsContainer.innerHTML = '';
    if (data.length === 0) {
        cardsContainer.innerHTML = '<p class="no-results">Nenhum resultado encontrado.</p>';
        return;
    }

    data.forEach(item => {
        const card = document.createElement('article');
        
        // Função para destacar o termo de busca
        const highlight = (text) => {
            if (!termoBusca || !text) return text;
            const regex = new RegExp(`(${termoBusca})`, 'gi');
            return text.replace(regex, '<mark>$1</mark>');
        };

        const imagemHtml = item.imagem 
            ? `<img src="${item.imagem}" alt="Imagem ilustrativa sobre ${item.nome}" class="card-imagem">` 
            : '';

        let content = `
            ${imagemHtml}
            <h2 class="card-titulo">${highlight(item.nome)}</h2>
            <p>${highlight(item.descricao)}</p>
            <h3>Exemplos</h3>
            <p class="exemplo-texto"><strong>${highlight(item.exemplo)}</strong></p>
            <h3>Dica Prática</h3>
            <blockquote>${highlight(item.dica_pratica)}</blockquote>
        `;

        card.innerHTML = content;
        cardsContainer.appendChild(card);
    });
}

function iniciarBusca() {
    const termoBusca = campoBusca.value.toLowerCase();

    if (!termoBusca.trim()) {
        displayCards(allData); // Se a busca estiver vazia, mostra todos os cards
        return;
    }

    const resultados = allData.filter(item => 
        (item.nome && item.nome.toLowerCase().includes(termoBusca)) ||
        (item.descricao && item.descricao.toLowerCase().includes(termoBusca)) ||
        (item.exemplo && item.exemplo.toLowerCase().includes(termoBusca)) ||
        (item.dica_pratica && item.dica_pratica.toLowerCase().includes(termoBusca))
    );
    displayCards(resultados, termoBusca);
}

// Adiciona o evento de clique ao botão de busca
botaoBusca.addEventListener('click', iniciarBusca);

// Adiciona a funcionalidade de buscar ao pressionar a tecla "Enter"
campoBusca.addEventListener('keyup', (event) => {
    // Mostra ou esconde o botão de limpar
    clearSearchBtn.style.display = campoBusca.value ? 'block' : 'none';

    // Se o usuário pressionar Enter, a busca é iniciada
    if (event.key === 'Enter') {
        iniciarBusca();
    } 
    // Se o campo de busca ficar vazio, exibe todos os cards novamente
    else if (campoBusca.value.trim() === '') {
        displayCards(allData); // Mostra todos os dados sem destaque
    }
});

// Funcionalidade do botão de limpar busca
clearSearchBtn.addEventListener('click', () => {
    campoBusca.value = '';
    clearSearchBtn.style.display = 'none';
    displayCards(allData);
    campoBusca.focus(); // Devolve o foco ao campo de busca
});

fetchData();