import { ResumeData } from "../types";
import { BulletList } from "./BulletList";

interface TemplateProps {
  resumeData: ResumeData;
  accentColor?: string;
}

export const ModernTemplate = ({ resumeData, accentColor = "#2563eb" }: TemplateProps) => {
  return (
    <div className="bg-white p-8 text-[13px] leading-relaxed text-gray-800 font-sans">
      {/* Header */}
      <div className="pb-5 mb-6 border-b-[3px]" style={{ borderColor: accentColor }}>
        <h1 className="text-[26px] font-extrabold tracking-tight text-gray-900 mb-1">
          {resumeData.personalInfo.fullName || "Your Name"}
        </h1>
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-gray-500 text-[12px]">
          {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
          {resumeData.personalInfo.phone && <span>{resumeData.personalInfo.phone}</span>}
          {resumeData.personalInfo.location && <span>{resumeData.personalInfo.location}</span>}
        </div>
      </div>

      {/* Summary */}
      {resumeData.personalInfo.summary && (
        <div className="mb-6">
          <h2 className="text-[11px] font-bold tracking-[0.15em] uppercase mb-2" style={{ color: accentColor }}>
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-[1.7]">{resumeData.personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {resumeData.experience.some(exp => exp.company) && (
        <div className="mb-6">
          <h2 className="text-[11px] font-bold tracking-[0.15em] uppercase mb-3" style={{ color: accentColor }}>
            Professional Experience
          </h2>
          {resumeData.experience.map((exp, index) => (
            exp.company && (
              <div key={index} className="mb-4 last:mb-0">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3 className="font-bold text-gray-900 text-[14px]">{exp.position}</h3>
                  <span className="text-gray-400 text-[11px] whitespace-nowrap ml-4">{exp.duration}</span>
                </div>
                <p className="font-medium text-[12px] mb-1.5" style={{ color: accentColor }}>{exp.company}</p>
                {exp.description && <BulletList description={exp.description} bulletColor={accentColor} textClassName="text-gray-600 text-[12px] leading-[1.7]" />}
              </div>
            )
          ))}
        </div>
      )}

      {/* Education */}
      {resumeData.education.some(edu => edu.institution) && (
        <div className="mb-6">
          <h2 className="text-[11px] font-bold tracking-[0.15em] uppercase mb-3" style={{ color: accentColor }}>
            Education
          </h2>
          {resumeData.education.map((edu, index) => (
            edu.institution && (
              <div key={index} className="mb-2 last:mb-0 flex justify-between items-baseline">
                <div>
                  <h3 className="font-bold text-gray-900 text-[13px]">{edu.degree}</h3>
                  <p className="text-[12px]" style={{ color: accentColor }}>{edu.institution}</p>
                </div>
                <span className="text-gray-400 text-[11px]">{edu.year}</span>
              </div>
            )
          ))}
        </div>
      )}

      {/* Skills */}
      {resumeData.skills.length > 0 && resumeData.skills[0] && (
        <div>
          <h2 className="text-[11px] font-bold tracking-[0.15em] uppercase mb-3" style={{ color: accentColor }}>
            Core Competencies
          </h2>
          <div className="flex flex-wrap gap-2">
            {resumeData.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full text-[11px] font-medium"
                style={{ backgroundColor: accentColor + "15", color: accentColor }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
