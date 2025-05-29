import { useEffect, useState } from 'react';
import VideoPlayer from './VideoPlayer';

export default function Video({ movie }) {
  const [selectedServerIndex, setSelectedServerIndex] = useState(0);
  const currentServer = movie.servers[selectedServerIndex];
  const currentEpisode = currentServer?.episodes?.[0]; // Giả sử mỗi server 1 tập
  
  return (
    <div className="col-12 col-xl-8">
      {/* <video controls playsInline poster={movie.image?.thumb || ''} id="player" src={currentEpisode?.hls || ''}></video> */}
     <VideoPlayer hlsUrl={currentEpisode.hls} />
      <div className="article__actions article__actions--details">
        <div className="article__download">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M21,14a1,1,0,0,0-1,1v4a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V15a1,1,0,0,0-2,0v4a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V15A1,1,0,0,0,21,14Zm-9.71,1.71a1,1,0,0,0,.33.21.94.94,0,0,0,.76,0,1,1,0,0,0,.33-.21l4-4a1,1,0,0,0-1.42-1.42L13,12.59V3a1,1,0,0,0-2,0v9.59l-2.29-2.3a1,1,0,1,0-1.42,1.42Z"/>
          </svg>
          Server:
          {movie.servers.map((server, idx) => (
            <button
              key={server.id}
              onClick={() => setSelectedServerIndex(idx)}
              style={{
                marginLeft: '8px',
                padding: '4px 8px',
                border: '1px solid gray',
                borderRadius: '4px',
                background: idx === selectedServerIndex ? '#444' : '#fff',
                color: idx === selectedServerIndex ? '#fff' : '#000',
              }}>
              {server.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
