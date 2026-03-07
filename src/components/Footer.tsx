import { Snowflake } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border/30 py-12 px-4 md:px-8">
    <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-2">
        <Snowflake className="w-6 h-6 text-primary" />
        <span className="font-display font-bold text-gradient">ArcticCool</span>
      </div>
      <p className="text-sm text-muted-foreground">
        © 2024 ArcticCool. All rights reserved. | trickshome17@gmail.com
      </p>
      <div className="flex gap-6 text-sm text-muted-foreground">
        <a href="#home" className="hover:text-primary transition-colors">Home</a>
        <a href="#services" className="hover:text-primary transition-colors">Services</a>
        <a href="#booking" className="hover:text-primary transition-colors">Booking</a>
      </div>
    </div>
  </footer>
);

export default Footer;
