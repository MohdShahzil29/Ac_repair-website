import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { CheckCircle2 } from "lucide-react";

const features = [
  "Licensed & certified technicians",
  "All major brands serviced",
  "Transparent pricing, no hidden fees",
  "Same-day service available",
  "1-year warranty on all repairs",
  "Eco-friendly refrigerants",
];

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="section-padding relative" ref={ref}>
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Visual */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="glass-card glow-border p-10 rounded-3xl relative overflow-hidden">
              <div className="absolute inset-0 frost-glow opacity-40" />
              <div className="relative z-10 space-y-6">
                <div className="text-7xl font-display font-bold text-gradient">10+</div>
                <p className="text-2xl font-display font-semibold">Years of Trusted Cooling Excellence</p>
                <p className="text-muted-foreground leading-relaxed">
                  We've been keeping homes and businesses cool since 2014. Our expert team has completed over 2,000 installations and served 5,000+ happy customers across the region.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-primary font-semibold text-sm uppercase tracking-widest">About Us</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold mt-3 mb-6">
              Why Choose <span className="text-gradient">2 Minute AC Solution</span>?
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              We combine cutting-edge technology with years of expertise to deliver cooling solutions that are efficient, reliable, and affordable.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature, i) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
