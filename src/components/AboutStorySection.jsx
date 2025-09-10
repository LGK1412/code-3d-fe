export default function AboutStorySection() {
    return (
        <section className="w-full px-4 py-12 flex flex-col items-center">
            <div className="md:mt-20 md:mb-20">
                {/* Tiêu đề lớn */}
                <h1 className="font-inria font-bold text-black text-4xl sm:text-5xl md:text-[100px] text-center">
                    ABOUT US
                </h1>

                {/* Subtitle nhỏ hơn, cách đều nhau */}
                <h2 className="font-inria font-semibold italic text-black text-xl sm:text-2xl md:text-3xl text-center mb-10">
                    The Story Behind the Room Design Site
                </h2>
            </div>


            {/* Nội dung */}
            <div className="max-w-6xl font-inria text-black text-base sm:text-lg md:text-xl text-justify leading-relaxed mb-16">
                <p>
                    It all began when a friend of ours moved into a new place and wanted to design their dream room but didn&apos;t know where to start or how to visualize it.
                </p>
                <br />
                <p>
                    Like many others, our friend turned to popular 3D interior design websites, excited to bring their space to life like picking colors, rearranging furniture, experimenting with styles. But no matter how modern or stylish the room looked, it always felt not quite right.
                </p>
                <br />
                <p>
                    That&apos;s when we started exploring the idea of building a room design platform that does more than just look good. One that also feels right.
                </p>
                <br />
                <p>
                    We discovered feng shui, and everything changed.
                </p>
                <br />
                <p>
                    We realized that design isn&apos;t just about making a space beautiful. It&apos;s about creating a meaningful connection between the space and the person who lives in it. A truly ideal room is one that&apos;s not only visually appealing but also aligned with your personal energy.
                </p>
                <br />
                <p>
                    So we created Fureal - a platform that combines the power of 3D design technology with the wisdom of feng shui. It allows anyone, whether experienced in design or not, to create a space that is both beautiful and energetically balanced.
                </p>
            </div>
        </section>
    );
};