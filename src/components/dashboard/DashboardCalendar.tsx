import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Briefcase, Target } from "lucide-react";
import { format, isSameDay } from "date-fns";

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'interview' | 'milestone';
  company?: string;
  status?: string;
}

interface DashboardCalendarProps {
  interviews: {
    id: string;
    company: string;
    position: string;
    interviewDate: string;
    status: string;
  }[];
  milestones: {
    id: string;
    title: string;
    targetDate: string;
    planTitle: string;
    completed: boolean;
  }[];
}

export const DashboardCalendar = ({ interviews, milestones }: DashboardCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Convert interviews and milestones to calendar events
  const events: CalendarEvent[] = [
    ...interviews.map((interview) => ({
      id: interview.id,
      title: `${interview.position} at ${interview.company}`,
      date: new Date(interview.interviewDate),
      type: 'interview' as const,
      company: interview.company,
      status: interview.status,
    })),
    ...milestones
      .filter((m) => !m.completed)
      .map((milestone) => ({
        id: milestone.id,
        title: milestone.title,
        date: new Date(milestone.targetDate),
        type: 'milestone' as const,
      })),
  ];

  // Get events for the selected date
  const selectedDateEvents = selectedDate
    ? events.filter((event) => isSameDay(event.date, selectedDate))
    : [];

  // Get dates that have events
  const eventDates = events.map((event) => event.date);

  // Custom day content to show dots for events
  const modifiers = {
    hasInterview: events
      .filter((e) => e.type === 'interview')
      .map((e) => e.date),
    hasMilestone: events
      .filter((e) => e.type === 'milestone')
      .map((e) => e.date),
  };

  const modifiersStyles = {
    hasInterview: {
      position: 'relative' as const,
    },
    hasMilestone: {
      position: 'relative' as const,
    },
  };

  return (
    <Card className="card-enhanced">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5" />
          Schedule Overview
        </CardTitle>
        <CardDescription>View your interviews and milestone deadlines</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Calendar */}
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              modifiers={modifiers}
              modifiersStyles={modifiersStyles}
              className="rounded-lg border border-border"
              components={{
                DayContent: ({ date }) => {
                  const hasInterview = events.some(
                    (e) => e.type === 'interview' && isSameDay(e.date, date)
                  );
                  const hasMilestone = events.some(
                    (e) => e.type === 'milestone' && isSameDay(e.date, date)
                  );
                  return (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <span>{date.getDate()}</span>
                      {(hasInterview || hasMilestone) && (
                        <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 flex gap-0.5">
                          {hasInterview && (
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                          )}
                          {hasMilestone && (
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          )}
                        </div>
                      )}
                    </div>
                  );
                },
              }}
            />
          </div>

          {/* Selected Date Events */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">
                {selectedDate
                  ? format(selectedDate, "EEEE, MMMM d, yyyy")
                  : "Select a date"}
              </h3>
            </div>

            {selectedDateEvents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarDays className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p>No events scheduled</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedDateEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-3 rounded-lg border border-border bg-background hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          event.type === 'interview'
                            ? 'bg-purple-100 dark:bg-purple-900/30'
                            : 'bg-primary/10'
                        }`}
                      >
                        {event.type === 'interview' ? (
                          <Briefcase
                            className={`w-4 h-4 ${
                              event.type === 'interview'
                                ? 'text-purple-600 dark:text-purple-400'
                                : 'text-primary'
                            }`}
                          />
                        ) : (
                          <Target className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-foreground text-sm">
                            {event.title}
                          </p>
                          <Badge
                            variant="outline"
                            className={
                              event.type === 'interview'
                                ? 'border-purple-300 text-purple-600 dark:border-purple-700 dark:text-purple-400'
                                : 'border-primary/30 text-primary'
                            }
                          >
                            {event.type === 'interview' ? 'Interview' : 'Milestone'}
                          </Badge>
                        </div>
                        {event.company && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {event.company}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Legend */}
            <div className="flex items-center gap-4 pt-4 border-t border-border text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                <span>Interview</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span>Milestone</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
