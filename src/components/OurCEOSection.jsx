export default function OurCEOSection() {
    const ceoImages = [
        "/CEOpicture/ceo1.png",
        "/CEOpicture/ceo1.png",
        "/CEOpicture/ceo1.png",
        "/CEOpicture/ceo1.png",
        "/CEOpicture/ceo1.png",
    ];

    return (
        <section className="w-full px-4 md:pt-12 pt-8 flex flex-col items-center md:pb-40 pb-20">
            {/* Tiêu đề */}
            <h1 className="uppercase font-inria text-5xl sm:text-6xl md:text-7xl font-bold text-center mb-10 text-black">
                Our CEO
            </h1>

            {/* Ảnh CEO - 5 cột cố định */}
            <div className="grid grid-cols-5 gap-6">
                {ceoImages.map((src, index) => (
                    <img
                        key={index}
                        src={src}
                        alt={`CEO ${index + 1}`}
                        className="w-[180px] h-[240px] object-cover rounded-xl shadow-md transition duration-300 hover:-translate-y-1"
                    />
                ))}
            </div>
        </section>
    );
}
