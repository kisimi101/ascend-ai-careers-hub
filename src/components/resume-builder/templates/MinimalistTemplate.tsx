import { ResumeData } from "../types";

interface TemplateProps {
  resumeData: ResumeData;
  accentColor?: string;
}

export const MinimalistTemplate = ({ resumeData, accentColor = "#737373" }: TemplateProps) => {
  return (
    <div className="bg-white px-10 py-12 text-[13px] leading-relaxed font-sans text-gray-700">
      {/* Header - ultra minimal */}
      <div className="mb-12">
        <h1 className="text-[32px] font-light tracking-wide text-gray-900 mb-3">
          {resumeData.personalInfo.fullName || "Your Name"}
        </h1>
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-[12px]" style={{ color: accentColor }}>
          {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
          {resumeData.personalInfo.phone && <span>{resumeData.personalInfo.phone}</span>}
          {resumeData.personalInfo.location && <span>{resumeData.personalInfo.location}</span>}
        </div>
      </div>

      {/* Summary */}
      {resumeData.personalInfo.summary && (
        <div className="mb-10">
          <p className="text-gray-600 leading-[2] max-w-[90%]">{resumeData.personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {resumeData.experience.some(exp => exp.company) && (
        <div className="mb-10">
          <h2 className="text-[11px] font-medium tracking-[0.25em] uppercase mb-6" style={{ color: accentColor }}>
            Experience
          </h2>
          <div className="space-y-6">
            {resumeData.experience.map((exp, index) => (
              exp.company && (
                <div key={index}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-medium text-gray-900 text-[14px]">{exp.position}</h3>
                    <span className="text-gray-400 text-[11px]">{exp.duration}</span>
                  </div>
                  <p className="text-[12px] mb-2" style={{ color: accentColor }}>{exp.company}</p>
                  {exp.description && (
                    <p className="text-gray-500 leading-[1.8]">{exp.description}</p>
                  )}
                </div>
              )
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {resumeData.education.some(edu => edu.institution) && (
        <div className="mb-10">
          <h2 className="text-[11px] font-medium tracking-[0.25em] uppercase mb-6" style={{ color: accentColor }}>
            Education
          </h2>
          {resumeData.education.map((edu, index) => (
            edu.institution && (
              <div key={index} className="mb-3 last:mb-0 flex justify-between items-baseline">
                <div>
                  <h3 className="font-medium text-gray-900">{edu.degree}</h3>
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
          <h2 className="text-[11px] font-medium tracking-[0.25em] uppercase mb-4" style={{ color: accentColor }}>
            Skills
          </h2>
          <p className="text-gray-500">
            {resumeData.skills.join("  —  ")}
          </p>
        </div>
      )}
    </div>
  );
};
