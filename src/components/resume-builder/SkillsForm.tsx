
import { Textarea } from "@/components/ui/textarea";

interface SkillsFormProps {
  skills: string[];
  onUpdate: (skills: string[]) => void;
}

export const SkillsForm = ({ skills, onUpdate }: SkillsFormProps) => {
  const handleChange = (value: string) => {
    const skillsArray = value.split(',').map(skill => skill.trim());
    onUpdate(skillsArray);
  };

  return (
    <div>
      <Textarea
        placeholder="Enter your skills separated by commas (e.g., JavaScript, React, Node.js)"
        defaultValue={skills.join(', ')}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
};
