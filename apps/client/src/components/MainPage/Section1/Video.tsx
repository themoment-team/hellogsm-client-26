import { cn } from 'shared/lib/utils';

const Video = () => (
  <video
    className={cn('w-full', 'h-full', 'object-cover')}
    poster="/images/promotion/poster.png"
    autoPlay
    loop
    muted
    playsInline
  >
    <source src={`${process.env.NEXT_PUBLIC_CDN_URL}/promotion.webm`} type="video/webm" />
    <source src={`${process.env.NEXT_PUBLIC_CDN_URL}/promotion.mp4`} type="video/mp4" />
  </video>
);

export default Video;
