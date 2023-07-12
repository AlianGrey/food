function slider() {

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

}

module.exports = slider;