import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";


export default function FooterSection({ bgName }) {
  const backgroundStyle =
    bgName === "BG1"
      ? {
          backgroundImage: "url('/background/BG1.png')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }
      : {};
  return (
    <footer className="text-black font-Bebas Neue text-sm"
    style={backgroundStyle}>
      {/* Top Section */}
      <div className="border-b border-gray-400 px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          {/* Logo */}
          <img src="/logos/logo-fureal2-1.png" alt="Logo" className="w-[150px]" />

          {/* Social Icons */}
          <div className="flex gap-4 ml-auto">
            <a href="#"><FaFacebookF className="text-[32px] text-black hover:text-blue-400" /></a>
            <a href="#"><FaTwitter className="text-[32px] text-black hover:text-blue-400" /></a>
            <a href="#"><FaInstagram className="text-[32px] text-black hover:text-pink-400" /></a>
            <a href="#"><FaLinkedinIn className="text-[32px] text-black hover:text-blue-300" /></a>
            <a href="#"><FaYoutube className="text-[32px] text-black hover:text-red-500" /></a>
          </div>
        </div>
      </div>

      {/* Link Grid Section */}
      <div className="px-10 py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
          {/* Column 1 */}
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-[#4B0000]">Located</h3>
            <ul className="space-y-2 font-semibold text-black">
              <li><a href="#" className="hover:underline">111 Pham Phu Thu Street, Ward 11, Tan Binh District</a></li>
              
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-[#4B0000]">For user</h3>
            <ul className="space-y-2 font-semibold text-black">
              <li><a href="#" className="hover:underline">Start Designing</a></li>
              <li><a href="#" className="hover:underline">Feng Shui Guide</a></li>
              <li><a href="#" className="hover:underline">Explore 3D Model</a></li>
              <li><a href="#" className="hover:underline">Room Templates</a></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-[#4B0000]">For pros</h3>
            <ul className="space-y-2 font-semibold text-black">
              <li><a href="#" className="hover:underline">Fureal for Designers</a></li>
              <li><a href="#" className="hover:underline">3D Layout Tools</a></li>
              <li><a href="#" className="hover:underline">Partner with Us</a></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-[#4B0000]">Get help</h3>
            <ul className="space-y-2 font-semibold text-black">
              <li><a href="#" className="hover:underline">FAQs</a></li>
              <li><a href="#" className="hover:underline">Your Projects</a></li>
              <li><a href="#" className="hover:underline">Returns & Refunds</a></li>
              <li><a href="#" className="hover:underline">Accessibility</a></li>
              <li><a href="#" className="hover:underline">Feedback</a></li>
            </ul>
          </div>

          {/* Column 5 - Subscribe */}
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-[#4B0000]">Subscribe</h3>
            <div className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded border border-gray-400 text-black"
              />
              <button className="w-full bg-black text-white font-semibold py-2 rounded hover:bg-gray-800">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer Bar */}
      <div className="bg-[#D3CFC5] py-4 px-10 text-black text-xs">
        <div className="max-w-7xl mx-auto flex justify-between items-center flex-wrap">
          <p>Copyright © 2024 Fureal. All rights reserved</p>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">Privacy policy</a>
            <a href="#" className="hover:underline">Terms & condition</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
