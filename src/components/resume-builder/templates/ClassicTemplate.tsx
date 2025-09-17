import { ResumeData } from "../types";

interface TemplateProps {
  resumeData: ResumeData;
}

export const ClassicTemplate = ({ resumeData }: TemplateProps) => {
  return (
    <div className="bg-white p-6 text-sm leading-relaxed">
      {/* Header */}
      <div className="text-center border-b-2 border-gray-300 pb-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {resumeData.personalInfo.fullName || "Your Name"}
        </h1>
        <div className="text-gray-600 space-y-1">
          {resumeData.personalInfo.email && (
            <div>{resumeData.personalInfo.email}</div>
          )}
          <div className="flex justify-center gap-4">
            {resumeData.personalInfo.phone && (
              <span>{resumeData.personalInfo.phone}</span>
            )}
            {resumeData.personalInfo.location && (
              <span>{resumeData.personalInfo.location}</span>
            )}
          </div>
        </div>
      </div>

      {/* Professional Summary */}
      {resumeData.personalInfo.summary && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 text-center">
            PROFESSIONAL SUMMARY
          </h2>
          <p className="text-gray-700 leading-relaxed text-justify">{resumeData.personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {resumeData.experience.some(exp => exp.company) && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 text-center">
            PROFESSIONAL EXPERIENCE
          </h2>
          {resumeData.experience.map((exp, index) => (
            exp.company && (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-bold text-gray-900">{exp.position}</h3>
                    <p className="text-gray-700 font-medium">{exp.company}</p>
                  </div>
                  <span className="text-gray-600 text-sm font-medium">{exp.duration}</span>
                </div>
                {exp.description && (
                  <p className="text-gray-700 leading-relaxed mt-2 text-justify">{exp.description}</p>
                )}
              </div>
            )
          ))}
        </div>
      )}

      {/* Education */}
      {resumeData.education.some(edu => edu.institution) && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 text-center">
            EDUCATION
          </h2>
          {resumeData.education.map((edu, index) => (
            edu.institution && (
              <div key={index} className="mb-3 text-center">
                <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                <p className="text-gray-700">{edu.institution}</p>
                <span className="text-gray-600 text-sm">{edu.year}</span>
              </div>
            )
          ))}
        </div>
      )}

      {/* Skills */}
      {resumeData.skills.length > 0 && resumeData.skills[0] && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3 text-center">
            TECHNICAL SKILLS
          </h2>
          <div className="text-center">
            <p className="text-gray-700">
              {resumeData.skills.join(" • ")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};