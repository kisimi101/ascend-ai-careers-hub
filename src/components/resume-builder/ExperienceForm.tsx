
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface Experience {
  company: string;
  position: string;
  duration: string;
  description: string;
}

interface ExperienceFormProps {
  experience: Experience[];
  onUpdate: (experience: Experience[]) => void;
  onAdd: () => void;
}

export const ExperienceForm = ({ experience, onUpdate, onAdd }: ExperienceFormProps) => {
  const handleChange = (index: number, field: keyof Experience, value: string) => {
    const newExp = [...experience];
    newExp[index][field] = value;
    onUpdate(newExp);
  };

  return (
    <>
      {experience.map((exp, index) => (
        <div key={index} className="border p-4 rounded-lg space-y-2">
          <Input
            placeholder="Company Name"
            value={exp.company}
            onChange={(e) => handleChange(index, 'company', e.target.value)}
          />
          <Input
            placeholder="Position"
            value={exp.position}
            onChange={(e) => handleChange(index, 'position', e.target.value)}
          />
          <Input
            placeholder="Duration (e.g., 2020-2023)"
            value={exp.duration}
            onChange={(e) => handleChange(index, 'duration', e.target.value)}
          />
          <Textarea
            placeholder="Job Description"
            value={exp.description}
            onChange={(e) => handleChange(index, 'description', e.target.value)}
          />
        </div>
      ))}
      <Button onClick={onAdd} variant="outline" className="w-full">
        Add Another Experience
      </Button>
    </>
  );
};
