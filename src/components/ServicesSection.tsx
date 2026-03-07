import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Wrench, Wind, Thermometer, Settings, Droplets, Zap } from "lucide-react";

const services = [
  { icon: Wind, title: "AC Installation", desc: "Professional installation of split, window & central AC systems with warranty." },
  { icon: Wrench, title: "AC Repair", desc: "Fast diagnosis and repair for all brands. Same-day service available." },
  { icon: Settings, title: "AC Maintenance", desc: "Regular servicing to ensure peak performance and energy efficiency." },
  { icon: Thermometer, title: "Gas Refilling", desc: "Expert refrigerant recharge to restore optimal cooling capacity." },
  { icon: Droplets, title: "Duct Cleaning", desc: "Complete ductwork cleaning for better air quality and airflow." },
  { icon: Zap, title: "Emergency Service", desc: "24/7 emergency repairs. We're always available when you need us." },
];

const ServicesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="services" className="section-padding relative" ref={ref}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] frost-glow opacity-30" />

      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-widest">What We Offer</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mt-3 mb-4">
            Our <span className="text-gradient">Services</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Comprehensive AC solutions to keep your home and office perfectly cool all year round.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="glass-card p-8 group cursor-pointer hover:glow-border transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                <service.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-3">{service.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
