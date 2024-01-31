const slider = document.querySelector('.slider');

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
})();