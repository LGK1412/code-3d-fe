import './css/Banner.css';

function Banner() {
  return (
    <div
      className="relative h-[220px] sm:h-[260px] md:h-[300px] bg-cover bg-center"
      style={{ backgroundImage: 'url(/background/saleoff.png)' }}
    >
      {/* Text content shifted left */}
      <div className="absolute inset-0 flex flex-col justify-center pl-20 sm:pl-40 md:pl-25 items-start text-left">
        <div className="text-black font-extrabold text-2xl sm:text-3xl md:text-4xl tracking-widest sale-loop">
          <span className="block italic drop-shadow sale-word">SALE</span>
          <span className="block italic drop-shadow sale-word">SALE</span>
          <span className="block italic drop-shadow sale-word">SALE</span>
        </div>

        <div className="text-red-1900 font-bold text-6xl sm:text-7xl md:text-8xl mt-2 percent-pop">
          30%
        </div>
      </div>
    </div>
  );
}

export default Banner;
