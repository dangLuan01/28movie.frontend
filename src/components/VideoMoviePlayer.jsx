import React, { useEffect, useRef, useState } from 'react';
import Plyr from 'plyr';
//import 'plyr/dist/plyr.css';

const VideoPlayer = ({ servers, thumbnail }) => {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const plyrRef = useRef(null);
  const [currentUrl, setCurrentUrl] = useState(servers[0]?.episodes[0]?.hls || '');
  const [currentServer, setCurrentServer] = useState(servers[0]?.name || '');

  useEffect(() => {
    let isMounted = true;
    const video = videoRef.current;
    if (!video || !currentUrl) return;

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const skipRangesRef = { current: [] };

    function onTimeUpdate() {
      const skipRanges = skipRangesRef.current;
      if (!skipRanges.length) return;
      const current = video.currentTime;
      for (const range of skipRanges) {
        if (current >= range.start && current < range.end) {
      
          video.currentTime = range.end;
          break;
        }
      }
    }

    // gắn listener
    video.addEventListener("timeupdate", onTimeUpdate);
    import('hls.js').then(({ default: Hls }) => {
      if (!isMounted) return;

      if (Hls.isSupported()) {
        const hls = new Hls({
          renderTextTracksNatively: false,
          maxBufferLength: 30,
          maxMaxBufferLength: 60,
          nudgeMaxRetry: 5,
          fragLoadingTimeOut: 20000,
          fragLoadingMaxRetry: 6,
          enableWorker: true,
          lowLatencyMode: true,
          startPosition: -1,
        });
        hls.loadSource(currentUrl);
        hls.attachMedia(video);
        hlsRef.current = hls;

        const skipConfig = {
          "https://vip.opstream90.com": [
            { start: 587, end: 632 },
            { start: 2432, end: 2466 },
            { start: 4862, end: 4897 },
          ],
        };

        hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
          const domain = new URL(data.levels[0].url[0]).origin;
          skipRangesRef.current = skipConfig[domain] || [];
        });

        hls.on(Hls.Events.SUBTITLE_TRACKS_UPDATED, (event, data) => {
          [...video.querySelectorAll("track")].forEach(t => t.remove());

          data.subtitleTracks.forEach((sub, i) => {
            const trackEl   = document.createElement("track");
            trackEl.kind    = "subtitles";
            trackEl.label   = sub.name || "Vietnamese";
            trackEl.srclang = sub.lang || "vi";
            trackEl.src     = sub.url;
            trackEl.default = i === 0;
            video.appendChild(trackEl);
          });

          if (plyrRef.current) {
            plyrRef.current.captions.update();
          }
        });

        video.addEventListener('loadedmetadata', () => {
          if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
              artwork: [
                {
                  src: thumbnail,
                  type: 'image/jpeg',
                },
              ],
            });
          }
        });

        video.addEventListener('seeking', () => {
          const currentTime = video.currentTime;
          hls.startLoad(currentTime);
        });

      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = currentUrl;
      }
      
      if (!plyrRef.current) {
        plyrRef.current = new Plyr(video, {
          settings: ['captions', 'quality', 'speed', 'server'],
          keyboard: { focused: true, global: true }, 
          tooltips: { controls: true, seek: true },
          captions: { active: true, update: true, language: 'auto' },
          controls: [
            'play-large',
            'restart',
            'rewind',
            'play',
            'fast-forward',
            'progress',
            'current-time',
            'duration',
            'mute',
            'volume',
            'captions',
            'settings',
            'pip',
            'fullscreen',
          ],
        });
      }
    });

    return () => {
      isMounted = false;
      if (video) {
        video.removeEventListener("timeupdate", onTimeUpdate);
      }
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [currentUrl]);
  return (
    <div className="col-12 col-xl-8">
      <video ref={videoRef} id="player" controls playsInline poster={thumbnail} crossOrigin="anonymous" height={480} width={720}/>
      <div className="article__actions article__actions--details" style={{ marginTop: 10 }}>
        <div className="">
          {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M21,14a1,1,0,0,0-1,1v4a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V15a1,1,0,0,0-2,0v4a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V15A1,1,0,0,0,21,14Zm-9.71,1.71a1,1,0,0,0,.33.21.94.94,0,0,0,.76,0,1,1,0,0,0,.33-.21l4-4a1,1,0,0,0-1.42-1.42L13,12.59V3a1,1,0,0,0-2,0v9.59l-2.29-2.3a1,1,0,1,0-1.42,1.42Z" />
          </svg>
          Server:&nbsp;&nbsp; */}
           {servers.map((server, idx) => {
            const url = server.episodes[0]?.hls;
            return (
              <button className={currentUrl === url ? 'categories__item active-server' : 'categories__item' }
                key={idx}
                onClick={() => {
                  if (url && url !== currentUrl) {
                    setCurrentUrl(url);
                    setCurrentServer(server.name);
                  }
                }}>
                {server.name}
              </button>
            );
          })}
        </div>
        <button className="article__favorites" type="button">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M16,2H8A3,3,0,0,0,5,5V21a1,1,0,0,0,.5.87,1,1,0,0,0,1,0L12,18.69l5.5,3.18A1,1,0,0,0,18,22a1,1,0,0,0,.5-.13A1,1,0,0,0,19,21V5A3,3,0,0,0,16,2Zm1,17.27-4.5-2.6a1,1,0,0,0-1,0L7,19.27V5A1,1,0,0,1,8,4h8a1,1,0,0,1,1,1Z" />
          </svg>
          Add to favorites
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;
