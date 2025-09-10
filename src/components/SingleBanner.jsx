import './css/PixelTransition.css';

export default function SingleBanner() {
  return (
    <div className="w-full px-4 py-6">
      <div className="relative w-full max-w-[1800px] mx-auto h-[1200px] rounded-2xl overflow-hidden pixel-transition">
        <img
          src="/image/Change-before.jpg"
          alt="Before"
          className="absolute inset-0 w-full h-full object-cover img-before"
        />
        <img
          src="/image/Change-after.jpg"
          alt="After"
          className="absolute inset-0 w-full h-full object-cover img-after"
        />
      </div>
    </div>
  );
}
