
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { addDays, isSameDay, format } from 'date-fns';

interface StudyDay {
  date: Date;
  intensity: 1 | 2 | 3; // 1 = light, 2 = medium, 3 = intense
}

const StreakCalendar = () => {
  const [studyDays, setStudyDays] = useState<StudyDay[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [selected, setSelected] = useState<Date>(new Date());
  
  // Initialize with mock data
  useEffect(() => {
    // Generate some mock study days for the last 30 days
    const today = new Date();
    const mockStudyDays: StudyDay[] = [];
    
    // Create a pattern of study days (skipping some days to break the streak)
    for (let i = 30; i >= 0; i--) {
      // Skip some random days (to simulate days without study)
      if (i % 7 === 0 || i === 12 || i === 18) continue;
      
      const date = addDays(today, -i);
      const intensity = (i % 3 + 1) as 1 | 2 | 3;
      mockStudyDays.push({ date, intensity });
    }
    
    setStudyDays(mockStudyDays);
    
    // Calculate current streak
    calculateStreak(mockStudyDays);
    
    // Store in localStorage
    localStorage.setItem('jeeTrackerStudyDays', JSON.stringify(
      mockStudyDays.map(day => ({ date: day.date.toISOString(), intensity: day.intensity }))
    ));
  }, []);
  
  // Load data from localStorage if available
  useEffect(() => {
    const savedData = localStorage.getItem('jeeTrackerStudyDays');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        const loadedDays: StudyDay[] = parsedData.map((item: any) => ({
          date: new Date(item.date),
          intensity: item.intensity
        }));
        setStudyDays(loadedDays);
        calculateStreak(loadedDays);
      } catch (error) {
        console.error("Error loading study days from localStorage", error);
      }
    }
  }, []);
  
  const calculateStreak = (days: StudyDay[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Sort days in descending order (newest first)
    const sortedDays = [...days].sort((a, b) => b.date.getTime() - a.date.getTime());
    
    let streak = 0;
    let currentDay = today;
    
    // If the most recent study day is today, start counting from today
    const hasStudiedToday = sortedDays.some(day => isSameDay(day.date, today));
    
    if (hasStudiedToday) {
      streak = 1;
      currentDay = addDays(today, -1); // Move to yesterday
    } else {
      // If no study today, check if yesterday was a study day
      const yesterday = addDays(today, -1);
      const hasStudiedYesterday = sortedDays.some(day => isSameDay(day.date, yesterday));
      
      if (!hasStudiedYesterday) {
        setCurrentStreak(0);
        return; // Streak broken
      }
      
      currentDay = yesterday;
      streak = 1;
      currentDay = addDays(currentDay, -1); // Move to day before yesterday
    }
    
    // Continue counting backwards until we find a day without study
    let streakBroken = false;
    while (!streakBroken) {
      const hasStudied = sortedDays.some(day => isSameDay(day.date, currentDay));
      if (hasStudied) {
        streak++;
        currentDay = addDays(currentDay, -1);
      } else {
        streakBroken = true;
      }
    }
    
    setCurrentStreak(streak);
  };
  
  // Add new study day 
  const markDayAsStudied = (date: Date, intensity: 1 | 2 | 3) => {
    // Remove existing entry for this day if it exists
    const filteredDays = studyDays.filter(day => !isSameDay(day.date, date));
    
    // Add the new entry
    const newStudyDays = [...filteredDays, { date, intensity }];
    
    setStudyDays(newStudyDays);
    calculateStreak(newStudyDays);
    
    // Update localStorage
    localStorage.setItem('jeeTrackerStudyDays', JSON.stringify(
      newStudyDays.map(day => ({ date: day.date.toISOString(), intensity: day.intensity }))
    ));
  };
  
  // Day cell render function - check if this day has a study record
  const renderDay = (date: Date | undefined) => {
    // Make sure date is defined before proceeding
    if (!date) return null;
    
    const studyDay = studyDays.find(day => day && date && isSameDay(day.date, date));
    if (!studyDay) return null;
    
    let bgColorClass = '';
    switch (studyDay.intensity) {
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
  
  // Handle day click to mark as studied
  const handleDayClick = (date: Date | undefined) => {
    if (!date) return;
    
    setSelected(date);
    
    // Find if we already have an intensity for this date
    const existingDay = studyDays.find(day => isSameDay(day.date, date));
    
    // Cycle through intensities or start with 1 if not marked yet
    let newIntensity: 1 | 2 | 3 = 1;
    if (existingDay) {
      newIntensity = existingDay.intensity < 3 
        ? (existingDay.intensity + 1) as 1 | 2 | 3 
        : 1;
    }
    
    markDayAsStudied(date, newIntensity);
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
          selected={selected}
          onSelect={(date) => date && handleDayClick(date)}
          className="rounded-md border shadow pointer-events-auto"
          components={{
            DayContent: (props) => {
              const date = props.date;
              return (
                <div className="relative w-full h-full flex items-center justify-center cursor-pointer">
                  {renderDay(date)}
                  <span className="z-10 text-sm relative">
                    {date ? date.getDate() : ''}
                  </span>
                </div>
              );
            }
          }}
        />
        <div className="flex justify-between mt-4 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-jee-light/50"></div>
            <span>Light</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-jee-accent/60"></div>
            <span>Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-jee-primary"></div>
            <span>Intense</span>
          </div>
        </div>
        <p className="text-xs text-center mt-4 text-gray-500">Click on any day to mark as studied</p>
      </CardContent>
    </Card>
  );
};

export default StreakCalendar;
