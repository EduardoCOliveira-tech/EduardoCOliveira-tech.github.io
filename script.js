// Dados iniciais baseados na planilha
        const initialItems = [
            {
                id: 1,
                name: "Mangá Ataque dos titãs 2 em 1 vol.1",
                price: 45,
                category: "Mangás",
                work: "Ataque dos Titãs",
                platform: "Amazon",
                link: "https://www.amazon.com.br/gp/product/6525905265/ref=ewc_pr_img_1?smid=A1ZZFT5FULY4LN&psc=1",
                image: "",
                notes: "Sem categoria explicita",
                purchased: false
            },
            {
                id: 2,
                name: "Mangá 20th Century Boys Definitive Edition vol.1",
                price: 60,
                category: "Mangás",
                work: "20th Century Boys",
                platform: "Amazon",
                link: "https://www.amazon.com.br/gp/product/6525933110/ref=ewc_pr_img_4?smid=A1ZZFT5FULY4LN&psc=1",
                image: "",
                notes: "Boneco/Action Figure",
                purchased: false
            },
            {
                id: 3,
                name: "Apoio para pulso redragon infernal",
                price: 50,
                category: "Acessórios",
                platform: "Amazon",
                link: "https://www.amazon.com.br/Teclado-Redragon-ID023-Infernal-Dragon/dp/B091Q8T556/ref=pd_ci_mcx_mh_mcx_views_0_title",
                image: "",
                notes: "",
                purchased: false
            },
            {
                id: 4,
                name: "Relógio Casio Vintage A138",
                price: 200,
                category: "Acessórios",
                platform: "Mercado livre",
                link: "https://produto.mercadolivre.com.br/MLB-4165923599-relogio-casio-vintage-a138-edico-limitada-original-preto-_JM?attributes=BEZEL_COLOR%3AUHJldG8%3D%2CSTRAP_COLOR%3AUHJldG8%3D&quantity=1&picker=true",
                image: "",
                notes: "",
                purchased: false
            },
            {
                id: 5,
                name: "Action Figure Link",
                price: 400,
                category: "Action Figures",
                platform: "Nin-Nin-Game",
                link: "https://www.nin-nin-game.com/en/figma/120417-figma-626-the-legend-of-zelda-tears-of-the-kingdom-link-tears-of-the-kingdom-ver-max-factory-.html",
                image: "",
                notes: "",
                purchased: false
            },
            {
                id: 6,
                name: "Funko Pop Mew",
                price: 140,
                category: "Funko Pop",
                platform: "Amazon",
                link: "https://www.amazon.com.br/Boneco-Funko-Anime-Pokemon-Mew/dp/B0CTKWRB3Z/ref=pd_rhf_se_s_pd_sbs_rvi_d_sccl_2_4/130-2668365-9571155?psc=1",
                image: "",
                notes: "",
                purchased: false
            }
        ];

        // Mangás pré-definidos
        const predefinedMangas = [
            "Ataque dos Titãs",
            "20th Century Boys",
            "A Voz do Silêncio",
            "The Promised Neverland",
            "Oshi no Ko",
            "One Piece",
            "Naruto",
            "Dragon Ball",
            "Death Note",
            "Berserk"
        ];

        // Variáveis globais
        let items = JSON.parse(localStorage.getItem('giftItems')) || initialItems;
        let mangas = JSON.parse(localStorage.getItem('mangaList')) || predefinedMangas;
        let categories = JSON.parse(localStorage.getItem('categoryList')) || [...new Set(items.map(item => item.category))];
        let editingItemId = null;

        // Elementos DOM
        const itemsContainer = document.getElementById('itemsContainer');
        const categoryFilter = document.getElementById('categoryFilter');
        const statusFilter = document.getElementById('statusFilter');
        const searchInput = document.getElementById('searchInput');
        const mangaFilterContainer = document.getElementById('mangaFilterContainer');
        const mangaFilter = document.getElementById('mangaFilter');
        const addItemBtn = document.getElementById('addItemBtn');
        const itemModal = document.getElementById('itemModal');
        const modalTitle = document.getElementById('modalTitle');
        const itemForm = document.getElementById('itemForm');
        const cancelBtn = document.getElementById('cancelBtn');
        const itemCategory = document.getElementById('itemCategory');
        const workGroup = document.getElementById('workGroup');
        const itemWork = document.getElementById('itemWork');
        const totalValue = document.getElementById('totalValue');
        const addCategoryBtn = document.getElementById('addCategoryBtn');
        const addMangaBtn = document.getElementById('addMangaBtn');
        const categoryPopup = document.getElementById('categoryPopup');
        const mangaPopup = document.getElementById('mangaPopup');
        const newCategoryName = document.getElementById('newCategoryName');
        const newMangaName = document.getElementById('newMangaName');
        const cancelCategoryBtn = document.getElementById('cancelCategoryBtn');
        const saveCategoryBtn = document.getElementById('saveCategoryBtn');
        const cancelMangaBtn = document.getElementById('cancelMangaBtn');
        const saveMangaBtn = document.getElementById('saveMangaBtn');

        // Inicialização
        document.addEventListener('DOMContentLoaded', function() {
            renderItems();
            populateCategoryFilters();
            populateMangaFilters();
            updateTotalValue();
            
            // Event listeners
            addItemBtn.addEventListener('click', openAddModal);
            cancelBtn.addEventListener('click', closeModal);
            itemForm.addEventListener('submit', saveItem);
            categoryFilter.addEventListener('change', handleCategoryFilterChange);
            statusFilter.addEventListener('change', renderItems);
            searchInput.addEventListener('input', renderItems);
            mangaFilter.addEventListener('change', renderItems);
            
            // Mostrar/ocultar campo de obra baseado na categoria selecionada
            itemCategory.addEventListener('change', function() {
                if (this.value === 'Mangás') {
                    workGroup.classList.remove('hidden');
                } else {
                    workGroup.classList.add('hidden');
                    itemWork.value = '';
                }
            });
            
            // Popups para adicionar categorias e mangás
            addCategoryBtn.addEventListener('click', openCategoryPopup);
            addMangaBtn.addEventListener('click', openMangaPopup);
            cancelCategoryBtn.addEventListener('click', closeCategoryPopup);
            saveCategoryBtn.addEventListener('click', saveNewCategory);
            cancelMangaBtn.addEventListener('click', closeMangaPopup);
            saveMangaBtn.addEventListener('click', saveNewManga);
        });

        // Função para lidar com mudanças no filtro de categoria
        function handleCategoryFilterChange() {
            if (this.value === 'Mangás') {
                mangaFilterContainer.classList.remove('hidden');
            } else {
                mangaFilterContainer.classList.add('hidden');
                mangaFilter.value = '';
            }
            renderItems();
        }

        // Função para renderizar os itens
        function renderItems() {
            const category = categoryFilter.value;
            const status = statusFilter.value;
            const searchTerm = searchInput.value.toLowerCase();
            const manga = mangaFilter.value;
            
            // Filtrar itens
            let filteredItems = items.filter(item => {
                const matchesCategory = category === '' || item.category === category;
                const matchesStatus = 
                    status === 'todos' || 
                    (status === 'disponiveis' && !item.purchased) ||
                    (status === 'comprados' && item.purchased);
                const matchesSearch = 
                    item.name.toLowerCase().includes(searchTerm) ||
                    (item.work && item.work.toLowerCase().includes(searchTerm)) ||
                    item.category.toLowerCase().includes(searchTerm) ||
                    (item.notes && item.notes.toLowerCase().includes(searchTerm));
                const matchesManga = manga === '' || item.work === manga;
                
                return matchesCategory && matchesStatus && matchesSearch && matchesManga;
            });
            
            // Limpar container
            itemsContainer.innerHTML = '';
            
            // Adicionar itens filtrados
            filteredItems.forEach(item => {
                const itemCard = document.createElement('div');
                itemCard.className = `item-card ${item.purchased ? 'comprado' : ''}`;
                
                itemCard.innerHTML = `
                    ${item.image ? `<img src="${item.image}" alt="${item.name}" class="item-image">` : 
                      `<div class="item-image" style="background-color: #ecf0f1; display: flex; align-items: center; justify-content: center;">
                         <span>Sem imagem</span>
                       </div>`}
                    <div class="item-details">
                        <h3 class="item-title">${item.name}</h3>
                        <div class="item-price">R$ ${item.price.toFixed(2)}</div>
                        <div>
                            <span class="item-category">${item.category}</span>
                            ${item.work ? `<span class="item-work">${item.work}</span>` : ''}
                        </div>
                        <p>${item.platform ? `Plataforma: ${item.platform}` : ''}</p>
                        ${item.notes ? `<p>${item.notes}</p>` : ''}
                        <div class="item-actions">
                            <div class="item-link-container">
                                ${item.link ? `<a href="${item.link}" target="_blank" class="item-link">Ver produto</a>` : 
                                              `<span>Sem link</span>`}
                            </div>
                            <div class="action-buttons">
                                <button onclick="togglePurchase(${item.id})" class="purchase-btn">
                                    ${item.purchased ? 'Desmarcar' : 'Marcar como comprado'}
                                </button>
                                <button onclick="editItem(${item.id})" class="edit-btn">Editar</button>
                                <button onclick="deleteItem(${item.id})" class="delete-btn">Excluir</button>
                            </div>
                        </div>
                    </div>
                `;
                
                itemsContainer.appendChild(itemCard);
            });
        }

        // Função para popular os filtros de categoria
        function populateCategoryFilters() {
            // Limpar opções existentes
            categoryFilter.innerHTML = '<option value="">Todas as categorias</option>';
            itemCategory.innerHTML = '<option value="">Selecione uma categoria</option>';
            
            // Adicionar categorias únicas
            categories.forEach(category => {
                const option1 = document.createElement('option');
                option1.value = category;
                option1.textContent = category;
                categoryFilter.appendChild(option1);
                
                const option2 = document.createElement('option');
                option2.value = category;
                option2.textContent = category;
                itemCategory.appendChild(option2);
            });
        }

        // Função para popular os filtros de mangá
        function populateMangaFilters() {
            // Limpar opções existentes
            mangaFilter.innerHTML = '<option value="">Todos os mangás</option>';
            itemWork.innerHTML = '<option value="">Selecione um mangá</option>';
            
            // Adicionar mangás
            mangas.forEach(manga => {
                const option1 = document.createElement('option');
                option1.value = manga;
                option1.textContent = manga;
                mangaFilter.appendChild(option1);
                
                const option2 = document.createElement('option');
                option2.value = manga;
                option2.textContent = manga;
                itemWork.appendChild(option2);
            });
        }

        // Função para abrir modal de adição
        function openAddModal() {
            editingItemId = null;
            modalTitle.textContent = 'Adicionar Novo Item';
            itemForm.reset();
            workGroup.classList.add('hidden');
            itemModal.style.display = 'flex';
        }

        // Função para fechar modal
        function closeModal() {
            itemModal.style.display = 'none';
            editingItemId = null;
        }

        // Função para salvar item (adicionar ou editar)
        function saveItem(e) {
            e.preventDefault();
            
            const name = document.getElementById('itemName').value;
            const price = parseFloat(document.getElementById('itemPrice').value);
            const category = document.getElementById('itemCategory').value;
            const work = document.getElementById('itemWork').value;
            const platform = document.getElementById('itemPlatform').value;
            const link = document.getElementById('itemLink').value;
            const image = document.getElementById('itemImage').value;
            const notes = document.getElementById('itemNotes').value;
            
            if (editingItemId) {
                // Editar item existente
                const index = items.findIndex(item => item.id === editingItemId);
                if (index !== -1) {
                    items[index] = {
                        ...items[index],
                        name,
                        price,
                        category,
                        work: category === 'Mangás' ? work : '',
                        platform,
                        link,
                        image,
                        notes
                    };
                }
            } else {
                // Adicionar novo item
                const newItem = {
                    id: Date.now(), // ID único baseado no timestamp
                    name,
                    price,
                    category,
                    work: category === 'Mangás' ? work : '',
                    platform,
                    link,
                    image,
                    notes,
                    purchased: false
                };
                
                items.push(newItem);
            }
            
            // Salvar no localStorage
            localStorage.setItem('giftItems', JSON.stringify(items));
            
            // Atualizar a interface
            renderItems();
            updateTotalValue();
            closeModal();
        }

        // Função para editar item
        function editItem(id) {
            const item = items.find(item => item.id === id);
            if (!item) return;
            
            editingItemId = id;
            modalTitle.textContent = 'Editar Item';
            
            // Preencher formulário com dados do item
            document.getElementById('itemName').value = item.name;
            document.getElementById('itemPrice').value = item.price;
            document.getElementById('itemCategory').value = item.category;
            document.getElementById('itemPlatform').value = item.platform || '';
            document.getElementById('itemLink').value = item.link || '';
            document.getElementById('itemImage').value = item.image || '';
            document.getElementById('itemNotes').value = item.notes || '';
            
            // Mostrar campo de obra se for um mangá
            if (item.category === 'Mangás') {
                workGroup.classList.remove('hidden');
                document.getElementById('itemWork').value = item.work || '';
            } else {
                workGroup.classList.add('hidden');
            }
            
            itemModal.style.display = 'flex';
        }

        // Função para excluir item
        function deleteItem(id) {
            if (confirm('Tem certeza que deseja excluir este item?')) {
                items = items.filter(item => item.id !== id);
                localStorage.setItem('giftItems', JSON.stringify(items));
                renderItems();
                updateTotalValue();
            }
        }

        // Função para alternar status de comprado
        function togglePurchase(id) {
            const item = items.find(item => item.id === id);
            if (item) {
                item.purchased = !item.purchased;
                localStorage.setItem('giftItems', JSON.stringify(items));
                renderItems();
                updateTotalValue();
            }
        }

        // Função para atualizar o valor total
        function updateTotalValue() {
            const total = items
                .filter(item => !item.purchased)
                .reduce((sum, item) => sum + item.price, 0);
            
            totalValue.textContent = total.toFixed(2);
        }

        // Funções para popups de adição de categoria e mangá
        function openCategoryPopup() {
            newCategoryName.value = '';
            categoryPopup.style.display = 'flex';
        }
        
        function closeCategoryPopup() {
            categoryPopup.style.display = 'none';
        }
        
        function saveNewCategory() {
            const categoryName = newCategoryName.value.trim();
            if (categoryName && !categories.includes(categoryName)) {
                categories.push(categoryName);
                localStorage.setItem('categoryList', JSON.stringify(categories));
                populateCategoryFilters();
                itemCategory.value = categoryName;
                closeCategoryPopup();
            } else if (categories.includes(categoryName)) {
                alert('Esta categoria já existe!');
            }
        }
        
        function openMangaPopup() {
            newMangaName.value = '';
            mangaPopup.style.display = 'flex';
        }
        
        function closeMangaPopup() {
            mangaPopup.style.display = 'none';
        }
        
        function saveNewManga() {
            const mangaName = newMangaName.value.trim();
            if (mangaName && !mangas.includes(mangaName)) {
                mangas.push(mangaName);
                localStorage.setItem('mangaList', JSON.stringify(mangas));
                populateMangaFilters();
                itemWork.value = mangaName;
                closeMangaPopup();
            } else if (mangas.includes(mangaName)) {
                alert('Este mangá já existe!');
            }
        }

        // share-manager.js
class ShareManager {
    constructor() {
        this.shareUrlElement = document.getElementById('shareUrl');
        this.copyBtn = document.getElementById('copyBtn');
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateShareUrl(); // Atualizar URL inicial
    }

    setupEventListeners() {
        this.copyBtn.addEventListener('click', () => this.copyShareUrl());
        
        // Atualizar URL quando a página for carregada com parâmetros
        window.addEventListener('load', () => {
            if (this.hasSharedData()) {
                this.showSuccessMessage('✅ Lista carregada do link compartilhado!');
            }
        });
    }

    // Codificar dados para URL (com compressão)
    encodeData(data) {
        try {
            const jsonString = JSON.stringify(data);
            // Comprimir removendo espaços desnecessários
            const compressed = jsonString.replace(/\s+/g, ' ');
            return btoa(compressed);
        } catch (error) {
            console.error('Erro ao codificar dados:', error);
            return null;
        }
    }

    // Decodificar dados da URL
    decodeData(encodedData) {
        try {
            const decoded = atob(encodedData);
            return JSON.parse(decoded);
        } catch (error) {
            console.error('Erro ao decodificar dados:', error);
            return null;
        }
    }

    // Verificar se há dados compartilhados na URL
    hasSharedData() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.has('data');
    }

    // Carregar dados da URL
    loadDataFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const encodedData = urlParams.get('data');
        
        if (encodedData) {
            const data = this.decodeData(encodedData);
            if (data && this.validateData(data)) {
                return data;
            }
        }
        return null;
    }

    // Validar estrutura dos dados
    validateData(data) {
        return data.items && Array.isArray(data.items) &&
               data.categories && Array.isArray(data.categories) &&
               data.mangas && Array.isArray(data.mangas);
    }

    // Atualizar URL de compartilhamento
    updateShareUrl(items, categories, mangas) {
        const data = {
            items: items,
            categories: categories,
            mangas: mangas,
            timestamp: new Date().getTime(),
            version: '1.0'
        };
        
        const encodedData = this.encodeData(data);
        if (encodedData) {
            const shareUrl = this.generateShareUrl(encodedData);
            this.shareUrlElement.value = shareUrl;
            
            // Atualizar URL atual sem recarregar a página
            this.updateBrowserUrl(encodedData);
        }
    }

    // Gerar URL completa para compartilhamento
    generateShareUrl(encodedData) {
        return window.location.origin + window.location.pathname + '?data=' + encodedData;
    }

    // Atualizar URL do navegador
    updateBrowserUrl(encodedData) {
        const newUrl = window.location.origin + window.location.pathname + '?data=' + encodedData;
        window.history.replaceState({ path: newUrl }, '', newUrl);
    }

    // Copiar URL para área de transferência
    async copyShareUrl() {
        try {
            await navigator.clipboard.writeText(this.shareUrlElement.value);
            this.showSuccessMessage('✅ Link copiado para a área de transferência!');
            
            // Efeito visual no botão
            this.copyBtn.textContent = '✅ Copiado!';
            setTimeout(() => {
                this.copyBtn.textContent = '📋 Copiar';
            }, 2000);
            
        } catch (err) {
            // Fallback para navegadores mais antigos
            this.fallbackCopy();
        }
    }

    // Fallback para copiar texto
    fallbackCopy() {
        this.shareUrlElement.select();
        this.shareUrlElement.setSelectionRange(0, 99999);
        document.execCommand('copy');
        this.showSuccessMessage('✅ Link copiado!');
    }

    // Mostrar mensagem de sucesso
    showSuccessMessage(message) {
        // Criar elemento de mensagem
        const messageEl = document.createElement('div');
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #2ecc71;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(messageEl);
        
        // Remover após 3 segundos
        setTimeout(() => {
            messageEl.remove();
        }, 3000);
    }

    // Limpar dados compartilhados (voltar para lista local)
    clearSharedData() {
        window.history.replaceState({}, '', window.location.pathname);
        this.shareUrlElement.value = window.location.origin + window.location.pathname;
        this.showSuccessMessage('🔁 Modo local ativado');
    }

    // Verificar se a URL é muito longa (limitação do navegador)
    isUrlTooLong() {
        return this.shareUrlElement.value.length > 2000;
    }

    // Obter estatísticas dos dados
    getDataStats(items) {
        return {
            totalItems: items.length,
            purchasedItems: items.filter(item => item.purchased).length,
            totalValue: items.filter(item => !item.purchased)
                           .reduce((sum, item) => sum + item.price, 0)
        };
    }
}

// Exportar para uso global
window.ShareManager = ShareManager;

// main.js - Código principal com integração do compartilhamento
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar gerenciador de compartilhamento
    const shareManager = new ShareManager();
    
    // Verificar se há dados compartilhados na URL
    const sharedData = shareManager.loadDataFromUrl();
    
    if (sharedData) {
        // Usar dados compartilhados
        window.items = sharedData.items;
        window.categories = sharedData.categories;
        window.mangas = sharedData.mangas;
    } else {
        // Usar dados locais
        window.items = JSON.parse(localStorage.getItem('giftItems')) || initialItems;
        window.categories = JSON.parse(localStorage.getItem('categoryList')) || [...new Set(initialItems.map(item => item.category))];
        window.mangas = JSON.parse(localStorage.getItem('mangaList')) || predefinedMangas;
    }
    
    // Inicializar interface
    renderItems();
    populateCategoryFilters();
    populateMangaFilters();
    updateTotalValue();
    
    // Atualizar URL de compartilhamento
    shareManager.updateShareUrl(items, categories, mangas);
});

// Modificar a função saveItem para atualizar o compartilhamento
function saveItem(e) {
    e.preventDefault();
    
    // ... código existente do saveItem ...
    
    // Após salvar, atualizar localStorage e URL compartilhável
    localStorage.setItem('giftItems', JSON.stringify(items));
    localStorage.setItem('categoryList', JSON.stringify(categories));
    localStorage.setItem('mangaList', JSON.stringify(mangas));
    
    // Atualizar URL de compartilhamento
    if (window.shareManager) {
        window.shareManager.updateShareUrl(items, categories, mangas);
    }
    
    renderItems();
    updateTotalValue();
    closeModal();
}

// Modificar outras funções que alteram dados
function deleteItem(id) {
    if (confirm('Tem certeza que deseja excluir este item?')) {
        items = items.filter(item => item.id !== id);
        localStorage.setItem('giftItems', JSON.stringify(items));
        
        // Atualizar URL de compartilhamento
        if (window.shareManager) {
            window.shareManager.updateShareUrl(items, categories, mangas);
        }
        
        renderItems();
        updateTotalValue();
    }
}

function togglePurchase(id) {
    const item = items.find(item => item.id === id);
    if (item) {
        item.purchased = !item.purchased;
        localStorage.setItem('giftItems', JSON.stringify(items));
        
        // Atualizar URL de compartilhamento
        if (window.shareManager) {
            window.shareManager.updateShareUrl(items, categories, mangas);
        }
        
        renderItems();
        updateTotalValue();
    }
}

        // Tornar funções disponíveis globalmente para os event listeners
        window.togglePurchase = togglePurchase;
        window.editItem = editItem;
        window.deleteItem = deleteItem;

