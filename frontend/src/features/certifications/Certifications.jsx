import SectionHeading from "@/shared/SectionHeading";
import GlassCard from "@/shared/GlassCard";
import { certifications } from "@/app/data";

export default function Certifications() {
  if (certifications.length === 0) {
    return null;
  }

  return (
    <section id="certifications" className="section-wrapper">
      <div className="section-inner">
        <SectionHeading
          title="Certifications"
          subtitle="Professional certifications and achievements"
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {certifications.map((cert, i) => (
            <GlassCard key={i} delay={i * 0.1}>
              <h3 className="text-lg font-bold text-text-100 mb-2">
                {cert.title}
              </h3>
              <p className="text-sm text-text-300">{cert.issuer}</p>
              <p className="text-xs text-text-500 mt-1">{cert.date}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
