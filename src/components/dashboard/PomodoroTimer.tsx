
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Pause, RotateCcw, Maximize, Minimize } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const PomodoroTimer = () => {
  const [activeTab, setActiveTab] = useState('pomodoro');
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [cycles, setCycles] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const timerContainerRef = useRef<HTMLDivElement>(null);
  
  // Timer durations in seconds
  const timerDurations = {
    pomodoro: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60
  };
  
  // Format time to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };
  
  useEffect(() => {
    // Reset timer when tab changes
    setTimeLeft(timerDurations[activeTab as keyof typeof timerDurations]);
    setIsRunning(false);
  }, [activeTab]);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      // Timer completed
      setIsRunning(false);
      
      if (activeTab === 'pomodoro') {
        // Play sound if browser allows
        try {
          const audio = new Audio('/notification.mp3');
          audio.play().catch(e => console.log('Auto play prevented:', e));
        } catch (e) {
          console.log('Audio playback error:', e);
        }

        // Show notification
        toast({
          title: "Pomodoro completed!",
          description: "Time to take a break.",
        });

        // Increment cycle count when pomodoro completes
        const newCycles = cycles + 1;
        setCycles(newCycles);
        
        // Switch to appropriate break based on completed pomodoro count
        if (newCycles % 4 === 0) {
          setActiveTab('longBreak');
        } else {
          setActiveTab('shortBreak');
        }
      } else {
        // Break completed, play sound if browser allows
        try {
          const audio = new Audio('/notification.mp3');
          audio.play().catch(e => console.log('Auto play prevented:', e));
        } catch (e) {
          console.log('Audio playback error:', e);
        }

        // Show notification
        toast({
          title: "Break completed!",
          description: "Time to focus again.",
        });

        // Switch back to pomodoro after break
        setActiveTab('pomodoro');
      }
    }
    
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, activeTab, cycles]);
  
  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(timerDurations[activeTab as keyof typeof timerDurations]);
  };
  
  // Calculate progress percentage
  const totalDuration = timerDurations[activeTab as keyof typeof timerDurations];
  const progress = ((totalDuration - timeLeft) / totalDuration) * 100;

  // Toggle fullscreen
  const toggleFullScreen = () => {
    if (!document.fullscreenElement && timerContainerRef.current) {
      // Enter fullscreen
      try {
        if (timerContainerRef.current.requestFullscreen) {
          timerContainerRef.current.requestFullscreen();
        }
        setIsFullscreen(true);
      } catch (e) {
        console.log('Error attempting to enable fullscreen:', e);
      }
    } else {
      // Exit fullscreen
      try {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
        setIsFullscreen(false);
      } catch (e) {
        console.log('Error attempting to exit fullscreen:', e);
      }
    }
  };
  
  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Add a style element for fullscreen mode if needed
  useEffect(() => {
    if (isFullscreen) {
      // Add fullscreen styles dynamically
      const styleElement = document.createElement('style');
      styleElement.innerHTML = `
        .fullscreen-card {
          background: var(--background);
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          border-radius: 0;
          border: none;
          transition: all 0.3s ease-in-out;
        }
      `;
      document.head.appendChild(styleElement);
      
      return () => {
        document.head.removeChild(styleElement);
      };
    }
  }, [isFullscreen]);

  return (
    <Card className={`col-span-1 ${isFullscreen ? 'fullscreen-card' : ''}`} ref={timerContainerRef}>
      <CardHeader className={`${isFullscreen ? 'pt-8' : ''}`}>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Pomodoro Timer</CardTitle>
            <CardDescription>Stay focused with timed work sessions</CardDescription>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full transition-transform hover:scale-110"
            onClick={toggleFullScreen}
          >
            {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className={`flex flex-col items-center ${isFullscreen ? 'scale-150 transform transition-all duration-300 pt-12' : ''}`}>
        <Tabs defaultValue="pomodoro" className="w-full" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="pomodoro">Pomodoro</TabsTrigger>
            <TabsTrigger value="shortBreak">Short Break</TabsTrigger>
            <TabsTrigger value="longBreak">Long Break</TabsTrigger>
          </TabsList>
          <TabsContent value="pomodoro" className="mt-4 flex flex-col items-center">
            {/* Timer shared across all tabs */}
          </TabsContent>
          <TabsContent value="shortBreak" className="mt-4 flex flex-col items-center">
            {/* Timer shared across all tabs */}
          </TabsContent>
          <TabsContent value="longBreak" className="mt-4 flex flex-col items-center">
            {/* Timer shared across all tabs */}
          </TabsContent>
        </Tabs>
        
        {/* Timer Display (shared across all tabs) */}
        <div className="mt-6 mb-4 relative w-40 h-40 rounded-full flex items-center justify-center">
          {/* Progress Circle */}
          <svg className="absolute -rotate-90 w-full h-full">
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="transparent"
              stroke="#e2e8f0"
              strokeWidth="8"
            />
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="transparent"
              stroke={activeTab === 'pomodoro' ? '#6366f1' : activeTab === 'shortBreak' ? '#8b5cf6' : '#a78bfa'}
              strokeWidth="8"
              strokeDasharray="440"
              strokeDashoffset={440 - (440 * progress) / 100}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <div className="text-4xl font-bold">{formatTime(timeLeft)}</div>
        </div>
        
        {/* Controls */}
        <div className="flex gap-3 mt-4">
          {isRunning ? (
            <Button 
              variant="outline" 
              size="icon" 
              onClick={pauseTimer}
              className="w-10 h-10 rounded-full"
            >
              <Pause className="h-5 w-5" />
            </Button>
          ) : (
            <Button 
              className="w-10 h-10 rounded-full bg-jee-primary hover:bg-jee-primary/90" 
              size="icon" 
              onClick={startTimer}
            >
              <Play className="h-5 w-5" />
            </Button>
          )}
          <Button 
            variant="outline" 
            size="icon" 
            onClick={resetTimer}
            className="w-10 h-10 rounded-full"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          {cycles > 0 ? `Cycles completed: ${cycles}` : 'Start your first focus session!'}
        </div>
      </CardContent>
    </Card>
  );
};

export default PomodoroTimer;
