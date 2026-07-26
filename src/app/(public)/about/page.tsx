import { HardHat, Users, Building2, Package, Shield, Star } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Hire Skilled Workers",
    desc: "Find painters, carpenters, electricians and more with transparent daily rates and verified reviews.",
  },
  {
    icon: Building2,
    title: "Book Contractors",
    desc: "Compare full construction, labour-only, and renovation contracts with per sq.ft pricing.",
  },
  {
    icon: Package,
    title: "Buy Materials",
    desc: "Purchase cement, bricks, steel, wood and tiles from trusted vendors in one marketplace.",
  },
  {
    icon: Shield,
    title: "Verified Providers",
    desc: "Every worker and contractor is reviewed. Ratings and portfolio images help you choose confidently.",
  },
  {
    icon: Star,
    title: "Reviews & Ratings",
    desc: "Real customer feedback on services and products for full transparency.",
  },
  {
    icon: HardHat,
    title: "One Platform",
    desc: "Labour, contractors, and materials — coordinated in a single digital construction hub.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">
          About <span className="text-accent">BuildConnect</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-zinc-400">
          BuildConnect is a unified digital platform that solves the fragmented
          construction industry. We connect customers with skilled workers,
          trusted contractors, and material suppliers — all with transparent
          pricing and quality assurance.
        </p>
      </div>

      <section className="mb-16 rounded-2xl border border-zinc-800 bg-surface p-8">
        <h2 className="mb-4 text-2xl font-bold">Our Mission</h2>
        <p className="text-zinc-300 leading-relaxed">
          Construction today requires juggling multiple sources for labour,
          contractors, and materials. BuildConnect centralizes everything —
          reducing time, improving transparency, and making quality construction
          accessible to everyone from individual homeowners to professional
          builders.
        </p>
      </section>

      <section className="mb-16">
        <h2 className="mb-8 text-center text-2xl font-bold">What We Offer</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-zinc-800 bg-surface p-6"
            >
              <f.icon className="mb-4 h-10 w-10 text-accent" />
              <h3 className="mb-2 font-semibold">{f.title}</h3>
              <p className="text-sm text-zinc-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-accent/30 bg-accent/5 p-8">
        <h2 className="mb-6 text-center text-2xl font-bold">
          Why Choose BuildConnect
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="text-center">
            <p className="text-3xl font-bold text-accent">10K+</p>
            <p className="mt-1 text-sm text-zinc-400">Satisfied customers</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-accent">5K+</p>
            <p className="mt-1 text-sm text-zinc-400">Verified professionals</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-accent">50+</p>
            <p className="mt-1 text-sm text-zinc-400">Cities served</p>
          </div>
        </div>
        <p className="mt-6 text-center text-zinc-400">
          From homeowners to enterprise builders, BuildConnect powers smarter
          construction decisions with verified providers, real-time availability,
          and secure bookings — all in one place.
        </p>
      </section>
    </div>
  );
}
