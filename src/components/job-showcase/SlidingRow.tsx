
import { JobCard } from "./JobCard";

interface Job {
  id: number;
  title: string;
  image: string;
  description: string;
  company: string;
  salary: string;
}

interface SlidingRowProps {
  jobs: Job[];
  direction: 'left' | 'right';
  speed: number;
}

export const SlidingRow = ({ jobs, direction, speed }: SlidingRowProps) => {
  return (
    <div className="relative overflow-hidden py-4">
      <div 
        className={`flex space-x-4 ${
          direction === 'left' ? 'animate-slide-left' : 'animate-slide-right'
        }`}
        style={{
          animationDuration: `${speed}s`,
          animationIterationCount: 'infinite',
          animationTimingFunction: 'linear'
        }}
      >
        {/* Duplicate the jobs array to create seamless loop */}
        {[...jobs, ...jobs].map((job, index) => (
          <JobCard key={`${job.id}-${index}`} job={job} index={index} />
        ))}
      </div>
    </div>
  );
};
