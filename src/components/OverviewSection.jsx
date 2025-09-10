export default function OverviewSection() {
  return (
    <section className="relative w-full min-h-[600px] sm:min-h-[700px] md:min-h-[825px] flex items-center justify-center bg-transparent px-4 py-8">
      {/* BOX + TEXT */}
      <div className="w-full max-w-5xl md:h-[450px] bg-[#2f2f2f57] rounded-3xl sm:rounded-[82px] flex flex-col items-center justify-center gap-6 p-6 sm:p-10 text-white text-center">
        {/* MAIN TITLE */}
        <h1 className="[text-shadow:0px_6px_11.9px_#000000] font-bold text-4xl sm:text-6xl md:text-7xl font-inria leading-snug">
          OVERVIEW
        </h1>

        {/* SUBTITLE */}
        <h2 className="[text-shadow:0px_6px_11.9px_#000000] font-bold italic text-lg sm:text-2xl md:text-3xl font-inria leading-normal">
          Welcome to Fureal - where your ideas take real shape.
        </h2>

        {/* DESCRIPTION */}
        <p className="[text-shadow:0px_6px_11.9px_#000000] text-base sm:text-lg md:text-xl font-inria leading-relaxed">
          <span>
            We provide great interior design begins with clear visualization and feng shui harmony.
            That&apos;s why we&apos;ve created an intuitive 3D website that lets you
          </span>
          <br />
          <span className="font-bold font-inria">
            design, customize, and explore your living space - all for real.
          </span>
        </p>
      </div>
    </section>
  );
}
