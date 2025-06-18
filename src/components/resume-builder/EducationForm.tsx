
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Education {
  institution: string;
  degree: string;
  year: string;
}

interface EducationFormProps {
  education: Education[];
  onUpdate: (education: Education[]) => void;
  onAdd: () => void;
}

export const EducationForm = ({ education, onUpdate, onAdd }: EducationFormProps) => {
  const handleChange = (index: number, field: keyof Education, value: string) => {
    const newEdu = [...education];
    newEdu[index][field] = value;
    onUpdate(newEdu);
  };

  return (
    <>
      {education.map((edu, index) => (
        <div key={index} className="border p-4 rounded-lg space-y-2">
          <Input
            placeholder="Institution"
            value={edu.institution}
            onChange={(e) => handleChange(index, 'institution', e.target.value)}
          />
          <Input
            placeholder="Degree"
            value={edu.degree}
            onChange={(e) => handleChange(index, 'degree', e.target.value)}
          />
          <Input
            placeholder="Year"
            value={edu.year}
            onChange={(e) => handleChange(index, 'year', e.target.value)}
          />
        </div>
      ))}
      <Button onClick={onAdd} variant="outline" className="w-full">
        Add Another Education
      </Button>
    </>
  );
};
