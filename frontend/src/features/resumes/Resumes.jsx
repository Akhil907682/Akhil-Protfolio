import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HiOutlineDocumentText, HiOutlineDownload } from "react-icons/hi";
import SectionHeading from "@/shared/SectionHeading";
import GlassCard from "@/shared/GlassCard";
import { API_BASE_URL } from "@/app/config";

export default function Resumes() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/resume`);
        const data = await response.json();
        if (response.ok && data.success) {
          setResumes(data.resumes || []);
        }
      } catch (err) {
        console.error("Error fetching resumes for landing page:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  // If there are no resumes uploaded yet, don't render the section
  if (resumes.length === 0) {
    return null;
  }

  return (
    <section id="resumes" className="section-wrapper">
      <div className="section-inner">
        <SectionHeading
          title="Download My Resume"
          subtitle="Select the resume version tailored to the specific role you are hiring for"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {resumes.map((res, i) => (
            <GlassCard key={res._id} delay={i * 0.1}>
              <div className="flex flex-col items-center text-center p-5 h-full justify-between">
                {/* Preview Icon */}
                <div className="p-4 rounded-full bg-primary/10 text-primary mb-4 flex-shrink-0">
                  <HiOutlineDocumentText size={36} />
                </div>

                <div className="flex-1 mb-6">
                  <h3 className="text-base font-bold text-text-100 mb-1 leading-snug">
                    {res.roleName}
                  </h3>
                  <p className="text-[10px] text-text-500 font-mono">
                    Updated: {new Date(res.uploadDate || res.createdAt).toLocaleDateString(undefined, {
                      dateStyle: "medium"
                    })}
                  </p>
                </div>

                {/* Download Button */}
                <a
                  href={`${API_BASE_URL}/resume/${res._id}/download`}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary-light text-white text-xs font-semibold rounded-xl transition-all duration-200 shadow-md shadow-primary/15"
                >
                  <HiOutlineDownload size={14} />
                  Download CV
                </a>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
