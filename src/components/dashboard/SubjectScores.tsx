
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const SubjectScores = () => {
  // Mock data for subject scores
  const subjects = [
    { name: 'Physics', score: 78, color: 'bg-jee-primary' },
    { name: 'Chemistry', score: 85, color: 'bg-jee-secondary' },
    { name: 'Mathematics', score: 72, color: 'bg-jee-accent' }
  ];

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Subject Performance</CardTitle>
        <CardDescription>Your latest scores by subject</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {subjects.map((subject) => (
            <div key={subject.name} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="font-medium">{subject.name}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{subject.score}%</div>
              </div>
              <Progress value={subject.score} className={subject.color} />
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t dark:border-gray-800">
          <div className="flex items-center justify-between text-sm">
            <div className="text-gray-500 dark:text-gray-400">Overall Average</div>
            <div className="font-medium">78%</div>
          </div>
          <Progress value={78} className="bg-gradient-to-r from-jee-primary to-jee-secondary mt-2" />
        </div>
      </CardContent>
    </Card>
  );
};

export default SubjectScores;
