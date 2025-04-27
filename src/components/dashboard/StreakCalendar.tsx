
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';

const StreakCalendar = () => {
  // We're using today's date for the current view
  const today = new Date();
  
  // Mock study days data for the calendar
  // 1 = light study, 2 = medium study, 3 = intense study
  const studyDays = {
    [new Date(today.getFullYear(), today.getMonth(), 2).toDateString()]: 2,
    [new Date(today.getFullYear(), today.getMonth(), 3).toDateString()]: 3,
    [new Date(today.getFullYear(), today.getMonth(), 4).toDateString()]: 3,
    [new Date(today.getFullYear(), today.getMonth(), 5).toDateString()]: 1,
    [new Date(today.getFullYear(), today.getMonth(), 8).toDateString()]: 2,
    [new Date(today.getFullYear(), today.getMonth(), 9).toDateString()]: 1,
    [new Date(today.getFullYear(), today.getMonth(), 10).toDateString()]: 3,
    [new Date(today.getFullYear(), today.getMonth(), 11).toDateString()]: 3,
    [new Date(today.getFullYear(), today.getMonth(), 15).toDateString()]: 2,
    [new Date(today.getFullYear(), today.getMonth(), 16).toDateString()]: 3,
    [new Date(today.getFullYear(), today.getMonth(), 17).toDateString()]: 2,
    [new Date(today.getFullYear(), today.getMonth(), 18).toDateString()]: 1,
    [new Date(today.getFullYear(), today.getMonth(), 22).toDateString()]: 3,
    [new Date(today.getFullYear(), today.getMonth(), 23).toDateString()]: 3,
    [new Date(today.getFullYear(), today.getMonth(), 24).toDateString()]: 2,
    [new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1).toDateString()]: 3,
  };

  const currentStreak = 15; // Mock streak count

  // Day cell render function
  const renderDay = (day: Date) => {
    const dateString = day.toDateString();
    const intensity = studyDays[dateString];
    
    if (!intensity) return null;
    
    let bgColorClass = '';
    switch (intensity) {
      case 1:
        bgColorClass = 'bg-jee-light/50';
        break;
      case 2:
        bgColorClass = 'bg-jee-accent/60';
        break;
      case 3:
        bgColorClass = 'bg-jee-primary';
        break;
      default:
        return null;
    }
    
    return (
      <div className="h-full w-full absolute flex items-center justify-center">
        <div className={`h-[80%] w-[80%] rounded-full ${bgColorClass}`}></div>
      </div>
    );
  };

  return (
    <Card className="col-span-1">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Study Streak</CardTitle>
            <CardDescription>Track your daily study consistency</CardDescription>
          </div>
          <div className="bg-jee-muted text-jee-primary dark:bg-gray-800 dark:text-jee-accent font-medium px-3 py-1 rounded-full text-sm">
            {currentStreak} days 🔥
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <Calendar
          mode="single"
          selected={today}
          className="rounded-md border shadow"
          components={{
            DayContent: ({ day }) => (
              <div className="relative w-full h-full flex items-center justify-center">
                {renderDay(day)}
                <span className="z-10 text-sm relative">
                  {day.getDate()}
                </span>
              </div>
            )
          }}
        />
      </CardContent>
    </Card>
  );
};

export default StreakCalendar;
