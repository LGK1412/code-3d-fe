import NavBar from '../../components/NavBar';
import FooterSection from '../../components/FooterSection';
import Login from '../../components/Login';

export default function LoginPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <NavBar />
            {/* Wrapper with shared background */}
            <div
                className="min-h-[calc(100vh-90px)] bg-cover bg-center bg-no-repeat relative"
                style={{ backgroundImage: `url('/background/BG1.png')` }}
            >
                {/* Content */}
                <div className="relative z-10">
                    <Login />
                    <FooterSection />
                </div>
            </div>
        </div>
    );
}
