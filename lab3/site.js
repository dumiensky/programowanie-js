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

const metronomA = document.querySelector('.metronom-container > audio');
const metronomBtn = document.querySelector('.metronom-container > button');
const metronomInput = document.querySelector('.metronom-container > input');
let metronomInterval, isLooping;

const recordings = [];

(function init() {

    createButtons();

    metronomBtn.addEventListener('click', metronomClick);
    document.addEventListener('keydown', onKeyDown);

    addRecordingLine();
    addRecordingLine();
    addRecordingLine();

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

function playLinesSingle(btn) {
    btn.innerText = "Odtwarzanie...";

    let offset = playLines();

    setTimeout(() => {
        btn.innerText = "Odtwórz";
    }, offset);
}

async function playLinesLooping(btn) {
    if (!isLooping) {
        btn.innerText = "Odtwarzanie w pętli...";
        isLooping = true;

        while (isLooping) {
            let offset = playLines();
            await sleep(offset);
        }
    }
    else {
        isLooping = false;
        btn.innerText = "Odtwórz w pętli";
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms || DEF_DELAY));
}

function playLines() {
    let endOffset = 10;
    for (const recordingEntity of recordings) {
        if (recordingEntity.ShouldPlay) {
            for (const sound of recordingEntity.Sounds) {
                let offset = sound.Time - recordingEntity.Start;

                if (offset > endOffset) {
                    endOffset = offset;
                }

                setTimeout(() => playSound(sound.Key), offset);
            }
        }
    }

    return endOffset;
}

function onKeyDown(e) {
    playSound(e.key);
}

function playSound(key) {
    var audio = document.querySelector(`audio[data-key="${key}"]`);
    if (audio) {
        audio.currentTime = 0;
        audio.play();

        for (const line of recordings) {
            if (line.IsRecording) {
                line.Sounds.push({
                    Key: key,
                    Time: Date.now()
                });
            }
        }

        var div = document.querySelector(`div[data-key="${key}"]`);
        if (div) {
            div.classList.add('active');
            setTimeout(() => {
                div.classList.remove('active');
            }, 100);
        }
    }
}

function addRecordingLine() {

    const recordingsContainer = document.querySelector('.recordings-container');
    const key = "line" + parseInt(Math.random() * 10000);

    let recordingD = document.createElement('div');
    recordingD.dataset.key = key;
    let titleP = document.createElement('p');
    titleP.innerText = "Linia nagraniowa";

    let lineBtn = document.createElement('button');
    lineBtn.innerText = "ROZPOCZNIJ NAGRYWANIE";
    lineBtn.addEventListener('click', e => {
        let recordingEntity = recordings.find(r => r.Key == key);
        if (recordingEntity) {
            if (recordingEntity.IsRecording) {
                recordingEntity.IsRecording = false;
                lineBtn.innerText = "ROZPOCZNIJ NAGRYWANIE (nadpisz)";
            }
            else {
                recordingEntity.Start = Date.now();
                recordingEntity.Sounds = [];
                recordingEntity.IsRecording = true;
                lineBtn.innerText = "NAGRYWA - ZAKONCZ NAGRYWANIE";
            }
        }
    });

    let deleteLineBtn = document.createElement('button');
    deleteLineBtn.innerText = "USUŃ LINIĘ";
    deleteLineBtn.addEventListener('click', () => {

        let recordingEntity = recordings.find(r => r.Key == key);
        if (recordingEntity) {
            let index = recordings.indexOf(recordingEntity);
            recordings.splice(index, 1);
        }

        let divToRemove = document.querySelector(`div[data-key="${key}"]`);
        if (divToRemove) {
            recordingsContainer.removeChild(divToRemove);
        }
    });

    let shouldPlayCheckbox = document.createElement('input');
    shouldPlayCheckbox.type = 'checkbox';
    shouldPlayCheckbox.checked = true;
    shouldPlayCheckbox.addEventListener('click', () => {
        let recordingEntity = recordings.find(r => r.Key == key);
        if (recordingEntity) {
            recordingEntity.ShouldPlay = !recordingEntity.ShouldPlay;
        }
    });

    recordingD.appendChild(shouldPlayCheckbox);
    recordingD.appendChild(titleP);
    recordingD.appendChild(deleteLineBtn);
    recordingD.appendChild(lineBtn);

    recordingsContainer.appendChild(recordingD);

    recordings.push({
        Key: key,
        Start: Date.now(),
        IsRecording: false,
        ShouldPlay: true,
        Sounds: []
    });
}

function metronomClick() {
    if (!metronomInterval) {
        metronomInterval = setInterval(() => {
            metronomA.currentTime = 0;
            metronomA.play();
        }, 60000 / parseInt(metronomInput.value));
        metronomBtn.innerText = "STOP";
    }
    else {
        clearInterval(metronomInterval);
        metronomInterval = null;
        metronomBtn.innerText = "START";
    }
}