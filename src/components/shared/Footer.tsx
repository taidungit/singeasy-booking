import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Music } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">E</span>
              </div>
              <span className="font-bold text-xl">Echo</span>
            </div>
            <p className="text-sm opacity-60 leading-relaxed">
              The world's most trusted karaoke room booking platform. Discover, book, and sing.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider opacity-50">Explore</h4>
            <ul className="space-y-3 text-sm opacity-70">
              <li><Link to="/shops" className="hover:opacity-100 transition-opacity">All Venues</Link></li>
              <li><Link to="/shops?location=Tokyo" className="hover:opacity-100 transition-opacity">Tokyo</Link></li>
              <li><Link to="/shops?location=Seoul" className="hover:opacity-100 transition-opacity">Seoul</Link></li>
              <li><Link to="/shops?location=Singapore" className="hover:opacity-100 transition-opacity">Singapore</Link></li>
              <li><Link to="/shops?location=New York" className="hover:opacity-100 transition-opacity">New York</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider opacity-50">Account</h4>
            <ul className="space-y-3 text-sm opacity-70">
              <li><Link to="/login" className="hover:opacity-100 transition-opacity">Log in</Link></li>
              <li><Link to="/register" className="hover:opacity-100 transition-opacity">Create account</Link></li>
              <li><Link to="/dashboard" className="hover:opacity-100 transition-opacity">My Bookings</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider opacity-50">Contact</h4>
            <ul className="space-y-3 text-sm opacity-70">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                hello@echo-karaoke.com
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                +1 800-ECHO-NOW
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                123 Melody Lane, San Francisco, CA
              </li>
            </ul>
          </div>
        </div>

        <div className="h-px bg-background/10 my-10" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs opacity-40">
          <p>© 2026 Echo Karaoke. All rights reserved.</p>
          <div className="flex gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Cookie Settings</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
