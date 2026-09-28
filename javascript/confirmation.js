// document.addEventListener('DOMContentLoaded', () => {
//     // 1. Иницијализација на EmailJS со твојот Public Key (од Account -> API Keys)
//     // Замени го ТВОЈОТ_PUBLIC_KEY со вистинскиот код од EmailJS!
//     emailjs.init("mtacIkdpgtrxlHZ1Q");
//
//     // Читање на типот на миленик
//     const urlParams = new URLSearchParams(window.location.search);
//     const petRaw = urlParams.get('pet') || localStorage.getItem('selectedPetType') || 'dog';
//
//     // Мапирање за убав приказ на македонски
//     const petNames = {
//         'dog': 'куче',
//         'cat': 'мачка',
//         'parrot': 'папагал'
//     };
//     const petInMacedonian = petNames[petRaw] || petRaw;
//
//     // Тематски бои во зависност од типот на миленик
//     const petColors = {
//         'dog': '#634848',
//         'cat': '#D5C8B4',
//         'parrot': '#5B82A6'
//     };
//
//     if (petRaw && petColors[petRaw]) {
//         document.documentElement.style.setProperty('--theme-color', petColors[petRaw]);
//     }
//
//     const form = document.getElementById('order-form');
//     if (form) {
//         form.addEventListener('submit', (e) => {
//             e.preventDefault();
//
//             // Земање на сите елементи од формата
//             const nameInput = document.getElementById('fullName');
//             const emailInput = document.getElementById('email');
//             const phoneInput = document.getElementById('phone');
//             const addressInput = document.getElementById('address');
//
//             const nameError = document.getElementById('name-error');
//             const emailError = document.getElementById('email-error');
//             const phoneError = document.getElementById('phone-error');
//             const addressError = document.getElementById('address-error');
//
//             // Ресетирање на пораките за грешка
//             if (nameError) nameError.textContent = '';
//             if (emailError) emailError.textContent = '';
//             if (phoneError) phoneError.textContent = '';
//             if (addressError) addressError.textContent = '';
//
//             if (nameInput) nameInput.classList.remove('input-error');
//             if (emailInput) emailInput.classList.remove('input-error');
//             if (phoneInput) phoneInput.classList.remove('input-error');
//             if (addressInput) addressInput.classList.remove('input-error');
//
//             let isValid = true;
//
//             const nameValue = nameInput ? nameInput.value.trim() : '';
//             const emailValue = emailInput ? emailInput.value.trim() : '';
//             const phoneValue = phoneInput ? phoneInput.value.trim() : '';
//             const addressValue = addressInput ? addressInput.value.trim() : '';
//
//             // 1. Валидација за Име и Презиме
//             const nameRegex = /^[\p{L}\s-]+$/u;
//             if (nameValue === '') {
//                 if (nameError) nameError.textContent = 'Полето за име и презиме е задолжително.';
//                 if (nameInput) nameInput.classList.add('input-error');
//                 isValid = false;
//             } else if (!nameRegex.test(nameValue)) {
//                 if (nameError) nameError.textContent = 'Името и презимето смеат да содржат само букви.';
//                 if (nameInput) nameInput.classList.add('input-error');
//                 isValid = false;
//             }
//
//             // 2. Валидација за е-пошта
//             const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//             if (emailValue === '') {
//                 if (emailError) emailError.textContent = 'Полето за е-пошта е задолжително.';
//                 if (emailInput) emailInput.classList.add('input-error');
//                 isValid = false;
//             } else if (!emailRegex.test(emailValue)) {
//                 if (emailError) emailError.textContent = 'Внесете валидна е-пошта со домен (на пр. primer@email.com).';
//                 if (emailInput) emailInput.classList.add('input-error');
//                 isValid = false;
//             }
//
//             // 3. Валидација за телефонски број
//             const phoneRegex = /^(?:\+389|0)7[0-9][\s-]?\d{3}[\s-]?\d{3}$/;
//             if (phoneValue === '') {
//                 if (phoneError) phoneError.textContent = 'Полето за телефон е задолжително.';
//                 if (phoneInput) phoneInput.classList.add('input-error');
//                 isValid = false;
//             } else if (!phoneRegex.test(phoneValue)) {
//                 if (phoneError) phoneError.textContent = 'Внесете валиден телефонски број (на пр. 070123456 или 07X XXX XXX).';
//                 if (phoneInput) phoneInput.classList.add('input-error');
//                 isValid = false;
//             }
//
//             // 4. Валидација за адреса
//             if (addressValue === '') {
//                 if (addressError) addressError.textContent = 'Полето за адреса е задолжително.';
//                 if (addressInput) addressInput.classList.add('input-error');
//                 isValid = false;
//             }
//
//             // Доколку сите полиња се валидни
//             if (isValid) {
//                 const cartItems = JSON.parse(localStorage.getItem('cart_parrot')) || [];
//
//                 if (cartItems.length === 0) {
//                     alert("Košnickata e prazna!");
//                     return;
//                 }
//
//                 let message = "Narackata e uspesna. Naracavte paket so sodrzina:\n";
//
//                 cartItems.forEach((item, index) => {
//                     // Proveruvame dali ima custom ime (kako peškir so ime)
//                     const customText = item.customName ? ` (Ime: ${item.customName})` : '';
//                     message += `${index + 1}. ${item.name} (golemina: ${item.size})${customText} - ${item.price} den.\n`;
//                 });
//
//                 message += "\nNarackata kje bide dostavena vo rok od 2 rabotni dena. Vi blagodarime za doverbata.";
//
//                 alert(message);
//
//                 localStorage.removeItem('cart_parrot');
//
//
//
//
//
//
//                 let itemsListString = "";
//                 if (cartItems.length > 0) {
//                     itemsListString = cartItems.map((item, index) => {
//                         let name = item.title || item.name || item.productName || 'Производ';
//                         let details = [];
//                         if (item.size) details.push(`големина: ${item.size}`);
//                         if (item.customName) details.push(`со име: ${item.customName}`);
//                         if (item.quantity) details.push(`количина: ${item.quantity}`);
//                         return `${index + 1}. ${name}${details.length > 0 ? ' (' + details.join(', ') + ')' : ''}`;
//                     }).join('\n'); // <-- Секој производ ќе биде во нов ред
//                 } else {
//                     itemsListString = "стандардни ставки од пакетот";
//                 }
//
//                 // Го креираме текстот во новиот формат (без надворешни загради и со нов ред)
//                 const confirmationMessage = `Нарачката е успешна. Нарачавте пакет за ${petInMacedonian} со содржина:\n${itemsListString}\nНарачката ќе биде доставена во рок од 2 работни дена. Ви благодариме за довербата.`;
//
//                 // Податоци што се испраќаат преку EmailJS
//                 const templateParams = {
//                     to_name: nameValue,
//                     to_email: emailValue,
//                     message: confirmationMessage,
//                     address: addressValue,
//                     phone: phoneValue
//                 };
//
//                 // Испраќање преку EmailJS
//                 emailjs.send('service_h3i4h6j', 'template_d1vdaea', templateParams)
//                     .then(() => {
//                         alert(confirmationMessage);
//
//                         // Зачувување на нарачката во localStorage
//                         const newOrder = {
//                             id: "ORD-" + Date.now(),
//                             date: new Date().toLocaleString("mk-MK"),
//                             customer: { fullName: nameValue, email: emailValue, phone: phoneValue, address: addressValue },
//                             petType: petInMacedonian,
//                             items: cartItems,
//                             message: confirmationMessage
//                         };
//
//                         let existingOrders = JSON.parse(localStorage.getItem('orders')) || [];
//                         existingOrders.push(newOrder);
//                         localStorage.setItem('orders', JSON.stringify(existingOrders));
//
//                         // Избриши ја кошничката и врати го корисникот на почетна
//                         localStorage.removeItem('cart');
//                         form.reset();
//                         window.location.href = 'index.html';
//                     })
//                     .catch((error) => {
//                         console.error('EmailJS Грешка:', error);
//                         alert('Грешка при испраќање на мејлот. Ве молиме проверете ја вашата интернет врска.');
//                     });
//             }
//         });
//     }
// });
document.addEventListener('DOMContentLoaded', () => {
    // 1. Иницијализација на EmailJS со твојот Public Key (од Account -> API Keys)
    // Замени го ТВОЈОТ_PUBLIC_KEY со вистинскиот код од EmailJS!
    emailjs.init("mtacIkdpgtrxlHZ1Q");

    // Читање на типот на миленик
    const urlParams = new URLSearchParams(window.location.search);
    const petRaw = urlParams.get('pet') || localStorage.getItem('selectedPetType') || 'dog';

    // Мапирање за убав приказ на македонски
    const petNames = {
        'dog': 'куче',
        'cat': 'мачка',
        'parrot': 'папагал'
    };
    const petInMacedonian = petNames[petRaw] || petRaw;

    // Тематски бои во зависност од типот на миленик
    const petColors = {
        'dog': '#634848',
        'cat': '#D5C8B4',
        'parrot': '#5B82A6'
    };

    if (petRaw && petColors[petRaw]) {
        document.documentElement.style.setProperty('--theme-color', petColors[petRaw]);
    }

    // Клуч за кошничка - секогаш зависен од тековно избраното миленче.
    // Мора да е ИДЕНТИЧЕН со клучот кој се користи на страницата каде
    // се додаваат производи во кошничка (пр. cart_dog, cart_cat, cart_parrot).
    const cartStorageKey = `cart_${petRaw}`;

    const form = document.getElementById('order-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Земање на сите елементи од формата
            const nameInput = document.getElementById('fullName');
            const emailInput = document.getElementById('email');
            const phoneInput = document.getElementById('phone');
            const addressInput = document.getElementById('address');

            const nameError = document.getElementById('name-error');
            const emailError = document.getElementById('email-error');
            const phoneError = document.getElementById('phone-error');
            const addressError = document.getElementById('address-error');

            // Ресетирање на пораките за грешка
            if (nameError) nameError.textContent = '';
            if (emailError) emailError.textContent = '';
            if (phoneError) phoneError.textContent = '';
            if (addressError) addressError.textContent = '';

            if (nameInput) nameInput.classList.remove('input-error');
            if (emailInput) emailInput.classList.remove('input-error');
            if (phoneInput) phoneInput.classList.remove('input-error');
            if (addressInput) addressInput.classList.remove('input-error');

            let isValid = true;

            const nameValue = nameInput ? nameInput.value.trim() : '';
            const emailValue = emailInput ? emailInput.value.trim() : '';
            const phoneValue = phoneInput ? phoneInput.value.trim() : '';
            const addressValue = addressInput ? addressInput.value.trim() : '';

            // 1. Валидација за Име и Презиме
            const nameRegex = /^[\p{L}\s-]+$/u;
            if (nameValue === '') {
                if (nameError) nameError.textContent = 'Полето за име и презиме е задолжително.';
                if (nameInput) nameInput.classList.add('input-error');
                isValid = false;
            } else if (!nameRegex.test(nameValue)) {
                if (nameError) nameError.textContent = 'Името и презимето смеат да содржат само букви.';
                if (nameInput) nameInput.classList.add('input-error');
                isValid = false;
            }

            // 2. Валидација за е-пошта
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (emailValue === '') {
                if (emailError) emailError.textContent = 'Полето за е-пошта е задолжително.';
                if (emailInput) emailInput.classList.add('input-error');
                isValid = false;
            } else if (!emailRegex.test(emailValue)) {
                if (emailError) emailError.textContent = 'Внесете валидна е-пошта со домен (на пр. primer@email.com).';
                if (emailInput) emailInput.classList.add('input-error');
                isValid = false;
            }

            // 3. Валидација за телефонски број
            const phoneRegex = /^(?:\+389|0)7[0-9][\s-]?\d{3}[\s-]?\d{3}$/;
            if (phoneValue === '') {
                if (phoneError) phoneError.textContent = 'Полето за телефон е задолжително.';
                if (phoneInput) phoneInput.classList.add('input-error');
                isValid = false;
            } else if (!phoneRegex.test(phoneValue)) {
                if (phoneError) phoneError.textContent = 'Внесете валиден телефонски број (на пр. 070123456 или 07X XXX XXX).';
                if (phoneInput) phoneInput.classList.add('input-error');
                isValid = false;
            }

            // 4. Валидација за адреса
            if (addressValue === '') {
                if (addressError) addressError.textContent = 'Полето за адреса е задолжително.';
                if (addressInput) addressInput.classList.add('input-error');
                isValid = false;
            }

            // Доколку сите полиња се валидни
            if (isValid) {
                const cartItems = JSON.parse(localStorage.getItem(cartStorageKey)) || [];

                if (cartItems.length === 0) {
                    alert("Košnickata e prazna!");
                    return;
                }

                let itemsListString = cartItems.map((item, index) => {
                    let name = item.title || item.name || item.productName || 'Производ';
                    let details = [];
                    if (item.size) details.push(`големина: ${item.size}`);
                    if (item.customName) details.push(`со име: ${item.customName}`);
                    if (item.quantity) details.push(`количина: ${item.quantity}`);
                    return `${index + 1}. ${name}${details.length > 0 ? ' (' + details.join(', ') + ')' : ''}`;
                }).join('\n'); // Секој производ во нов ред

                // Текст за потврда на нарачката
                const confirmationMessage = `Нарачката е успешна. Нарачавте пакет за ${petInMacedonian} со содржина:\n${itemsListString}\nНарачката ќе биде доставена во рок од 2 работни дена. Ви благодариме за довербата.`;

                // Податоци што се испраќаат преку EmailJS
                const templateParams = {
                    to_name: nameValue,
                    to_email: emailValue,
                    message: confirmationMessage,
                    address: addressValue,
                    phone: phoneValue
                };

                // Испраќање преку EmailJS
                emailjs.send('service_h3i4h6j', 'template_d1vdaea', templateParams)
                    .then(() => {
                        alert(confirmationMessage);

                        // Зачувување на нарачката во localStorage (историја на нарачки)
                        const newOrder = {
                            id: "ORD-" + Date.now(),
                            date: new Date().toLocaleString("mk-MK"),
                            customer: { fullName: nameValue, email: emailValue, phone: phoneValue, address: addressValue },
                            petType: petInMacedonian,
                            items: cartItems,
                            message: confirmationMessage
                        };

                        let existingOrders = JSON.parse(localStorage.getItem('orders')) || [];
                        existingOrders.push(newOrder);
                        localStorage.setItem('orders', JSON.stringify(existingOrders));

                        // Избришуваме САМО ја кошничката за тековното миленче,
                        // откако нарачката е потврдено успешно испратена.
                        localStorage.removeItem(cartStorageKey);

                        form.reset();
                        window.location.href = 'index.html';
                    })
                    .catch((error) => {
                        console.error('EmailJS Грешка:', error);
                        alert('Грешка при испраќање на мејлот. Ве молиме проверете ја вашата интернет врска.');
                    });
            }
        });
    }
});