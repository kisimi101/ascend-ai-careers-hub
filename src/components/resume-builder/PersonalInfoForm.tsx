
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
}

interface PersonalInfoFormProps {
  personalInfo: PersonalInfo;
  onUpdate: (personalInfo: PersonalInfo) => void;
}

export const PersonalInfoForm = ({ personalInfo, onUpdate }: PersonalInfoFormProps) => {
  const handleChange = (field: keyof PersonalInfo, value: string) => {
    onUpdate({ ...personalInfo, [field]: value });
  };

  return (
    <>
      <Input
        placeholder="Full Name"
        value={personalInfo.fullName}
        onChange={(e) => handleChange('fullName', e.target.value)}
      />
      <Input
        placeholder="Email"
        type="email"
        value={personalInfo.email}
        onChange={(e) => handleChange('email', e.target.value)}
      />
      <Input
        placeholder="Phone"
        value={personalInfo.phone}
        onChange={(e) => handleChange('phone', e.target.value)}
      />
      <Input
        placeholder="Location"
        value={personalInfo.location}
        onChange={(e) => handleChange('location', e.target.value)}
      />
      <Textarea
        placeholder="Professional Summary"
        value={personalInfo.summary}
        onChange={(e) => handleChange('summary', e.target.value)}
      />
    </>
  );
};
