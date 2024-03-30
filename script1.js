document.addEventListener('DOMContentLoaded', () => {
    console.log('Lets write JavaScript');
    let currentSong = new Audio();
    let songs;
    let currFolder;

    function secondsToMinutesSeconds(seconds) {
        if (isNaN(seconds) || seconds < 0) {
            return "00:00";
        }
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(remainingSeconds).padStart(2, '0');
        return `${formattedMinutes}:${formattedSeconds}`;
    }

    async function getSongs(folder) {
        currFolder = folder;
        let a = await fetch(`/${folder}/`)
        let response = await a.text();
        let div = document.createElement("div")
        div.innerHTML = response;
        let as = div.getElementsByTagName("a")
        songs = []
        for (let index = 0; index < as.length; index++) {
            const element = as[index];
            if (element.href.endsWith(".mp3")) {
                songs.push(element.href.split(`/${folder}/`)[1])
            }
        }

        // Show all the songs in the playlist
        let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
        songUL.innerHTML = ""
        for (const song of songs) 
        {
            songUL.innerHTML = songUL.innerHTML + ` <li><img class="invert" width="34" src= "music.svg" alt="">
                                <div class="info">
                                    <div> ${song.replaceAll("%20", " ")}</div>
                                    <div>Harry</div>
                                </div>
                                <div class="playnow">
                                    <span>Play Now</span>
                                    <img class="invert" src="play.svg" alt="">
                                </div> </li> `;
        }

        // Attach an event listener to each song
        Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
            e.addEventListener("click", element => {
                playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
            })
        })
        return songs
    }

    const playMusic = (track, pause = false) => {
        currentSong.src = "/songs/" + track
        if (!pause) {
            currentSong.play()
            document.getElementById('play').src = "pause.svg"
        }
        document.querySelector(".songinfo").innerHTML = decodeURI(track)
        document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
    }


    async function displayAlbums() {
        console.log("displaying albums")
        let a = await fetch(`/songs/`)
        let response = await a.text();
        let div = document.createElement("div")
        div.innerHTML = response;
        let anchors = div.getElementsByTagName("a")
        let songs= []
        for(let index=0;index<anchors.length;index++)
        {
            const element=anchors[index];
            if(element.href.endsWith(".mp3"))
            {
                songs.push(element.href.split("/songs/")[1])
            }
            return songs
        }
    
    }

    async function main() {
        // Get the list of all the songs
        await getSongs("songs")
        playMusic(songs[0], true)

        // Display all the albums on the page
        await displayAlbums()

        // Attach an event listener to play, next and previous
        document.getElementById('play').addEventListener("click", () => {
            if (currentSong.paused) {
                currentSong.play()
                document.getElementById('play').src = "pause.svg"
            }
             else {
                currentSong.pause()
                document.getElementById('play').src = "play.svg"
            }
        })



        
    //add an event listner to prev and next
    previous.addEventListener("click",()=>{
        console.log("previous clicked")
        let index= songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((index-1)>=0)
        playMusic(songs[index-1])
    })

    next.addEventListener("click",()=>{
        console.log("next clicked")
        currentSong.pause()
        let index= songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        
        if((index+1)<songs.length)
        playMusic(songs[index+1])

    })

        // Listen for timeupdate event
        currentSong.addEventListener("timeupdate", () => {
            document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
            document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
        })



        document.querySelector(".seekbar").addEventListener("click", e=>{
            let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100
            document.querySelector(".circle").style.left=percent+"%";
            currentSong.currentTime=((currentSong.duration)*percent)/100;
        })


    document.querySelector(".volume > img").addEventListener("click", e => {
        console.log(e.target);
        console.log("volume button clicked");
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg");
            currentSong.volume = 0;
        } else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg");
            currentSong.volume = 0.10;
        }
    });


    //add an event to volume

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>
    {
        currentSong.volume=parseInt(e.target.value)/100
    })

       
    }

    main();
});
