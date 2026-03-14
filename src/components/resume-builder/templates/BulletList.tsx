interface BulletListProps {
  description: string;
  bulletColor?: string;
  textClassName?: string;
}

export const BulletList = ({ description, bulletColor, textClassName = "text-gray-600" }: BulletListProps) => {
  const lines = description.split('\n').filter(line => line.trim());
  
  if (lines.length <= 1) {
    // Single line — still render as a bullet for consistency
    return (
      <ul className={`${textClassName} list-none space-y-1 mt-1`}>
        <li className="flex gap-1.5">
          <span className="mt-0.5 flex-shrink-0" style={bulletColor ? { color: bulletColor } : undefined}>▸</span>
          <span>{description}</span>
        </li>
      </ul>
    );
  }

  return (
    <ul className={`${textClassName} list-none space-y-1 mt-1`}>
      {lines.map((line, i) => (
        <li key={i} className="flex gap-1.5">
          <span className="mt-0.5 flex-shrink-0" style={bulletColor ? { color: bulletColor } : undefined}>▸</span>
          <span>{line.replace(/^[-•▸*]\s*/, '').trim()}</span>
        </li>
      ))}
    </ul>
  );
};
