export default function DevelopmentProcess() {
    return (
        <section className="w-full px-4 py-32 flex flex-col items-center">
            {/* Tiêu đề */}
            <div className="font-inria text-black text-base sm:text-lg md:text-xl leading-relaxed text-justify">
                <h1 className="uppercase text-4xl sm:text-5xl md:text-8xl font-bold mb-12 text-center">
                    Development Process
                </h1>
            </div>
            {/* Ảnh dài ngang */}
            <img
                src="/linhtinh/process.png"
                alt="Development Process"
                className="w-full max-w-6xl object-contain"
            />
        </section>
    );
}
