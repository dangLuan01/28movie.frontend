import React, { useEffect, useRef } from 'react';

const VideoPlayer = ({ hlsUrl }) => {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const plyrRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // Nếu đã có Hls instance trước đó thì destroy
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    // Init Plyr nếu chưa có
    

    // Nếu hỗ trợ Hls
    if (Hls.isSupported()) {
      
      const hls = new Hls();
     
      hls.attachMedia(video);
      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        hls.loadSource(hlsUrl);
      });
     hls.on(Hls.Events.MANIFEST_PARSED, () => {
        plyrRef.current = new Plyr(video, {
          controls: ['play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'],
        });
        video.play().catch(() => {});
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Trường hợp Safari hỗ trợ native
      video.src = hlsUrl;
       plyrRef.current = new Plyr(video);
      video.play().catch(() => {});
    }
// if (!plyrRef.current) {
//       plyrRef.current = new Plyr(video);
//     }
    // Load và play lại
    //video.load();
   // video.play().catch(() => {});

    // Cleanup khi component unmount
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [hlsUrl]);

  return (
    <video
      ref={videoRef}
      id="player"
      controls
      playsInline
    />
  );
};

export default VideoPlayer;
