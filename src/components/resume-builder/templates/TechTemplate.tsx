import { ResumeData } from "../types";

interface TemplateProps {
  resumeData: ResumeData;
}

export const TechTemplate = ({ resumeData }: TemplateProps) => {
  return (
    <div className="bg-white p-8 text-[13px] leading-relaxed font-mono text-gray-800">
      {/* Header */}
      <div className="border-l-4 border-emerald-500 pl-5 mb-7">
        <h1 className="text-[24px] font-bold text-gray-900 mb-1 tracking-tight">
          {resumeData.personalInfo.fullName || "Your Name"}
        </h1>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-gray-500 text-[11px]">
          {resumeData.personalInfo.email && (
            <span>✉ {resumeData.personalInfo.email}</span>
          )}
          {resumeData.personalInfo.phone && (
            <span>☎ {resumeData.personalInfo.phone}</span>
          )}
          {resumeData.personalInfo.location && (
            <span>⌘ {resumeData.personalInfo.location}</span>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {resumeData.personalInfo.summary && (
        <div className="mb-6">
          <h2 className="text-[11px] font-bold tracking-[0.15em] uppercase text-emerald-600 mb-2">
            // summary
          </h2>
          <div className="bg-gray-50 border border-gray-100 rounded-md p-4">
            <p className="text-gray-700 leading-[1.7]">{resumeData.personalInfo.summary}</p>
          </div>
        </div>
      )}

      {/* Experience */}
      {resumeData.experience.some(exp => exp.company) && (
        <div className="mb-6">
          <h2 className="text-[11px] font-bold tracking-[0.15em] uppercase text-emerald-600 mb-3">
            // experience
          </h2>
          {resumeData.experience.map((exp, index) => (
            exp.company && (
              <div key={index} className="mb-4 last:mb-0 pl-4 border-l-2 border-gray-200">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3 className="font-bold text-gray-900 text-[13px]">{exp.position}</h3>
                  <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded font-medium">
                    {exp.duration}
                  </span>
                </div>
                <p className="text-emerald-600 font-semibold text-[12px] mb-1">{exp.company}</p>
                {exp.description && (
                  <p className="text-gray-600 leading-[1.7]">{exp.description}</p>
                )}
              </div>
            )
          ))}
        </div>
      )}

      {/* Skills */}
      {resumeData.skills.length > 0 && resumeData.skills[0] && (
        <div className="mb-6">
          <h2 className="text-[11px] font-bold tracking-[0.15em] uppercase text-emerald-600 mb-3">
            // tech_stack
          </h2>
          <div className="flex flex-wrap gap-2">
            {resumeData.skills.map((skill, index) => (
              <span key={index} className="px-3 py-1 rounded bg-gray-900 text-emerald-400 text-[11px] font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {resumeData.education.some(edu => edu.institution) && (
        <div>
          <h2 className="text-[11px] font-bold tracking-[0.15em] uppercase text-emerald-600 mb-3">
            // education
          </h2>
          {resumeData.education.map((edu, index) => (
            edu.institution && (
              <div key={index} className="mb-2 last:mb-0 pl-4 border-l-2 border-gray-200 flex justify-between items-baseline">
                <div>
                  <h3 className="font-bold text-gray-900 text-[13px]">{edu.degree}</h3>
                  <p className="text-emerald-600 text-[12px]">{edu.institution}</p>
                </div>
                <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                  {edu.year}
                </span>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
};
