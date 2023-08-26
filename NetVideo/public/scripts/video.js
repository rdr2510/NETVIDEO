const contenu= document.querySelector('#contenu');
const trackbar = document.querySelector(".trackbar");
const footerVideo = document.querySelector("#footer-video");
const headerVideo = document.querySelector("#header-video");
const currentTime = document.querySelector("#time-last");
const boutonPlay = document.querySelector("#bouton-play");
const boutonRetour = document.querySelector("#bouton-retour");
const boutonAvance = document.querySelector("#bouton-avance");
const boutonVolume = document.querySelector("#bouton-volume");
const player= document.querySelector('#player');
boutonPlay.disabled= true;
boutonRetour.disabled= true;
boutonAvance.disabled= true;
boutonVolume.disabled= true;

let statePlayer = 0;
let  mouveMoveTimeout;

function secondToTime(secondValue){
    dateObj = new Date(secondValue * 1000);
    hours = dateObj.getUTCHours();
    minutes = dateObj.getUTCMinutes();
    seconds = dateObj.getSeconds();

    timeString = hours.toString().padStart(2, '0') + ':' + 
        minutes.toString().padStart(2, '0') + ':' + 
        seconds.toString().padStart(2, '0');
    return timeString;
}

videojs('player').ready(function () {
    this.on('timeupdate', function () {
        if (8 < this.currentTime() && this.currentTime() < 10){
            contenu.style.transition= 'ease-in-out 1s';
            contenu.style.opacity= '0';
            //contenu.style.zIndex= '-1000';
            footerVideo.style.transition= 'ease-in-out 1s';
            footerVideo.style.opacity= '0';
            //footerVideo.style.zIndex= '-1000';
            headerVideo.style.transition= 'ease-in-out 1s';
            headerVideo.style.opacity= '0';
            //headerVideo.style.zIndex= '-1000';
        }
        trackbar.max= this.duration();
        trackbar.value= this.currentTime();
        const tempSliderValue = trackbar.value; 
        const progress = (tempSliderValue / trackbar.max) * 100;
        trackbar.style.background = `linear-gradient(to right, var(--bs-primary) ${progress}%, #ccc ${progress}%)`;
        currentTime.textContent=  secondToTime(this.remainingTime());
    })

    this.on('pause', ()=>{
        contenu.style.transition= 'ease-in-out 1s';
        contenu.style.opacity= '1';
        contenu.style.zIndex= 1000;
        footerVideo.style.transition= 'ease-in-out 1s';
        footerVideo.style.opacity= '1';
        footerVideo.style.zIndex= '1000';
        headerVideo.style.transition= 'ease-in-out 1s';
        headerVideo.style.opacity= '1';
        headerVideo.style.zIndex= '1000';
        boutonPlay.textContent= 'play_circle';
        if (mouveMoveTimeout){
            clearTimeout(mouveMoveTimeout);
        }
        statePlayer= 3; // pause
    });

    this.on('playing', ()=>{
        const spinner= document.querySelector('#spinner');
        spinner.style.display= 'none';
        boutonPlay.textContent= 'pause_circle';
        if (statePlayer!==1){
            contenu.style.transition= 'ease-in-out 1s';
            contenu.style.opacity= '0';
            contenu.style.zIndex= '-1000';
            mouveMoveTimeout = setTimeout(function(){
                footerVideo.style.transition= 'ease-in-out 1s';
                footerVideo.style.opacity= '0';
                footerVideo.style.zIndex= '-1000';
                headerVideo.style.transition= 'ease-in-out 1s';
                headerVideo.style.opacity= '0';
                headerVideo.style.zIndex= '-1000';
            }, 5000);
        }
        statePlayer= 2; // playing
    });

    this.on('canplay', ()=>{
        currentTime.textContent=  secondToTime(this.duration());
        statePlayer= 1; // canPlay
        boutonPlay.disabled= false;
        boutonRetour.disabled= false;
        boutonAvance.disabled= false;
    });
});

trackbar.addEventListener("input", (event) => {
    videojs('player').currentTime(event.target.value);
    const tempSliderValue = event.target.value; 
    const progress = (tempSliderValue / trackbar.max) * 100;
    trackbar.style.background = `linear-gradient(to right, var(--bs-primary) ${progress}%, #ccc ${progress}%)`;
});

document.addEventListener('mousemove', ()=>{
    footerVideo.style.transition= 'ease-in-out 1s';
    footerVideo.style.opacity= '1';
    footerVideo.style.zIndex= '1000';
    headerVideo.style.transition= 'ease-in-out 1s';
    headerVideo.style.opacity= '1';
    headerVideo.style.zIndex= '1000';
    if (mouveMoveTimeout){
        clearTimeout(mouveMoveTimeout);
    }
    let isPlaying = videojs('player').paused();
    if (!isPlaying){
        mouveMoveTimeout = setTimeout(function(){
            footerVideo.style.transition= 'ease-in-out 1s';
            footerVideo.style.opacity= '0';
            footerVideo.style.zIndex= '-1000';
            headerVideo.style.transition= 'ease-in-out 1s';
            headerVideo.style.opacity= '0';
            headerVideo.style.zIndex= '-1000';
        }, 5000);
    }
});

boutonRetour.addEventListener('click', ()=>{
    let v= videojs('player').currentTime() - 20;
    if (v < 0){
        videojs('player').currentTime(0);    
    } else {
        videojs('player').currentTime(v);
    }
});

boutonAvance.addEventListener('click', ()=>{
    let v= videojs('player').currentTime() + 20;
    if (v < videojs('player').duration()){
        videojs('player').currentTime(v);    
    }
});

boutonPlay.addEventListener('click', ()=>{
    let isPlaying = videojs('player').paused();
    if (isPlaying){
        videojs('player').play();
    } else {
        videojs('player').pause();
    }
});

player.addEventListener('click', ()=>{
    let isPlaying = videojs('player').paused();
    if (isPlaying){
        videojs('player').play();
    } else {
        videojs('player').pause();
    }
});

boutonVolume.addEventListener('click', ()=>{
    let isMuted=  videojs('player').muted();
    videojs('player').muted(!isMuted);
    isMuted=  videojs('player').muted();
    if (isMuted){
        boutonVolume.textContent= 'volume_off';
    } else {
        boutonVolume.textContent= 'volume_up';
    }
});

document.addEventListener('keyup', (e)=>{
    if (e.key == " " || e.code == "Space" || e.keyCode == 32) {
        let isPlaying = videojs('player').paused();
    if (isPlaying){
        videojs('player').play();
    } else {
        videojs('player').pause();
    }
    }
});
