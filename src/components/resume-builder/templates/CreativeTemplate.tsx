import { ResumeData } from "../types";

interface TemplateProps {
  resumeData: ResumeData;
}

export const CreativeTemplate = ({ resumeData }: TemplateProps) => {
  return (
    <div className="bg-white text-sm leading-relaxed">
      {/* Header with colored sidebar */}
      <div className="flex">
        {/* Left sidebar */}
        <div className="w-1/3 bg-gradient-to-b from-primary to-primary-variant text-white p-6">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-3 flex items-center justify-center">
              <span className="text-2xl font-bold">
                {resumeData.personalInfo.fullName ? resumeData.personalInfo.fullName.charAt(0) : "?"}
              </span>
            </div>
            <h1 className="text-xl font-bold mb-2">
              {resumeData.personalInfo.fullName || "Your Name"}
            </h1>
          </div>

          {/* Contact */}
          <div className="mb-6">
            <h3 className="font-bold mb-3 text-white/90">CONTACT</h3>
            <div className="space-y-2 text-white/80 text-xs">
              {resumeData.personalInfo.email && (
                <div>📧 {resumeData.personalInfo.email}</div>
              )}
              {resumeData.personalInfo.phone && (
                <div>📱 {resumeData.personalInfo.phone}</div>
              )}
              {resumeData.personalInfo.location && (
                <div>📍 {resumeData.personalInfo.location}</div>
              )}
            </div>
          </div>

          {/* Skills */}
          {resumeData.skills.length > 0 && resumeData.skills[0] && (
            <div>
              <h3 className="font-bold mb-3 text-white/90">SKILLS</h3>
              <div className="space-y-2">
                {resumeData.skills.map((skill, index) => (
                  <div key={index} className="text-white/80 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span>{skill}</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-1">
                      <div className="bg-white h-1 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right content */}
        <div className="w-2/3 p-6">
          {/* Professional Summary */}
          {resumeData.personalInfo.summary && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3 relative">
                <span className="bg-primary text-white px-3 py-1 rounded">PROFILE</span>
              </h2>
              <p className="text-gray-700 leading-relaxed mt-4">{resumeData.personalInfo.summary}</p>
            </div>
          )}

          {/* Experience */}
          {resumeData.experience.some(exp => exp.company) && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3 relative">
                <span className="bg-primary text-white px-3 py-1 rounded">EXPERIENCE</span>
              </h2>
              <div className="mt-4">
                {resumeData.experience.map((exp, index) => (
                  exp.company && (
                    <div key={index} className="mb-4 relative">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h3 className="font-bold text-gray-900">{exp.position}</h3>
                          <p className="text-primary font-semibold">{exp.company}</p>
                        </div>
                        <span className="text-gray-600 text-sm bg-gray-100 px-2 py-1 rounded">
                          {exp.duration}
                        </span>
                      </div>
                      {exp.description && (
                        <p className="text-gray-700 leading-relaxed mt-2">{exp.description}</p>
                      )}
                      {index < resumeData.experience.length - 1 && (
                        <div className="absolute left-0 top-12 w-px h-8 bg-primary/30"></div>
                      )}
                    </div>
                  )
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {resumeData.education.some(edu => edu.institution) && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3 relative">
                <span className="bg-primary text-white px-3 py-1 rounded">EDUCATION</span>
              </h2>
              <div className="mt-4">
                {resumeData.education.map((edu, index) => (
                  edu.institution && (
                    <div key={index} className="mb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                          <p className="text-primary">{edu.institution}</p>
                        </div>
                        <span className="text-gray-600 text-sm bg-gray-100 px-2 py-1 rounded">
                          {edu.year}
                        </span>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};