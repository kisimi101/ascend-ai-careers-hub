import { ResumeData } from "../types";
import { BulletList } from "./BulletList";

interface TemplateProps {
  resumeData: ResumeData;
  accentColor?: string;
}

export const ExecutiveTemplate = ({ resumeData, accentColor = "#1e293b" }: TemplateProps) => {
  return (
    <div className="bg-white text-[13px] leading-relaxed font-sans">
      {/* Dark header band */}
      <div className="px-8 py-7" style={{ backgroundColor: accentColor }}>
        <h1 className="text-[28px] font-extrabold text-white tracking-tight mb-1">
          {resumeData.personalInfo.fullName || "Your Name"}
        </h1>
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-white/70 text-[12px]">
          {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
          {resumeData.personalInfo.phone && <span>{resumeData.personalInfo.phone}</span>}
          {resumeData.personalInfo.location && <span>{resumeData.personalInfo.location}</span>}
        </div>
      </div>

      <div className="px-8 py-6">
        {/* Summary */}
        {resumeData.personalInfo.summary && (
          <div className="mb-6 pb-5 border-b border-gray-200">
            <p className="text-gray-700 leading-[1.8] text-[14px] italic">
              "{resumeData.personalInfo.summary}"
            </p>
          </div>
        )}

        {/* Experience */}
        {resumeData.experience.some(exp => exp.company) && (
          <div className="mb-6">
            <h2
              className="text-[12px] font-bold tracking-[0.2em] uppercase mb-4 pb-1 border-b-2"
              style={{ color: accentColor, borderColor: accentColor }}
            >
              Leadership & Experience
            </h2>
            {resumeData.experience.map((exp, index) => (
              exp.company && (
                <div key={index} className="mb-4 last:mb-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="font-bold text-gray-900 text-[14px]">{exp.position}</h3>
                    <span className="text-gray-400 text-[11px] whitespace-nowrap ml-4 font-medium">{exp.duration}</span>
                  </div>
                  <p className="font-semibold text-[12px] mb-1.5" style={{ color: accentColor }}>{exp.company}</p>
                  {exp.description && (
                    <p className="text-gray-600 leading-[1.7]">{exp.description}</p>
                  )}
                </div>
              )
            ))}
          </div>
        )}

        {/* Education */}
        {resumeData.education.some(edu => edu.institution) && (
          <div className="mb-6">
            <h2
              className="text-[12px] font-bold tracking-[0.2em] uppercase mb-3 pb-1 border-b-2"
              style={{ color: accentColor, borderColor: accentColor }}
            >
              Education
            </h2>
            {resumeData.education.map((edu, index) => (
              edu.institution && (
                <div key={index} className="mb-2 last:mb-0 flex justify-between items-baseline">
                  <div>
                    <h3 className="font-bold text-gray-900">{edu.degree}</h3>
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
            <h2
              className="text-[12px] font-bold tracking-[0.2em] uppercase mb-3 pb-1 border-b-2"
              style={{ color: accentColor, borderColor: accentColor }}
            >
              Key Competencies
            </h2>
            <div className="flex flex-wrap gap-2">
              {resumeData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded text-[11px] font-medium text-white"
                  style={{ backgroundColor: accentColor }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
