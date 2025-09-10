export default function ModelShowcaseSection() {
    return (
        <section className="px-4 pt-32 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto ">
            {/* 3D Model Image (bên trái) */}
            <div className="flex justify-center">
                <img
                    src="/linhtinh/4-10.png"
                    alt="3D Model"
                    className="w-[280px] sm:w-[400px] md:w-[500px] lg:w-[650px] xl:w-[696px] h-auto object-contain"
                />
            </div>

            {/* Description (bên phải) */}
            <div className="max-w-xl font-inria text-black text-base sm:text-lg md:text-xl leading-relaxed text-justify">
            {/* chữ đây hơi khó đọc nếu trùng với background bg-black/30 px-4 py-2 rounded or  [text-shadow:1px_1px_3px_rgba(0,0,0,0.6)]*/}
                <h1 className="uppercase text-4xl sm:text-5xl md:text-8xl font-bold mb-6 text-center">
                    3D MODEL
                </h1>

                <p>
                    Drag, drop, and customize furniture, materials, and layouts in an intuitive, guided interface.
                </p>
                <br />
                <p>
                    Whether you&apos;re starting from scratch or rearranging a room, Fureal helps you create a space that fits your style and energy.
                </p>

                {/* Custom List with Dash */}
                <div className="space-y-2">
                    {[
                        "Easy drag-and-drop",
                        "Accurate room dimensions",
                        "Smart style + feng shui suggestions",
                        "Instant visual updates",
                    ].map((item, index) => (
                        <p key={index} className="before:content-['-'] before:mr-2">
                            {item}
                        </p>
                    ))}
                </div>
            </div>
        </section>
    );
}
