import { Chapter as TChapter } from "../types/types";

const controlGroup = `flex gap-4 items-center relative`;

export default ({ course, chapter }: { course: string; chapter: TChapter }) => (
  <>
    <div id="chapterDisplay" class="grow">
      <div
        id="videoContainer"
        class="paused subtitle relative settings"
        data-volume-level="high"
      >
        <video
          id="video"
          src={`/courses/${course}/variable/video?quality=480`}
          class="togglePlay aspect-ratio-video w-full rd-xl"
        >
          <track
            kind="subtitles"
            srclang="en"
            src="/public/assets/subtitles.vtt"
          />
        </video>
        <div
          id="controls"
          class="absolute left-50% bottom-0% translate-x--50% w-100% p-4 rd-xl"
        >
          <div id="timeLineContainer" title="alsdfkj">
            <div id="timeLine"></div>
            <div id="timeLineThumb"></div>
          </div>
          <div class="flex justify-between">
            <div class={controlGroup}>
              <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,1,0"
              />
              <button title="Replay 10s (Left arrow)" onclick="skip(-10)">
                <span class="material-symbols-rounded">replay_10</span>
              </button>
              <button title="Play (Space)" class="togglePlay">
                <span class="material-symbols-rounded">play_arrow</span>
              </button>
              <button title="Pause (Space)" class="togglePlay">
                <span class="material-symbols-rounded">pause</span>
              </button>
              <button title="Forward 10s (Right arrow)" onclick="skip(10)">
                <span class="material-symbols-rounded">forward_10</span>
              </button>
              <div class="flex">
                <span id="currentTime">00:00</span>/
                <span id="totalDuration">00:00</span>
              </div>
              <div id="volumeControls">
                <button title="Unmute (m)" id="volumeOff">
                  <span class="material-symbols-rounded">volume_off</span>
                </button>
                <button title="Mute (m)" id="volumeDown">
                  <span class="material-symbols-rounded">volume_down</span>
                </button>
                <button title="Mute (m)" id="volumeUp">
                  <span class="material-symbols-rounded">volume_up</span>
                </button>
                <input
                  id="volumeSlider"
                  type="range"
                  min="0"
                  max="1"
                  step="any"
                  value="10"
                />
              </div>
            </div>
            <div class={controlGroup}>
              <button title="Subtitle on (s)" onclick="toggleSubtitle()">
                <span class="material-symbols-rounded">subtitles</span>
              </button>
              <button title="Subtitle off (s)" onclick="toggleSubtitle()">
                <span class="material-symbols-rounded">subtitles_off</span>
              </button>
              <button title="Enter PIP (p)" onclick="togglePIP()">
                <span class="material-symbols-rounded">pip</span>
              </button>
              <button title="Exit PIP (p)" onclick="togglePIP()">
                <span class="material-symbols-rounded">pip_exit</span>
              </button>
              <button title="Fullscreen (f)" onclick="toggleFullscreen()">
                <span class="material-symbols-rounded">fullscreen</span>
              </button>
              <button title="Exit fullscreen (f)" onclick="toggleFullscreen()">
                <span class="material-symbols-rounded">fullscreen_exit</span>
              </button>
              <button title="Settings" onclick="toggleSettings()">
                <span class="material-symbols-rounded">settings</span>
              </button>
              <div
                id={"settingsMenu"}
                class={
                  "absolute glow bg-tertiary right-0 bottom-16 grid gap-2 rd-xl p-4"
                }
              >
                <button
                  class={"text-secondary"}
                  onclick="changeVideoQuality('1080')"
                >
                  1080p
                </button>
                <button onclick="changeVideoQuality('720')">720p</button>
                <button onclick="changeVideoQuality('480')">480p</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />
      <br />
      <tag
        of="zero-md"
        id="chapterDescription"
        src={chapter.description}
        class="bg-glass b b-tertiary p-4 rd-xl"
      >
        <template>
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/gh/PrismJS/prism@1.29.0/themes/prism-tomorrow.css"
          />
          <link rel="stylesheet" href="/public/stylesheets/course.css" />
        </template>
      </tag>
    </div>
    <script>{`
			var lastChapter = document.querySelector('[data-status="active"]')
			var currentChapter = document.querySelector("#chapter${chapter.id.replaceAll(
        "-",
        "",
      )}");
			if(currentChapter) {
				lastChapter.dataset.status = "";
				currentChapter.classList.remove("scale-95");
				currentChapter.dataset.status="active";
			}
		`}</script>
    <script>{`
			var isMouseOnTimeLine = false;
			var pad = new Intl.NumberFormat(undefined, { minimumIntegerDigits: 2 }).format;
			var formatDuration = (duration) => {
   			const seconds = Math.floor(duration % 60);
				const minutes = Math.floor(duration / 60) % 60;
				const hours = Math.floor(duration / 3600);
				return hours > 0 ? \`\${pad(hours)}:\${pad(minutes)}:\${pad(seconds)}\` : \`\${pad(minutes)}:\${pad(seconds)}\`;
			}

			// time line
			var mouseDownAt;
			timeLineContainer.onclick = (e) => {
				const { x } = timeLineContainer.getBoundingClientRect();
				const currentPosition = e.x - x
				video.currentTime = ( currentPosition / timeLineContainer.offsetWidth ) * video.duration;
			}
			timeLineThumb.onmousedown = (e) => mouseDownAtt = e.offsetX;
			window.onmouseup = () => mouseDownAt = null;			 
			timeLineContainer.onmousemove = (e) => {
				const { x } = timeLineContainer.getBoundingClientRect();
				const currentPosition = e.x - x
				var timeLineContainerWidth = timeLineContainer.offsetWidth;
				timeLineContainer.style.setProperty("--currentTime", currentPosition / timeLineContainerWidth )
				timeLineContainer.setAttribute("title",formatDuration(( currentPosition / timeLineContainerWidth) * video.duration))
			} 
			timeLineContainer.onmouseenter = () => isMouseOnTimeLine = true;
			timeLineContainer.onmouseleave = () => {
				isMouseOnTimeLine = false
				timeLineContainer.style.setProperty("--currentTime", video.currentTime/video.duration)
			};

			// play/pause functionalities
			var togglePlay = () =>
				video.paused
					? video.play()
					:	video.pause();

			video.onplay = () => videoContainer.classList.remove("paused");
			video.onpause = () => videoContainer.classList.add("paused");

			document.querySelectorAll(".togglePlay").forEach( e => {
				e.onclick = togglePlay;	
			});

			// current/total time
			video.onloadeddata = () => totalDuration.textContent = formatDuration(video.duration);
			video.ontimeupdate = () => {
				currentTime.textContent = formatDuration(video.currentTime);
				if (isMouseOnTimeLine) return;
				timeLineContainer.style.setProperty("--currentTime",\`\${video.currentTime/video.duration}\`)
			}

			// skip
			var skip = (duration) => {
				video.currentTime += duration;
			} 

			// volume functionalities
			var toggleMute = () => video.muted = !video.muted;

			volumeSlider.oninput = (e) => {
				video.volume = e.target.value;
				video.muted = e.target.value == 0;
			}

			video.onvolumechange = () => {
    		let volume = video.volume;
    		volumeSlider.value = volume;
    		let isMuted = video.muted || volume == 0;
    		let volumeLevel = isMuted ? "muted" : volume > 0.5 ? "high" : "low";

    		if (isMuted) volumeSlider.value = 0;
    		videoContainer.dataset.volumeLevel = volumeLevel;
			}

			[ volumeOff, volumeDown, volumeUp ].forEach( e => e.onclick = toggleMute );

			var adjustVolume = ( value ) => {
				if( !value ) return;
				video.volume = Math.max( 0, Math.min( video.volume + value, 1 ));
			}

			// subtitles functionalities
			var caption = video.textTracks[0]; 
			caption.mode = "hidden";
			var toggleSubtitle = () => {
				caption.mode = caption.mode == "hidden" ? "showing" : "hidden"
				videoContainer.classList.toggle("subtitle");
			}
			

			// pip functionalities
			var togglePIP = () => {
				videoContainer.classList.contains("pip")
					? document.exitPictureInPicture()
					: video.requestPictureInPicture();
			};

			video.onenterpictureinpicture = () => videoContainer.classList.toggle("pip");
			video.onleavepictureinpicture = () => videoContainer.classList.toggle("pip");

			// fullscreen functionalities
			var toggleFullscreen = () => {
				document.fullscreenElement == null
					? videoContainer.requestFullscreen()
					: document.exitFullscreen();
				videoContainer.classList.toggle("fullscreen");
			}

			// settings functionalities
			const toggleSettings = () => {
				videoContainer.classList.toggle("settings")
			}
			
			const changeVideoQuality = (quality) => {
				const currentTime = video.currentTime;
				video.src = \`/courses/${course}/${chapter.title}/video?quality=\${quality}\`;
				video.currentTime = currentTime;
				video.play()
			}

			// hotkeys mapping
			window.onkeydown = ( e ) => {
				switch ( e.key.toLowerCase() ) {
					case " ":
						togglePlay();
						break;

					case "f":
						toggleFullscreen();
						break;

					case "p":
						togglePIP();
						break;

					case "m":
						toggleMute();
						break;

					case "s":
						toggleSubtitle();
						break;

					case "arrowup":
						adjustVolume(0.2);
						break;

					case "arrowdown":
						adjustVolume(-0.2);
						break;
				}
			}
			`}</script>
  </>
);
