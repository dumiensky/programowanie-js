const slider = document.querySelector('.slider');
const intervalBtn = document.querySelector('#btn-interval');
const typeBtn = document.querySelector('#btn-type');
let interval, type = 0;

function getSlides() {
    var slides = document.querySelectorAll('.slide');
    var first = slides[0];
    var last = slides[slides.length- 1];
    var current = document.querySelector('.slide.current');

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
    var e = getSlides();
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
    var e = getSlides();

    e.current.classList.remove('current');
    e.current.nextElementSibling.classList.add('current');
    slider.insertBefore(e.first, null);
}

function manipulateBackwards() {
    var e = getSlides();

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
    var e = getSlides();
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