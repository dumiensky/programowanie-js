const soundSet = [
    { Key: 'A', Name: 'Boom', File: 'sounds/boom.wav' },
    { Key: 'S', Name: 'Clap', File: 'sounds/clap.wav' },
    { Key: 'D', Name: 'Hihat', File: 'sounds/hihat.wav' },
    { Key: 'F', Name: 'Kick', File: 'sounds/kick.wav' },
    { Key: 'G', Name: 'Openhat', File: 'sounds/openhat.wav' },
    { Key: 'H', Name: 'Ride', File: 'sounds/ride.wav' },
    { Key: 'J', Name: 'Snare', File: 'sounds/snare.wav' },
    { Key: 'K', Name: 'Tink', File: 'sounds/tink.wav' },
    { Key: 'L', Name: 'Tom', File: 'sounds/tom.wav' }
];

(function init() {

    createButtons();

    document.addEventListener('keydown', onKeyDown);

})();

function createButtons() {
    const container = document.querySelector('.container');

    for (const sound of soundSet) {
        var soundD = document.createElement('div');
        soundD.classList.add('sound-div');
        soundD.dataset.key = sound.Key.toLowerCase();

        var keyP = document.createElement('p');
        keyP.innerText = sound.Key;
        keyP.style.fontSize = "2em";

        var nameP = document.createElement('p');
        nameP.innerText = sound.Name;

        var audioE = document.createElement('audio');
        audioE.src = sound.File;
        audioE.dataset.key = sound.Key.toLowerCase();

        soundD.appendChild(keyP);
        soundD.appendChild(nameP);
        soundD.appendChild(audioE);

        container.appendChild(soundD);
    }
}

function onKeyDown(e) {
    playSound(e.key);
}

function playSound(key) {
    var audio = document.querySelector(`audio[data-key="${key}"]`);
    if (audio) {
        audio.currentTime = 0;
        audio.play();

        var div = document.querySelector(`div[data-key="${key}"]`);
        if (div) {
            div.classList.add('active');
            setTimeout(() => {
                div.classList.remove('active');
            }, 100);
        }
    }
}