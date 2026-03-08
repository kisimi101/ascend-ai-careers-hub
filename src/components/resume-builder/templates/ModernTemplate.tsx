import { ResumeData } from "../types";

interface TemplateProps {
  resumeData: ResumeData;
}

export const ModernTemplate = ({ resumeData }: TemplateProps) => {
  return (
    <div className="bg-white p-8 text-[13px] leading-relaxed text-gray-800 font-sans">
      {/* Header */}
      <div className="pb-5 mb-6 border-b-[3px] border-[#2563eb]">
        <h1 className="text-[26px] font-extrabold tracking-tight text-gray-900 mb-1">
          {resumeData.personalInfo.fullName || "Your Name"}
        </h1>
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-gray-500 text-[12px]">
          {resumeData.personalInfo.email && (
            <span>{resumeData.personalInfo.email}</span>
          )}
          {resumeData.personalInfo.phone && (
            <span>{resumeData.personalInfo.phone}</span>
          )}
          {resumeData.personalInfo.location && (
            <span>{resumeData.personalInfo.location}</span>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {resumeData.personalInfo.summary && (
        <div className="mb-6">
          <h2 className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#2563eb] mb-2">
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-[1.7]">{resumeData.personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {resumeData.experience.some(exp => exp.company) && (
        <div className="mb-6">
          <h2 className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#2563eb] mb-3">
            Professional Experience
          </h2>
          {resumeData.experience.map((exp, index) => (
            exp.company && (
              <div key={index} className="mb-4 last:mb-0">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3 className="font-bold text-gray-900 text-[14px]">{exp.position}</h3>
                  <span className="text-gray-400 text-[11px] whitespace-nowrap ml-4">{exp.duration}</span>
                </div>
                <p className="text-[#2563eb] font-medium text-[12px] mb-1.5">{exp.company}</p>
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
          <h2 className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#2563eb] mb-3">
            Education
          </h2>
          {resumeData.education.map((edu, index) => (
            edu.institution && (
              <div key={index} className="mb-2 last:mb-0 flex justify-between items-baseline">
                <div>
                  <h3 className="font-bold text-gray-900 text-[13px]">{edu.degree}</h3>
                  <p className="text-[#2563eb] text-[12px]">{edu.institution}</p>
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
          <h2 className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#2563eb] mb-3">
            Core Competencies
          </h2>
          <div className="flex flex-wrap gap-2">
            {resumeData.skills.map((skill, index) => (
              <span key={index} className="px-3 py-1 rounded-full bg-[#eff6ff] text-[#2563eb] text-[11px] font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
