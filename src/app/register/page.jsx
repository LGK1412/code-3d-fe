import NavBar from '@/components/NavBar';
import FooterSection from '@/components/FooterSection';
import Register from '@/components/Register';

export default function RegisterPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <NavBar />
            <div
                className="min-h-[calc(100vh-90px)] bg-cover bg-center bg-no-repeat relative"
                style={{ backgroundImage: `url('/background/BG1.png')` }}
            >
                <div className="relative z-10">
                    <Register />
                    <FooterSection />
                </div>
            </div>
        </div>
    );
}
