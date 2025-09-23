// Dados iniciais baseados na planilha
        const initialItems = [
            {
                id: 1,
                name: "Mangá Ataque dos titãs 2 em 1 vol.1",
                price: 45,
                category: "Mangás",
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

        // Variáveis globais
        let items = JSON.parse(localStorage.getItem('giftItems')) || initialItems;
        let editingItemId = null;
        let categories = [...new Set(items.map(item => item.category))];

        // Elementos DOM
        const itemsContainer = document.getElementById('itemsContainer');
        const categoryFilter = document.getElementById('categoryFilter');
        const statusFilter = document.getElementById('statusFilter');
        const searchInput = document.getElementById('searchInput');
        const addItemBtn = document.getElementById('addItemBtn');
        const itemModal = document.getElementById('itemModal');
        const modalTitle = document.getElementById('modalTitle');
        const itemForm = document.getElementById('itemForm');
        const cancelBtn = document.getElementById('cancelBtn');
        const itemCategory = document.getElementById('itemCategory');
        const totalValue = document.getElementById('totalValue');

        // Inicialização
        document.addEventListener('DOMContentLoaded', function() {
            renderItems();
            populateCategoryFilters();
            updateTotalValue();
            
            // Event listeners
            addItemBtn.addEventListener('click', openAddModal);
            cancelBtn.addEventListener('click', closeModal);
            itemForm.addEventListener('submit', saveItem);
            categoryFilter.addEventListener('change', renderItems);
            statusFilter.addEventListener('change', renderItems);
            searchInput.addEventListener('input', renderItems);
        });

        // Função para renderizar os itens
        function renderItems() {
            const category = categoryFilter.value;
            const status = statusFilter.value;
            const searchTerm = searchInput.value.toLowerCase();
            
            // Filtrar itens
            let filteredItems = items.filter(item => {
                const matchesCategory = category === '' || item.category === category;
                const matchesStatus = 
                    status === 'todos' || 
                    (status === 'disponiveis' && !item.purchased) ||
                    (status === 'comprados' && item.purchased);
                const matchesSearch = 
                    item.name.toLowerCase().includes(searchTerm) ||
                    item.category.toLowerCase().includes(searchTerm) ||
                    (item.notes && item.notes.toLowerCase().includes(searchTerm));
                
                return matchesCategory && matchesStatus && matchesSearch;
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
                        <span class="item-category">${item.category}</span>
                        <p>${item.platform ? `Plataforma: ${item.platform}` : ''}</p>
                        ${item.notes ? `<p>${item.notes}</p>` : ''}
                        <div class="item-actions">
                            ${item.link ? `<a href="${item.link}" target="_blank" class="item-link">Ver produto</a>` : 
                                          `<span>Sem link</span>`}
                            <div>
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
            
            // Adicionar opção para nova categoria
            const newOption1 = document.createElement('option');
            newOption1.value = 'nova';
            newOption1.textContent = '+ Nova categoria';
            categoryFilter.appendChild(newOption1);
            
            const newOption2 = document.createElement('option');
            newOption2.value = 'nova';
            newOption2.textContent = '+ Nova categoria';
            itemCategory.appendChild(newOption2);
        }

        // Função para abrir modal de adição
        function openAddModal() {
            editingItemId = null;
            modalTitle.textContent = 'Adicionar Novo Item';
            itemForm.reset();
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
            let category = document.getElementById('itemCategory').value;
            const platform = document.getElementById('itemPlatform').value;
            const link = document.getElementById('itemLink').value;
            const image = document.getElementById('itemImage').value;
            const notes = document.getElementById('itemNotes').value;
            
            // Se selecionou "Nova categoria", pedir o nome
            if (category === 'nova') {
                category = prompt('Digite o nome da nova categoria:');
                if (!category) return;
                
                // Adicionar à lista de categorias se não existir
                if (!categories.includes(category)) {
                    categories.push(category);
                    populateCategoryFilters();
                }
            }
            
            if (editingItemId) {
                // Editar item existente
                const index = items.findIndex(item => item.id === editingItemId);
                if (index !== -1) {
                    items[index] = {
                        ...items[index],
                        name,
                        price,
                        category,
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

        // Tornar funções disponíveis globalmente para os event listeners
        window.togglePurchase = togglePurchase;
        window.editItem = editItem;
        window.deleteItem = deleteItem;