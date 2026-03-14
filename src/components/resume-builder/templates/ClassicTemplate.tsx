import { ResumeData } from "../types";
import { BulletList } from "./BulletList";

interface TemplateProps {
  resumeData: ResumeData;
  accentColor?: string;
}

export const ClassicTemplate = ({ resumeData, accentColor = "#374151" }: TemplateProps) => {
  return (
    <div className="bg-white p-8 text-[13px] leading-relaxed text-gray-800 font-serif">
      {/* Header */}
      <div className="text-center pb-4 mb-6 border-b" style={{ borderColor: accentColor + "40" }}>
        <h1 className="text-[28px] font-bold tracking-wide text-gray-900 mb-2 uppercase">
          {resumeData.personalInfo.fullName || "Your Name"}
        </h1>
        <div className="flex justify-center flex-wrap gap-x-2 text-gray-500 text-[12px]">
          {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
          {resumeData.personalInfo.email && resumeData.personalInfo.phone && <span style={{ color: accentColor + "50" }}>|</span>}
          {resumeData.personalInfo.phone && <span>{resumeData.personalInfo.phone}</span>}
          {resumeData.personalInfo.phone && resumeData.personalInfo.location && <span style={{ color: accentColor + "50" }}>|</span>}
          {resumeData.personalInfo.location && <span>{resumeData.personalInfo.location}</span>}
        </div>
      </div>

      {/* Summary */}
      {resumeData.personalInfo.summary && (
        <div className="mb-6">
          <h2 className="text-[12px] font-bold tracking-[0.2em] uppercase text-center pb-1 mb-2 border-b" style={{ color: accentColor, borderColor: accentColor + "25" }}>
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-[1.8] text-justify mt-2">{resumeData.personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {resumeData.experience.some(exp => exp.company) && (
        <div className="mb-6">
          <h2 className="text-[12px] font-bold tracking-[0.2em] uppercase text-center pb-1 mb-3 border-b" style={{ color: accentColor, borderColor: accentColor + "25" }}>
            Professional Experience
          </h2>
          {resumeData.experience.map((exp, index) => (
            exp.company && (
              <div key={index} className="mb-4 last:mb-0">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3 className="font-bold text-gray-900">{exp.position}</h3>
                  <span className="text-gray-500 text-[11px] italic">{exp.duration}</span>
                </div>
                <p className="font-medium text-[12px] mb-1" style={{ color: accentColor }}>{exp.company}</p>
                {exp.description && <p className="text-gray-700 leading-[1.7] text-justify">{exp.description}</p>}
              </div>
            )
          ))}
        </div>
      )}

      {/* Education */}
      {resumeData.education.some(edu => edu.institution) && (
        <div className="mb-6">
          <h2 className="text-[12px] font-bold tracking-[0.2em] uppercase text-center pb-1 mb-3 border-b" style={{ color: accentColor, borderColor: accentColor + "25" }}>
            Education
          </h2>
          {resumeData.education.map((edu, index) => (
            edu.institution && (
              <div key={index} className="mb-2 last:mb-0 flex justify-between items-baseline">
                <div>
                  <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                  <p className="text-[12px]" style={{ color: accentColor }}>{edu.institution}</p>
                </div>
                <span className="text-gray-500 text-[11px] italic">{edu.year}</span>
              </div>
            )
          ))}
        </div>
      )}

      {/* Skills */}
      {resumeData.skills.length > 0 && resumeData.skills[0] && (
        <div>
          <h2 className="text-[12px] font-bold tracking-[0.2em] uppercase text-center pb-1 mb-2 border-b" style={{ color: accentColor, borderColor: accentColor + "25" }}>
            Technical Skills
          </h2>
          <p className="text-gray-700 text-center mt-2">{resumeData.skills.join("  ·  ")}</p>
        </div>
      )}
    </div>
  );
};
