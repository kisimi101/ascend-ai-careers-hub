import { ResumeData } from "../types";

interface TemplateProps {
  resumeData: ResumeData;
}

export const CreativeTemplate = ({ resumeData }: TemplateProps) => {
  return (
    <div className="bg-white text-[13px] leading-relaxed flex min-h-full">
      {/* Left sidebar */}
      <div className="w-[35%] bg-gradient-to-b from-[#6d28d9] to-[#4c1d95] text-white p-6 flex-shrink-0">
        {/* Avatar initial */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-white/15 rounded-full mx-auto mb-3 flex items-center justify-center backdrop-blur-sm">
            <span className="text-[22px] font-bold text-white/90">
              {resumeData.personalInfo.fullName ? resumeData.personalInfo.fullName.charAt(0).toUpperCase() : "?"}
            </span>
          </div>
          <h1 className="text-[17px] font-bold leading-tight">
            {resumeData.personalInfo.fullName || "Your Name"}
          </h1>
        </div>

        {/* Contact */}
        <div className="mb-6">
          <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/60 mb-3">Contact</h3>
          <div className="space-y-2 text-white/80 text-[11px]">
            {resumeData.personalInfo.email && (
              <div className="break-all">{resumeData.personalInfo.email}</div>
            )}
            {resumeData.personalInfo.phone && (
              <div>{resumeData.personalInfo.phone}</div>
            )}
            {resumeData.personalInfo.location && (
              <div>{resumeData.personalInfo.location}</div>
            )}
          </div>
        </div>

        {/* Skills */}
        {resumeData.skills.length > 0 && resumeData.skills[0] && (
          <div>
            <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/60 mb-3">Skills</h3>
            <div className="space-y-2">
              {resumeData.skills.map((skill, index) => (
                <div key={index} className="text-[11px]">
                  <span className="text-white/90">{skill}</span>
                  <div className="w-full bg-white/15 rounded-full h-1 mt-1">
                    <div
                      className="bg-white/70 h-1 rounded-full"
                      style={{ width: `${75 + ((index * 7) % 25)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right content */}
      <div className="w-[65%] p-7">
        {/* Profile */}
        {resumeData.personalInfo.summary && (
          <div className="mb-6">
            <h2 className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#6d28d9] mb-2">
              Profile
            </h2>
            <p className="text-gray-700 leading-[1.7]">{resumeData.personalInfo.summary}</p>
          </div>
        )}

        {/* Experience */}
        {resumeData.experience.some(exp => exp.company) && (
          <div className="mb-6">
            <h2 className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#6d28d9] mb-3">
              Experience
            </h2>
            {resumeData.experience.map((exp, index) => (
              exp.company && (
                <div key={index} className="mb-4 last:mb-0 relative pl-4 border-l-2 border-[#6d28d9]/20">
                  <div className="absolute w-2 h-2 rounded-full bg-[#6d28d9] -left-[5px] top-1" />
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="font-bold text-gray-900 text-[13px]">{exp.position}</h3>
                    <span className="text-gray-400 text-[11px] ml-3 whitespace-nowrap">{exp.duration}</span>
                  </div>
                  <p className="text-[#6d28d9] font-semibold text-[12px] mb-1">{exp.company}</p>
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
          <div>
            <h2 className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#6d28d9] mb-3">
              Education
            </h2>
            {resumeData.education.map((edu, index) => (
              edu.institution && (
                <div key={index} className="mb-2 last:mb-0 flex justify-between items-baseline">
                  <div>
                    <h3 className="font-bold text-gray-900 text-[13px]">{edu.degree}</h3>
                    <p className="text-[#6d28d9] text-[12px]">{edu.institution}</p>
                  </div>
                  <span className="text-gray-400 text-[11px]">{edu.year}</span>
                </div>
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
