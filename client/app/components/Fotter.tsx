import Link from "next/link";
import React, { FC } from "react";
import NavItems from "../utils/NavItems"; // Import the NavItems component

type Props = {
  activeItem?: number; 
  isMobile?: boolean; 
  onNavItemClick?: (item: string) => void;
};

const Footer: FC<Props> = () => {
  return (
    <footer className="w-full relative bg-[#2d6a4f] dark:bg-black py-10">
      <div className="max-w-[1200px] mx-auto px-5">
        {/* Footer content */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex flex-col md:flex-row gap-10 md:gap-20 mb-10 md:mb-0">
            <div className="text-white">
              <h3 className="text-[18px] font-Poppins font-[500] mb-2">Quick Links</h3>
              <ul className="flex flex-col space-y-2">
                <li>
                  <Link href="/waste-collection-scheduling" passHref>
                    <p className="text-[15px] hover:text-[#37a39a] cursor-pointer">
                      Home
                    </p>
                  </Link>
                </li>
                <li>
                  <Link href="/waste-segregation-support" passHref>
                    <p className="text-[15px] hover:text-[#37a39a] cursor-pointer">
                      Services
                    </p>
                  </Link>
                </li>
                <li>
                  <Link href="/recycling-programs" passHref>
                    <p className="text-[15px] hover:text-[#37a39a] cursor-pointer">
                     About
                    </p>
                  </Link>
                </li>
                <li>
                  <Link href="/hazardous-waste-disposal" passHref>
                    <p className="text-[15px] hover:text-[#37a39a] cursor-pointer">
                     Policy
                    </p>
                  </Link>
                </li>
                <li>
                  <Link href="/hazardous-waste-disposal" passHref>
                    <p className="text-[15px] hover:text-[#37a39a] cursor-pointer">
                     FAQ
                    </p>
                  </Link>
                </li>
                </ul>
            </div>

            <div className="text-white">
              <h3 className="text-[18px] font-Poppins font-[500] mb-2">Services</h3>
              <ul className="flex flex-col space-y-2">
                <li>
                  <Link href="/waste-collection-scheduling" passHref>
                    <p className="text-[12px] hover:text-[#37a39a] cursor-pointer">
                      Waste Collection Scheduling
                    </p>
                  </Link>
                </li>
                <li>
                  <Link href="/waste-segregation-support" passHref>
                    <p className="text-[12px] hover:text-[#37a39a] cursor-pointer">
                      Waste Segregation Support
                    </p>
                  </Link>
                </li>
                <li>
                  <Link href="/recycling-programs" passHref>
                    <p className="text-[12px] hover:text-[#37a39a] cursor-pointer">
                      Recycling Programs
                    </p>
                  </Link>
                </li>
                <li>
                  <Link href="/hazardous-waste-disposal" passHref>
                    <p className="text-[12px] hover:text-[#37a39a] cursor-pointer">
                      Hazardous Waste Disposal
                    </p>
                  </Link>
                </li>
                <li>
                  <Link href="/real-time-tracking" passHref>
                    <p className="text-[12px] hover:text-[#37a39a] cursor-pointer">
                      Real-Time Tracking
                    </p>
                  </Link>
                </li>
                <li>
                  <Link href="/bulk-waste-collection" passHref>
                    <p className="text-[12px] hover:text-[#37a39a] cursor-pointer">
                      Bulk Waste Collection
                    </p>
                  </Link>
                </li>
                <li>
                  <Link href="/customer-support" passHref>
                    <p className="text-[12px] hover:text-[#37a39a] cursor-pointer">
                      Customer Support
                    </p>
                  </Link>
                </li>
              </ul>
            </div>

            <div className="text-white">
              <h3 className="text-[18px] font-Poppins font-[500] mb-2">Quick FAQ</h3>
              <ul className="flex flex-col space-y-2">
                <li>
                  <Link href="/devices-access-system" passHref>
                    <p className="text-[12px] hover:text-[#37a39a] cursor-pointer">
                      What devices can I use to access the system?
                    </p>
                  </Link>
                </li>
                <li>
                  <Link href="/supported-operating-systems" passHref>
                    <p className="text-[12px] hover:text-[#37a39a] cursor-pointer">
                      What operating systems are supported?
                    </p>
                  </Link>
                </li>
                <li>
                  <Link href="/download-app" passHref>
                    <p className="text-[12px] hover:text-[#37a39a] cursor-pointer">
                      Do I need to download an app?
                    </p>
                  </Link>
                </li>
                <li>
                  <Link href="/recommended-browser" passHref>
                    <p className="text-[12px] hover:text-[#37a39a] cursor-pointer">
                      What browser should I use?
                    </p>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-white mb-10 md:mb-0">
            <h3 className="text-[18px] font-Poppins font-[500] mb-2">Stay Connected</h3>
            <p className="text-[14px]">Follow us on social media for updates!</p>
          </div>
        </div>

        {/* Bottom text */}
        <div className="text-center text-gray-400 mt-10">
          <p className="text-[14px]">© 2024 PAYT. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
