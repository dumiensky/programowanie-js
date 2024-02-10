const slider = document.querySelector('.slider');
const intervalBtn = document.querySelector('#btn-interval');
const typeBtn = document.querySelector('#btn-type');
let interval, type = 0;

function getSlides() {
    let slides = document.querySelectorAll('.slide');
    let first = slides[0];
    let last = slides[slides.length- 1];
    let current = document.querySelector('.slide.current');

    return {
        slides,
        first,
        last,
        current,
    };
}

function nextSlide(){
    manipulateForwards();
}

function prevSlide(){
    manipulateBackwards();
}

function intervalClick(){
    if (!interval)
    {
        enableInterval();
    }
    else
    {
        disableInterval();
    }
}

function typeClick(){
    let e = getSlides();
    if (!type){
        e.slides.forEach(s => {
            s.classList.remove('moving');
            s.classList.add('fading');
        });
        typeBtn.innerText = "FADING";
        type = 1;
    }
    else
    {
        e.slides.forEach(s => {
            s.classList.remove('fading');
            s.classList.add('moving');
        });
        typeBtn.innerText = "MOVING";
        type = 0;
    }
}

function manipulateForwards() {
    let e = getSlides();

    e.current.classList.remove('current');
    e.current.nextElementSibling.classList.add('current');
    slider.insertBefore(e.first, null);
}

function manipulateBackwards() {
    let e = getSlides();

    e.current.classList.remove('current');
    e.current.previousElementSibling.classList.add('current');
    slider.insertBefore(e.last, e.first);
}

function enableInterval() {
    interval = setInterval(() => {
        nextSlide();
    }, 2000);
    intervalBtn.innerText = "STOP";
}

function disableInterval(){
    clearInterval(interval);
    interval = null;
    intervalBtn.innerText = "START";
}

(function init() {
    let e = getSlides();
    e.first.classList.add('current');
    slider.insertBefore(e.last, e.first);

    let buttonsContainer = document.querySelector('.slider-buttons');
    let i = 1;
    e.slides.forEach(() => {
        let thisBtnNo = i;

        let btn = document.createElement('button');
        btn.innerText = thisBtnNo;
        btn.addEventListener('click', () => {
            while(document.querySelector('.slide.current') != e.slides[thisBtnNo-1])
            {
                manipulateForwards();
            }
        });

        buttonsContainer.appendChild(btn);
        i += 1;
    });

    typeClick();
    intervalClick();
})();