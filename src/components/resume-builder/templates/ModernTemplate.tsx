import { ResumeData } from "../types";

interface TemplateProps {
  resumeData: ResumeData;
}

export const ModernTemplate = ({ resumeData }: TemplateProps) => {
  return (
    <div className="bg-white p-6 text-sm leading-relaxed">
      {/* Header */}
      <div className="border-b-2 border-primary pb-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {resumeData.personalInfo.fullName || "Your Name"}
        </h1>
        <div className="flex flex-wrap gap-4 text-gray-600">
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
          <h2 className="text-lg font-semibold text-primary border-b border-primary/30 pb-1 mb-3">
            PROFESSIONAL SUMMARY
          </h2>
          <p className="text-gray-700 leading-relaxed">{resumeData.personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {resumeData.experience.some(exp => exp.company) && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-primary border-b border-primary/30 pb-1 mb-3">
            PROFESSIONAL EXPERIENCE
          </h2>
          {resumeData.experience.map((exp, index) => (
            exp.company && (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                  <span className="text-gray-600 text-sm">{exp.duration}</span>
                </div>
                <p className="text-primary font-medium mb-2">{exp.company}</p>
                {exp.description && (
                  <p className="text-gray-700 leading-relaxed">{exp.description}</p>
                )}
              </div>
            )
          ))}
        </div>
      )}

      {/* Education */}
      {resumeData.education.some(edu => edu.institution) && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-primary border-b border-primary/30 pb-1 mb-3">
            EDUCATION
          </h2>
          {resumeData.education.map((edu, index) => (
            edu.institution && (
              <div key={index} className="mb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                    <p className="text-primary">{edu.institution}</p>
                  </div>
                  <span className="text-gray-600 text-sm">{edu.year}</span>
                </div>
              </div>
            )
          ))}
        </div>
      )}

      {/* Skills */}
      {resumeData.skills.length > 0 && resumeData.skills[0] && (
        <div>
          <h2 className="text-lg font-semibold text-primary border-b border-primary/30 pb-1 mb-3">
            CORE COMPETENCIES
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {resumeData.skills.map((skill, index) => (
              <div key={index} className="text-gray-700">
                • {skill}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};