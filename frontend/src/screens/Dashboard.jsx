import React from "react";
import {
  Stethoscope,
  HeartPulse,
  ShieldCheck,
  UserCheck,
  HeartHandshake,
  Droplet,
  UserPlus,
  Activity,
  Heart,
  Mail,
  Phone,
  MapPin
} from "lucide-react";

/* ================= CONTENT ================= */

const content = {
  hero: {
    badge: "Elevating Patient Care Through Clinical Expertise",
    title: "Expert PharmD Care for Superior Patient Outcomes",
    description:
      "Experience the difference of a healthcare platform built on PharmD principles. We bridge the gap between diagnosis and recovery with precise medication therapy management and dedicated patient advocacy.",
    ctaPrimary: "Consult a PharmD",
    ctaSecondary: "Our Care Model",
    image: "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e"
  },
  features: {
    title: "Advanced Clinical Care for Every Patient",
    description:
      "Our PharmD-led approach redefines healthcare delivery, prioritizing safety, efficacy, and compassionate support.",
    items: [
      {
        title: "Patient-First Medication Review",
        description:
          "Every prescription is clinically reviewed to prevent interactions."
      },
      {
        title: "Therapeutic Outcome Monitoring",
        description:
          "Continuous tracking and optimization of therapy outcomes."
      },
      {
        title: "Collaborative Care Ecosystem",
        description:
          "Pharmacists, doctors, and caregivers working together."
      },
      {
        title: "Donor Assurance Program",
        description:
          "Guaranteed priority access to blood units for donors."
      }
    ]
  },
  about: {
    title: "Founded on Clinical Excellence",
    description1:
      "Svasthya Hubis a PharmD-led initiative focused on patient-first healthcare.",
    description2:
      "We ensure every medication decision is evidence-based and personalized.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d",
    items: [
      { title: "Patient Advocacy", description: "Your health comes first." },
      { title: "Optimized Outcomes", description: "Better recovery, fewer risks." },
      { title: "Life-Saving Assurance", description: "Care when it matters most." }
    ]
  },
  footer: {
    brandName: "Svasthya Hub",
    description:
      "India’s pioneering PharmD-led clinical pharmacy network.",
    quickLinks: ["Privacy Policy", "FAQs", "Partner Login", "Terms of Service"],
    services: [
      "Clinical Pharmacy",
      "Medication Therapy",
      "Health Consultations",
      "Partner Programs"
    ],
    copyright:
      `© ${new Date().getFullYear()} Svasthya Hub. All rights reserved.`
  }
};

/* ================= PAGE ================= */

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-white">
      {/* <Header/> */}
      <Hero />
      <Features />
      <About />
       <Trust />
      <Footer />
    </div>
  );
}

/* ================= HEADER ================= */

const Header = () => (
  <header className="sticky top-0 z-50 bg-white border-b">
    <div className="max-w-7xl mx-auto h-20 px-6 flex items-center justify-between">
      
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 bg-[#0369a1] rounded-xl flex items-center justify-center">
          <Stethoscope className="text-white" />
        </div>
        <span className="text-xl font-bold text-[#0369a1]">
          Svasthya Hub
        </span>
      </div>

      {/* Navigation */}
      <nav className="hidden md:flex items-center gap-8">
        <a
          href="#features"
          className="text-gray-600 hover:text-[#0369a1] transition-colors font-medium"
        >
          Features
        </a>
        <a
          href="#about"
          className="text-gray-600 hover:text-[#0369a1] transition-colors font-medium"
        >
          About Us
        </a>
        <a
          href="#partners"
          className="text-gray-600 hover:text-[#0369a1] transition-colors font-medium"
        >
          Partners
        </a>
        <a
          href="#contact"
          className="text-gray-600 hover:text-[#0369a1] transition-colors font-medium"
        >
          Contact
        </a>
      </nav>

      {/* CTA */}
      <div className="hidden md:block">
        <button className="bg-[#0369a1] text-white px-6 py-2 rounded-md font-medium hover:bg-[#035f8f] transition">
          Consult a PharmD
        </button>
      </div>

    </div>
  </header>
);


/* ================= HERO ================= */

const Hero = () => (
  <section className="bg-gradient-to-br from-indigo-50 to-blue-50 py-28">
    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 px-6 items-center">
      <div>
        <span className="inline-flex gap-2 bg-indigo-100 px-4 py-2 rounded-full text-sm font-semibold text-[#0369a1]">
          <HeartPulse className="w-4 h-4" />
          {content.hero.badge}
        </span>

        <h1 className="mt-6 text-5xl font-bold text-gray-900">
          {content.hero.title}
        </h1>

        <p className="mt-6 text-lg text-gray-600">
          {content.hero.description}
        </p>

        <div className="mt-8 flex gap-4">
          <button className="px-8 py-3 bg-[#0369a1] text-white rounded-lg font-semibold">
            {content.hero.ctaPrimary}
          </button>
          <button className="px-8 py-3 border border-[#0369a1] text-[#0369a1] rounded-lg font-semibold">
            {content.hero.ctaSecondary}
          </button>
        </div>
      </div>

      <img
        src={content.hero.image}
        className="rounded-2xl shadow-xl"
      />
    </div>
  </section>
);

/* ================= FEATURES ================= */

const FEATURE_ICONS = [UserCheck, ShieldCheck, HeartHandshake, Droplet];

const Features = () => (
  <section className="py-24 bg-white">
    <div className="max-w-7xl mx-auto px-6">
      <h2 className="text-4xl font-bold text-center">
        {content.features.title}
      </h2>
      <p className="mt-4 text-gray-600 text-center max-w-2xl mx-auto">
        {content.features.description}
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
        {content.features.items.map((item, i) => {
          const Icon = FEATURE_ICONS[i];
          return (
            <div key={i} className="p-6 rounded-2xl border shadow hover:shadow-xl">
              <Icon className="w-7 h-7 text-[#0369a1]" />
              <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
              <p className="mt-2 text-gray-600">{item.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

/* ================= ABOUT ================= */

const ABOUT_ICONS = [UserPlus, Activity, Heart];

const About = () => (
  <section className="py-24 bg-gradient-to-br from-indigo-50 to-blue-50">
    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 px-6">
      <img src={content.about.image} className="rounded-2xl shadow-xl" />

      <div>
        <h2 className="text-4xl font-bold">{content.about.title}</h2>
        <p className="mt-4 text-gray-600">{content.about.description1}</p>
        <p className="mt-4 text-gray-600">{content.about.description2}</p>

        <div className="mt-8 space-y-4">
          {content.about.items.map((item, i) => {
            const Icon = ABOUT_ICONS[i];
            return (
              <div key={i} className="flex gap-4">
                <Icon className="text-[#0369a1]" />
                <div>
                  <h4 className="font-semibold">{item.title}</h4>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </section>
);
/* ================= PARTNERS / TRUST ================= */

const Trust = () => (
  <section className="py-24 bg-white">
    <div className="max-w-7xl mx-auto px-6 text-center">
      
      <h2 className="text-5xl font-bold text-gray-900">
        Trusted by Leaders in Healthcare
      </h2>

      <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
        Our commitment to patient safety and clinical excellence is recognized
        by premier institutions and regulatory bodies.
      </p>

      <div className="grid md:grid-cols-3 gap-8 mt-16">
        <div className="p-6 border rounded-2xl shadow hover:shadow-xl transition  bg-gradient-to-br from-indigo-50 to-blue-50">
          <h4 className="text-2xl font-semibold">NIMS University</h4>
          <p className="mt-2 text-gray-600">Clinical Research & Education</p>
        </div>

        <div className="p-6 border rounded-2xl shadow hover:shadow-xl transition bg-gradient-to-br from-indigo-50 to-blue-50">
          <h4 className="text-2xl font-semibold">Startup India</h4>
          <p className="mt-2 text-gray-600">Recognized Healthcare Innovation</p>
        </div>

        <div className="p-6 border rounded-2xl shadow hover:shadow-xl transition bg-gradient-to-br from-indigo-50 to-blue-50">
          <h4 className="text-2xl font-semibold">WHO-GMP Standard</h4>
          <p className="mt-2 text-gray-600">Ensuring Therapeutic Quality</p>
        </div>
      </div>

      {/* CTA BANNER */}
      <div className="mt-20 bg-gradient-to-r from-[#0369a1] to-indigo-600 rounded-2xl p-12 text-white">
        <h3 className="text-3xl font-bold">
          Join Our Patient-Centric Care Network
        </h3>
        <p className="mt-4 max-w-2xl mx-auto opacity-90">
          Whether you are a patient seeking better outcomes or a healthcare
          professional dedicated to clinical excellence, Svasthya hub is your
          partner in health.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <button className="bg-white text-[#0369a1] px-8 py-3 rounded-lg font-semibold">
            Find a Specialist
          </button>
          <button className="border border-white px-8 py-3 rounded-lg font-semibold">
            For Healthcare Providers
          </button>
        </div>
      </div>
    </div>
  </section>
);


/* ================= FOOTER (FIXED) ================= */

const Footer = () => (
  <footer className="bg-gray-900 text-white pt-16 pb-8">
    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
      
      {/* BRAND */}
      <div>
        <h3 className="text-xl font-bold">{content.footer.brandName}</h3>
        <p className="mt-4 text-gray-400">{content.footer.description}</p>
      </div>

      {/* QUICK LINKS */}
      <div>
        <h4 className="font-semibold mb-4">Quick Links</h4>
        <ul className="space-y-2 text-gray-400">
          {content.footer.quickLinks.map((link, i) => (
            <li key={i} className="hover:text-white cursor-pointer">
              {link}
            </li>
          ))}
        </ul>
      </div>

      {/* SERVICES */}
      <div>
        <h4 className="font-semibold mb-4">Services</h4>
        <ul className="space-y-2 text-gray-400">
          {content.footer.services.map((service, i) => (
            <li key={i} className="hover:text-white cursor-pointer">
              {service}
            </li>
          ))}
        </ul>
      </div>

      {/* CONTACT */}
      <div className="space-y-3 text-gray-400">
        <div className="flex gap-2"><Mail /> <a href="mailto:hudsvasthya@gmail.com">hudsvasthya@gmail.com</a></div>
        <div className="flex gap-2"><Phone /> <a href="tel:+91 9523443854">+91 9523443854</a></div>
        <div className="flex gap-2"><MapPin />Jaipur, Rajasthan, India</div>
      </div>

    </div>

    <p className="mt-12 text-center text-gray-500">
      {content.footer.copyright}
    </p>
  </footer>
);
