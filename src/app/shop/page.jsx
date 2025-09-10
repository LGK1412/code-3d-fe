import NavBar from '@/components/NavBar';
import BestsellerOnly from '@/components/BestsellerOnly';
import BestsellerSection from '@/components/BestsellerSection';
import ProductGallery from '@/components/ProductGallery';
import FooterSection from '@/components/FooterSection';
import Banner from '@/components/Banner';
import productList from '../../components/ProductList';
import ShopSideBanner from '@/components/ShopSideBanner';
function ShopPage() {
    return (
        <div className="relative min-h-screen bg-cover bg-no-repeat" style={{ backgroundImage: 'url(/background/BG5.png)' }}>

            {/* Optional overlay */}
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-0"></div>

            {/* Page Content (set z-10 so it's above overlay) */}
            <div className="relative z-10">
                <NavBar />
                <section >
                    <ShopSideBanner />
                </section>
                {/* Best seller */}
                <section className="py-8 px-4">
                    <BestsellerSection />
                </section>

                {/* Product Gallery */}
                <section className="py-8 px-4">
                    <ProductGallery />
                </section>

                {/* Banner */}
                <section className="py-0">
                    <Banner />
                </section>

                {/* Footer */}
                <FooterSection bgName="BG1" />
            </div>
        </div>
    );
}

export default ShopPage;
