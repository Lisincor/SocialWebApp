import { useState } from 'react';
import { Link } from 'react-router-dom';

const VideoOverlay = ({ video, position = 'left' }) => {
  return (
    <div className={`absolute bottom-32 ${position === 'left' ? 'left-4' : 'right-4'} flex flex-col gap-4`}>
      {/* Username & Description */}
      <div className="max-w-[60%]">
        {/* Hashtags */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-2">
          {(video.hashtags || []).map((tag, index) => (
            <Link
              key={index}
              to={`/tag/${tag}`}
              className="text-primary-400 text-sm font-medium whitespace-nowrap hover:underline"
            >
              #{tag}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoOverlay;