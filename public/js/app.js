const music = document.querySelector("audio");
const img = document.querySelector("img");
const play = document.getElementById("play");
const artist= document.getElementById("artist");
const title = document.getElementById("title");
const prev = document.getElementById("prev");
const next = document.getElementById("next");

let progress= document.getElementById("progress");
let total_duration= document.getElementById("duration");
let current_time= document.getElementById("current_time");
const progress_div=document.getElementById("progress_div");


const songs =[{
    name:"music-1",
    title:"COCKTAIL",
    artist:"Kavita Seth, Neeraj Shreedhar"
},
{
    name:"music-2",
    title:`Saiyarra`,
    artist:"Mohit Chauhan,Tarannum Malik"
},
{
    name:"music-3",
    title:"Tum Mile",
    artist:"Neeraj Shreedhar"
},
{
    name:"music-4",
    title:"O Jane Jana",
    artist:"KK"
},
{
    name:"music-5",
    title:"Sooraj Dooba Hain",
    artist:"Arjit Singh"
},
{
    name:"music-6",
    title:"Pani Pani",
    artist:"Yo-Yo HaniSingh"
},
{
    name:"music-7",
    title:"Gallan Goodiyaan",
    artist:"Yashita Sharma. Manish Kumar"
},
{
    name:"music-8",
    title:"Abhi to party shuru ",
    artist:"Badshah"
},
{
    name:"music-9",
    title:"Rabta",
    artist:"Arjit singh"
}
]


let isPlaying = false;

//play function

const playMusic = ()=>{
    isPlaying = true;
    music.play();
    play.classList.replace("fa-play", "fa-pause");
    img.classList.add("animation");

    
};

    //pause function
const pauseMusic = ()=>{
    isPlaying = false;
    music.pause();
    play.classList.replace("fa-pause", "fa-play");
    img.classList.remove("animation");
};

play.addEventListener('click', () => {
    if(isPlaying){
        pauseMusic();
    }
    else{
        playMusic();
    }

   // isPlaying ? pauseMusic() : playMusic();   using ternary operator
});

// changing music
 const loadSong = (songs) =>{
    title.textContent = songs.title;
    artist.textContent = songs.artist;
    music.src = "Music/" + songs.name + ".mp3";
    img.src = "images/" + songs.name +".jpg";

 };
 songIndex=0;
//loadSong(songs[2]);

const nextSong= () =>{
    //songIndex++;
    songIndex = (songIndex + 1) % songs.length;     //module operator 1 to 3, 3 to 1
    loadSong(songs[songIndex]);
    playMusic();
};

const prevSong= () =>{
    //songIndex++;
    songIndex = (songIndex - 1 + songs.length) % songs.length;     //module operator 1 to 3, 3 to 1
    loadSong(songs[songIndex]);
    playMusic();
};

//progress bar work
music.addEventListener('timeupdate', (event)=>{
  //console.log(event);
  //object destructuring
  const{currentTime, duration} =event.srcElement;     
  //console.log(currentTime);
  //console.log(duration);

  let progress_time = (currentTime / duration) * 100;
  progress.style.width = `${progress_time}%`;
  //music duration update
  let min_duration=Math.floor(duration/60);
  let sec_duration=Math.floor(duration%60);

  let tot_duration = `${min_duration}:${sec_duration}`;
  if(duration){   //because NaN show 
  total_duration.textContent=`${tot_duration}`;
  }

  //current time update
  let min_currentTime = Math.floor(currentTime/60);
  let sec_currentTime= Math.floor(currentTime%60);

  if(sec_currentTime<10){
    sec_currentTime=`0${sec_currentTime}`;

  };


  let tot_currentTime=`${min_currentTime}:${sec_currentTime}`;

    current_time.textContent=`${tot_currentTime}`;
    
 
});
progress_div.addEventListener('click', (event)=>{
  console.log(event);
  const {duration}=music;

  let move_progress= (event.offsetX/ event.srcElement.clientWidth)*duration;
  //console.log(duration);
  //console.log(move_progress);
  music.currentTime=move_progress;
})

//if song end then call nextSong function
music.addEventListener("ended",nextSong)

next.addEventListener("click",nextSong);
prev.addEventListener("click",prevSong);

