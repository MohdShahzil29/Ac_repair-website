import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Snowflake, Menu, X } from "lucide-react";

const navLinks = ["Home", "Services", "About", "Booking"];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/30 backdrop-blur-2xl"
    >
      <div className="container mx-auto flex items-center justify-between py-4 px-4 md:px-8">
        <motion.div
          className="flex items-center gap-2 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          onClick={() => scrollTo("home")}
        >
          <Snowflake className="w-8 h-8 text-primary animate-spin-slow" />
          <span className="text-xl font-display font-bold text-gradient">tdacmechanic</span>
        </motion.div>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <motion.button
              key={link}
              onClick={() => scrollTo(link.toLowerCase())}
              className="text-muted-foreground hover:text-primary transition-colors font-medium"
              whileHover={{ y: -2 }}
            >
              {link}
            </motion.button>
          ))}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollTo("booking")}
            className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-semibold"
          >
            Book Now
          </motion.button>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden glass-card border-t border-border/30"
          >
            <div className="flex flex-col gap-4 p-6">
              {navLinks.map((link) => (
                <button
                  key={link}
                  onClick={() => scrollTo(link.toLowerCase())}
                  className="text-muted-foreground hover:text-primary transition-colors text-left font-medium"
                >
                  {link}
                </button>
              ))}
              <button
                onClick={() => scrollTo("booking")}
                className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-semibold w-fit"
              >
                Book Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
