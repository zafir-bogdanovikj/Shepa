function initShop(config) {
    const { items, themeColor, storageKey, petType } = config;
    const CUSTOM_NAME_FEE = 300;
    const SHIPPING_FEE = 300;

    let selectedItem = null;
    let selectedSizeObj = null;
    let justAdded = false;
    let packageItems = JSON.parse(localStorage.getItem(storageKey)) || [];

    document.addEventListener('DOMContentLoaded', () => {
        // Динамичко чистење на другите кошнички за да нема мешање на производите
        const allCartKeys = ['cart_cat', 'cart_dog', 'cart_parrot'];
        allCartKeys
            .filter(key => key !== storageKey)
            .forEach(key => localStorage.removeItem(key));

        renderItemButtons();
        renderPackageContent();

        requestAnimationFrame(() => requestAnimationFrame(() => {
            document.querySelector('.package-wrapper')?.classList.add('ready');
        }));

        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                if (packageItems.length >= 3) {
                    checkoutBtn.disabled = true;
                    document.querySelector('.package-wrapper')?.classList.remove('open');
                    setTimeout(() => {
                        window.location.href = `confirmation.html?pet=${petType}`;
                    }, 700);
                }
            });
        }
    });

    // Кога корисникот се враќа назад од confirmation страната
    window.addEventListener('pageshow', (e) => {
        if (e.persisted) renderPackageContent();
    });

    function renderItemButtons() {
        const container = document.getElementById('items-container');
        if (!container) return;

        container.style.display = 'flex';
        container.style.flexWrap = 'wrap';
        container.style.gap = '12px';
        container.style.justifyContent = 'center';
        container.innerHTML = '';

        let drawer = document.getElementById('item-options-drawer');
        if (!drawer) {
            drawer = document.createElement('div');
            drawer.id = 'item-options-drawer';
            drawer.style.width = '100%';
            drawer.style.display = 'none';
        }

        items.forEach((item) => {
            const btn = document.createElement('button');
            btn.className = 'item-btn';
            btn.type = 'button';
            btn.innerHTML = `${item.svg} <span>${item.name}</span>`;

            btn.addEventListener('click', () => {
                if (selectedItem?.id === item.id) {
                    drawer.style.display = 'none';
                    btn.classList.remove('active');
                    selectedItem = null;
                    return;
                }

                document.querySelectorAll('.item-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                selectedItem = item;
                selectedSizeObj = null;

                const allButtons = Array.from(container.querySelectorAll('.item-btn'));
                const clickedTop = btn.offsetTop;
                const sameRowButtons = allButtons.filter(b => Math.abs(b.offsetTop - clickedTop) < 10);
                const lastButtonInRow = sameRowButtons[sameRowButtons.length - 1];

                if (lastButtonInRow) {
                    lastButtonInRow.after(drawer);
                } else {
                    container.appendChild(drawer);
                }

                drawer.style.display = 'block';
                renderDrawerContent(item, drawer);
                drawer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            });

            container.appendChild(btn);
        });
    }

    function renderDrawerContent(item, drawer) {
        drawer.innerHTML = `
            <div class="inline-size-section" style="margin: 12px 0; padding: 16px; border-radius: 8px; text-align: center; width: 100%; box-sizing: border-box;">
                <p style="margin-bottom: 8px; font-weight: bold;">Избери големина за ${item.name}:</p>
                <div class="drawer-sizes-grid" style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;"></div>
                <div class="drawer-custom-section"></div>
            </div>
        `;

        const sizesGrid = drawer.querySelector('.drawer-sizes-grid');

        item.sizes.forEach(sizeObj => {
            const btn = document.createElement('button');
            btn.className = 'size-btn';
            btn.type = 'button';
            btn.innerText = `${sizeObj.name} - ${sizeObj.price} ден.`;

            btn.addEventListener('click', () => {
                selectedSizeObj = sizeObj;
                sizesGrid.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const customContainer = drawer.querySelector('.drawer-custom-section');
                if (item.hasCustomNameOption) {
                    renderDrawerCustomName(item, customContainer);
                } else {
                    addItemToPackage(item, sizeObj, null);
                    drawer.style.display = 'none';
                }
            });

            sizesGrid.appendChild(btn);
        });
    }

    function renderDrawerCustomName(item, container) {
        container.innerHTML = `
            <div class="custom-name-glass-card">
                <div class="custom-name-header">
                    <h4>Персонализација</h4>
                    <p>Додадете уникатно име извезено на производот</p>
                </div>
                
                <div class="custom-options-grid">
                    <div class="glass-option-card active" data-value="no">
                        <span class="option-title">Без име</span>
                    </div>
                    <div class="glass-option-card" data-value="yes">
                        <span class="option-title">Со име (+${CUSTOM_NAME_FEE} ден.)</span>
                    </div>
                </div>

                <div class="glass-input-wrapper" style="display: none;">
                    <input type="text" class="custom-name-input" placeholder="Внесете го името..." maxlength="20">
                </div>

                <button type="button" class="confirm-add-btn glass-submit-btn" style="background-color: ${themeColor};">
                    Додади во пакет
                </button>
            </div>
        `;

        const optionCards = container.querySelectorAll('.glass-option-card');
        const inputWrapper = container.querySelector('.glass-input-wrapper');
        const nameInput = container.querySelector('.custom-name-input');
        const confirmBtn = container.querySelector('.confirm-add-btn');

        let isCustomSelected = false;

        optionCards.forEach(card => {
            card.addEventListener('click', () => {
                optionCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');

                if (card.dataset.value === 'yes') {
                    isCustomSelected = true;
                    inputWrapper.style.display = 'block';
                    setTimeout(() => nameInput.focus(), 100);
                } else {
                    isCustomSelected = false;
                    inputWrapper.style.display = 'none';
                    nameInput.value = '';
                }
            });
        });

        confirmBtn.addEventListener('click', () => {
            const customName = isCustomSelected ? nameInput.value.trim() : null;
            addItemToPackage(item, selectedSizeObj, customName);
            document.getElementById('item-options-drawer').style.display = 'none';
        });
    }

    function addItemToPackage(item, sizeObj, customName) {
        packageItems.push({
            name: item.name,
            svg: item.svg,
            size: sizeObj.name,
            basePrice: sizeObj.price,
            customName: customName,
            customPrice: customName ? CUSTOM_NAME_FEE : 0
        });

        justAdded = true;
        renderPackageContent();
        document.querySelectorAll('.item-btn, .size-btn').forEach(b => b.classList.remove('active'));
        selectedItem = null;
        selectedSizeObj = null;
    }

    function renderPackageContent() {
        const packageHeader = document.querySelector('.package-header') || document.getElementById('package-header');
        const packageContent = document.getElementById('package-content');
        const totalPriceEl = document.getElementById('total-price');
        const checkoutBtn = document.getElementById('checkout-btn');

        localStorage.setItem(storageKey, JSON.stringify(packageItems));

        // Машната се тргнува кога има барем една ставка
        const packageWrapper = document.querySelector('.package-wrapper');
        if (packageWrapper) packageWrapper.classList.toggle('open', packageItems.length > 0);

        if (packageHeader) {
            packageHeader.innerHTML = `Пакет + достава ${SHIPPING_FEE} ден.`;
        }

        if (!packageContent || !totalPriceEl) return;

        packageContent.innerHTML = '';
        let total = packageItems.length > 0 ? SHIPPING_FEE : 0;

        packageItems.forEach((item, index) => {
            total += item.basePrice + item.customPrice;

            const card = document.createElement('div');
            card.className = 'package-item-card';
            if (justAdded && index === packageItems.length - 1) {
                card.classList.add('just-added');
            }
            const sizeText = item.size ? ` (${item.size})` : '';

            card.innerHTML = `
                <div class="card-info">
                  ${item.svg}
                  <div>
                    <div><strong>${item.name}</strong>${sizeText} - ${item.basePrice} ден.</div>
                    ${item.customName ? `<div style="font-size: 0.9em; opacity: 0.85; margin-top: 2px;">+ персонализација "${item.customName}" - ${item.customPrice} ден.</div>` : ''}
                  </div>
                </div>
                <button type="button" class="remove-btn">✕</button>
            `;

            card.querySelector('.remove-btn').addEventListener('click', () => {
                packageItems.splice(index, 1);
                renderPackageContent();
            });

            packageContent.appendChild(card);
        });

        justAdded = false;

        totalPriceEl.innerText = `Вкупно: ${total} ден.`;

        if (checkoutBtn) {
            checkoutBtn.disabled = packageItems.length < 3;
        }
    }
}