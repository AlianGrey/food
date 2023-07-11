window.addEventListener('DOMContentLoaded', () => {

    //tabs
    const tabs = document.querySelectorAll('.tabheader__item'),
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabsParent = document.querySelector('.tabheader__items');

    function hideTabContent() {
        tabsContent.forEach(item => {
            // item.style.display = 'none';
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });
        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        })
    }

    function showTabContent(i = 0) {
        // tabsContent[i].style.display = 'block';
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');

        tabs[i].classList.add('tabheader__item_active');

    }

    hideTabContent();
    showTabContent();


    tabsParent.addEventListener('click', (event) => {
        const target = event.target;

        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        };

    });


    //timer
    const deadline = '2023-07-05';

    function getTimeRemaining(endtime) {
        let days, hours, minutes, seconds;
        const t = Date.parse(endtime) - Date.parse(new Date());

        if (t <= 0) {
            days = 0;
            hours = 0;
            minutes = 0;
            seconds = 0;
        } else {
            days = Math.floor(t / (1000 * 60 * 60 * 24)),
                hours = Math.floor(t / (1000 * 60 * 60) % 24),
                minutes = Math.floor(t / (1000 * 60) % 60),
                seconds = Math.floor(t / 1000 % 60);
        }

        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return num = `0${num}`;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000);

        updateClock();

        function updateClock() {
            const t = getTimeRemaining(endtime);
            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setClock('.timer', deadline);


    //modal
    const modalTrigger = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal');

    function closeModal() {
        /*modal.classList.remove('show', 'fade');  modal.classList.add('hide'); */
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    function openModal() {
        /*modal.classList.remove('hide');    modal.classList.add('show', 'fade'); */
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        //console.log(modal.style.display = 'block');  // clearInterval(modalTimerId);
    }

    modalTrigger.forEach(btn => {
        btn.addEventListener('click', openModal)
    });

    //close modal window then click outside the modal window
    modal.addEventListener('click', (e) => {
        if (e.target == modal || e.target.getAttribute('data-close') == '') {
            closeModal();
        }
    });

    //close modal window then down "Esc" key
    document.addEventListener('keydown', (e) => {
        if (e.code == 'Escape' && modal.classList.contains('show')) { closeModal(); }
    });

    //show modal window then past 3000ms from open the site if before it was not open
    //const modalTimerId = setTimeout(openModal, 50000);

    //show the modal window if a user has scrolled to the bottom of the page
    function showModalByScroll() {
        if (window.scrollY + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        };
    }

    window.addEventListener('scroll', showModalByScroll);
    //modal end

    //tabs with menu
    //используем классы для карточек
    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.transfer = 27;
            this.parent = document.querySelector(parentSelector);
            this.classes = classes;
            this.changeToUAH();
        }

        changeToUAH() {
            this.price = this.price * this.transfer;
        }

        render() {
            const element = document.createElement('div');

            if (this.classes.length === 0) {
                this.classes = 'menu__item';
                element.classList.add(this.classes);
            } else {
                this.classes.forEach(className => { element.classList.add(className) });
            }

            element.innerHTML = `
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> дол/день</div>
                </div>
                `;
            this.parent.append(element);
        }

    }
    const elem = '.menu .container';

    //varian throw axios library
    axios.get('http://localhost:3000/menu')
        .then((data) => {
            data.data.forEach(({ img, altimg, title, descr, price }) => {
                new MenuCard(img, altimg, title, descr, price, elem).render();
            });
        });

    //Forms
    const forms = document.querySelectorAll('form');

    const message = {
        loading: '../img/form/spinner.svg',
        success: 'Спасибо. Мы скоро свяжемся с вами.',
        failure: 'Что-то пошло не так...'
    }

    forms.forEach(item => {
        bindPostData(item);
    });

    const postData = async (url, data) => {
        let res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });
        return await res.json();
    };

    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
             display: block;
             margin: 0 auto;
             `;

            form.insertAdjacentElement('afterend', statusMessage); // в конец формы после закрытия тега

            const formData = new FormData(form); //формируем данные с формы для отправки на сервер, надо чтобы name у всех элементов был

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', json)
                .then(data => {
                    console.log(data);
                    showThanksModal(message.success);
                    statusMessage.remove();
                }).catch(() => {
                    showThanksModal(message.failure);
                }).finally(() => {
                    form.reset();
                })

        });
    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');
        prevModalDialog.classList.add('hide');

        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');

        thanksModal.innerHTML = `
            <div class="modal__content">
                <div data-close class="modal__close">&times;</div>
                <div class="modal__title">${message}</div>
            </div>
        `;
        document.querySelector('.modal').append(thanksModal);


        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
        }, 4000);
    }


    //slider
    const slides = document.querySelectorAll('.offer__slide'),
        prev = document.querySelector('.offer__slider-prev'),
        next = document.querySelector('.offer__slider-next'),

        current = document.querySelector('#current'),
        total = document.querySelector('#total'),
        sliderWrapper = document.querySelector('.offer__slider-wrapper'),
        slideField = document.querySelector('.offer__slider-inner'),
        width = window.getComputedStyle(sliderWrapper).width,  //результат будет: '650px' *4 = 2600 px общая ширина на 4 слайда

        slider = document.querySelector('.offer__slider'); //для точек внизу слайдера

    let slideIndex = 1,
        offset = 0,
        dots = [];

    if (slides.length < 10) {
        total.innerHTML = `0${slides.length}`;
        current.innerHTML = `0${slideIndex}`;
    } else {
        total.innerHTML = slideIndex;
        current.innerHTML = slideIndex;
    }

    slideField.style.width = 100 * slides.length + '%';
    slideField.style.display = 'flex';
    slideField.style.transition = '0.5s all';
    sliderWrapper.style.overflow = 'hidden';

    slides.forEach(slide => slide.style.width = width);

    function showCurrentIndexSlider() {
        if (slideIndex < 10) {
            current.innerHTML = `0${slideIndex}`;
        } else {
            current.innerHTML = slideIndex;
        }
    }

    function addOpacityForDots() {
        dots.forEach(dot => dot.style.opacity = '.5');
        dots[slideIndex - 1].style.opacity = 1;
    }

    //dots for slider
    slider.style.position = 'relative';

    let indicators = document.createElement('ol');
    indicators.classList.add('carousel-indicators');
    slider.append(indicators);

    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i + 1);
        dot.classList.add('dot');
        if (i == 0) {
            dot.style.opacity = 1;
        };

        indicators.append(dot);
        dots.push(dot);
    };

    function replaceNotDidgital(element) {
        return +element.replace(/\D/g, '');
    }

    next.addEventListener('click', () => {
        if (offset == replaceNotDidgital(width) * (slides.length - 1)) {
            slideIndex = 1;
            offset = 0;
        } else {
            slideIndex++;
            offset += replaceNotDidgital(width);
        }

        slideField.style.transform = `translateX(-${offset}px)`;

        showCurrentIndexSlider();
        addOpacityForDots();

    });

    prev.addEventListener('click', () => {
        if (offset == 0) {
            slideIndex = slides.length;
            offset = replaceNotDidgital(width) * (slides.length - 1);
        } else {
            slideIndex--;
            offset -= replaceNotDidgital(width);
        }

        slideField.style.transform = `translateX(-${offset}px)`;

        showCurrentIndexSlider();
        addOpacityForDots();

    });

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            let slideTo = e.target.getAttribute('data-slide-to');
            slideIndex = slideTo;

            offset = replaceNotDidgital(width) * (slideTo - 1);
            slideField.style.transform = `translateX(-${offset}px)`;

            showCurrentIndexSlider();
            addOpacityForDots();
        });
    });

    //calc
    const result = document.querySelector('.calculating__result span');
    let sex, age, height, weight, ratio;

    if (localStorage.getItem('sex')) {
        sex = localStorage.getItem('sex');
    } else {
        sex = 'female';
        localStorage.setItem('sex', `${sex}`);
    }

    if (localStorage.getItem('ratio')) {
        ratio = localStorage.getItem('ratio');
    } else {
        ratio = 1.375;
        localStorage.setItem('ratio', `${ratio}`);
    }

    function initLocalSettings(selector, activeClass) {
        const elements = document.querySelectorAll(selector);

        elements.forEach(elem => {
            elem.classList.remove(activeClass);

            if (elem.getAttribute('id') == localStorage.getItem('sex')) {
                elem.classList.add(activeClass);
            };

            if (elem.getAttribute('data-ratio') == localStorage.getItem('ratio')) {
                elem.classList.add(activeClass);
            };

        });
    }
    initLocalSettings('#gender div', 'calculating__choose-item_active');
    initLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active');

    function calcTotal() {
        if (!sex || !age || !height || !weight || !ratio) {
            result.textContent = '_____';
            return;
        };

        if (sex == 'male') {
            result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
        } else {
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
        };
    }
    calcTotal();

    function getStaticInformation(selector, activeClass) {
        const elements = document.querySelectorAll(selector);

        elements.forEach(item => {
            item.addEventListener('click', (e) => {

                if (e.target.getAttribute('data-ratio')) {
                    ratio = +e.target.getAttribute('data-ratio');
                    localStorage.setItem('ratio', `${ratio}`);
                } else {
                    sex = e.target.getAttribute('id');
                    localStorage.setItem('sex', `${sex}`);
                };

                elements.forEach(item => { item.classList.remove(activeClass); });
                e.target.classList.add(activeClass);
                calcTotal();

            });
        });

    }

    getStaticInformation('#gender div', 'calculating__choose-item_active');
    getStaticInformation('.calculating__choose_big div', 'calculating__choose-item_active');

    function getDynamicInformation(selector) {
        const input = document.querySelector(selector);

        input.addEventListener('input', () => {

            if (input.value.match(/\D/g)) { //если есть не числа
                input.style.border = '1px solid red';
            } else {
                input.style.border = 'none';

            }

            switch (input.getAttribute('id')) {
                case 'height':
                    height = + input.value;
                    break;
                case 'weight':
                    weight = +input.value;
                    break;
                case 'age':
                    age = +input.value;
                    break;
            };
            calcTotal()
        });
    }

    getDynamicInformation('#height');
    getDynamicInformation('#weight');
    getDynamicInformation('#age');


});