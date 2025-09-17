import { ResumeData } from "../types";

interface TemplateProps {
  resumeData: ResumeData;
}

export const TechTemplate = ({ resumeData }: TemplateProps) => {
  return (
    <div className="bg-white p-6 text-sm leading-relaxed font-mono">
      {/* Header */}
      <div className="border-l-4 border-accent pl-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          {resumeData.personalInfo.fullName || "Your Name"}
        </h1>
        <div className="text-gray-600 space-y-1">
          <div className="flex flex-wrap gap-4">
            {resumeData.personalInfo.email && (
              <span>📧 {resumeData.personalInfo.email}</span>
            )}
            {resumeData.personalInfo.phone && (
              <span>📱 {resumeData.personalInfo.phone}</span>
            )}
          </div>
          {resumeData.personalInfo.location && (
            <div>📍 {resumeData.personalInfo.location}</div>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {resumeData.personalInfo.summary && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-accent mb-3 flex items-center">
            <span className="mr-2">💭</span> SUMMARY
          </h2>
          <div className="bg-gray-50 p-3 border-l-2 border-accent">
            <p className="text-gray-700 leading-relaxed">{resumeData.personalInfo.summary}</p>
          </div>
        </div>
      )}

      {/* Experience */}
      {resumeData.experience.some(exp => exp.company) && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-accent mb-3 flex items-center">
            <span className="mr-2">💼</span> EXPERIENCE
          </h2>
          {resumeData.experience.map((exp, index) => (
            exp.company && (
              <div key={index} className="mb-4 border-l-2 border-gray-200 pl-4">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-bold text-gray-900">{exp.position}</h3>
                    <p className="text-accent font-semibold">{exp.company}</p>
                  </div>
                  <span className="text-gray-600 text-sm bg-gray-100 px-2 py-1 rounded">
                    {exp.duration}
                  </span>
                </div>
                {exp.description && (
                  <div className="mt-2">
                    <p className="text-gray-700 leading-relaxed">{exp.description}</p>
                  </div>
                )}
              </div>
            )
          ))}
        </div>
      )}

      {/* Skills */}
      {resumeData.skills.length > 0 && resumeData.skills[0] && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-accent mb-3 flex items-center">
            <span className="mr-2">🛠️</span> SKILLS
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {resumeData.skills.map((skill, index) => (
              <div key={index} className="bg-gray-50 px-3 py-1 rounded border-l-2 border-accent text-gray-700">
                {skill}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {resumeData.education.some(edu => edu.institution) && (
        <div>
          <h2 className="text-lg font-bold text-accent mb-3 flex items-center">
            <span className="mr-2">🎓</span> EDUCATION
          </h2>
          {resumeData.education.map((edu, index) => (
            edu.institution && (
              <div key={index} className="mb-3 border-l-2 border-gray-200 pl-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                    <p className="text-accent">{edu.institution}</p>
                  </div>
                  <span className="text-gray-600 text-sm bg-gray-100 px-2 py-1 rounded">
                    {edu.year}
                  </span>
                </div>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
};