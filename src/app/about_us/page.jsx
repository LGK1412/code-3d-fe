import BackgroundWrapper from "@/components/BackgroundWrapper";
import { SlArrowDown } from "react-icons/sl";
import NavBar from "@/components/NavBar";
import OverviewSection from "@/components/OverviewSection";
import AboutStorySection from '@/components/AboutStorySection';
import MiddleSection from "@/components/MiddleSection";
import ModelShowcaseSection from "@/components/ModelShowcase";
import FengShui from "@/components/FengShui";
import DevelopmentProcess from "@/components/DevelopmentProcess";
import OurCEOSection from "@/components/OurCEOSection";
import FooterSection from "@/components/FooterSection";


export default function AboutUs() {
    return (
        <>
            <BackgroundWrapper bgName="BG1" className="min-h-screen">
                <div className="flex flex-col justify-between min-h-screen px-4 py-4">
                    {/* Phần giữa: content center dọc */}
                    <div className="flex flex-1 items-center justify-center">
                        <div className="flex flex-col md:flex-row items-center justify-center gap-8">

                            {/* Bọc chữ và mô tả lại để canh giữa */}
                            <div className="text-center">
                                <h1
                                    className="font-bebas text-[15vw] tracking-[0.2em] text-black"
                                    style={{
                                        textShadow: `
                                                    3px 3px 0 #999,
                                                    6px 6px 0 #888,
                                                    9px 9px 0 #777,
                                                    12px 12px 0 #666
                                                `
                                    }}
                                >
                                    FUREAL
                                </h1>

                                <p className="mt-3 text-2xl md:text-3xl tracking-widest font-alegreya font-semi-bold text-[#2c2c2c]">
                                    FURTHER - FURNITURE FOR REAL
                                </p>
                            </div>

                            <img
                                src="/background/hinhcaiphong.png"
                                alt="Hình cái phòng"
                                className="w-[18vw] md:w-[20vw] max-w-full h-auto object-contain"
                            />
                        </div>
                    </div>

                    {/* Mũi tên nằm dưới cùng */}
                    <div className="flex justify-center pb-4">
                        <SlArrowDown className="text-[5vw] animate-bounce-y" />
                    </div>
                </div>
            </BackgroundWrapper>



            <NavBar />

            <BackgroundWrapper bgName="BG4" className="shadow-[0_3px_6px_rgba(0,0,0,0.3)]">
                <OverviewSection />
            </BackgroundWrapper>

            <BackgroundWrapper bgName="BG2">
                <AboutStorySection />
            </BackgroundWrapper>



            <BackgroundWrapper
                bgName="BG1"
                className="min-h-[100px] backdrop-blur-md flex items-center justify-center"
            >
                <MiddleSection />
            </BackgroundWrapper>

            <BackgroundWrapper bgName="BG3">
                <ModelShowcaseSection />
                <FengShui />
                <DevelopmentProcess />
                <OurCEOSection />
            </BackgroundWrapper>

            <FooterSection bgName="BG1" />
        </>
    );
}
