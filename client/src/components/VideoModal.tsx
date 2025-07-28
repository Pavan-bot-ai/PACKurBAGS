import { useEffect, useRef } from "react";
import { X, Heart, Share2, Bookmark, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoModalProps {
  isOpen: boolean;
  videoUrl: string;
  title: string;
  location: string;
  author: string;
  onClose: () => void;
  onHeartClick: () => void;
  isLiked: boolean;
}

const VideoModal = ({
  isOpen,
  videoUrl,
  title,
  location,
  author,
  onClose,
  onHeartClick,
  isLiked
}: VideoModalProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        console.log('Video autoplay failed');
      });
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      <div 
        ref={modalRef}
        className="relative w-full max-w-sm mx-4 bg-black rounded-xl overflow-hidden"
        style={{ aspectRatio: '9/16', maxHeight: '90vh' }}
      >
        {/* Close button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>

        {/* Video */}
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full object-cover"
          controls={false}
          loop
          muted
          playsInline
          onClick={(e) => {
            e.stopPropagation();
            if (videoRef.current) {
              if (videoRef.current.paused) {
                videoRef.current.play();
              } else {
                videoRef.current.pause();
              }
            }
          }}
        />

        {/* Video controls overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <div className="flex items-end justify-between">
            {/* Left side - Video info */}
            <div className="flex-1 mr-4">
              <h3 className="font-semibold text-lg mb-1 leading-tight">{title}</h3>
              <p className="text-sm opacity-80 mb-2">{location}</p>
              <p className="text-xs opacity-70">@{author}</p>
            </div>

            {/* Right side - Action buttons */}
            <div className="flex flex-col items-center space-y-4">
              <Button
                variant="ghost"
                size="sm"
                className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 text-white p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onHeartClick();
                }}
              >
                <Heart 
                  className={`h-6 w-6 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} 
                />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 text-white p-0"
                onClick={(e) => e.stopPropagation()}
              >
                <Share2 className="h-6 w-6" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 text-white p-0"
                onClick={(e) => e.stopPropagation()}
              >
                <Bookmark className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>

        {/* Play/Pause indicator */}
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ 
            opacity: 0,
            transition: 'opacity 0.2s ease'
          }}
        >
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <div className="w-0 h-0 border-l-8 border-l-white border-t-4 border-t-transparent border-b-4 border-b-transparent ml-1" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;