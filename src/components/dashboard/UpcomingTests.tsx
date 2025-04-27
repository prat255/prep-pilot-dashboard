
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const UpcomingTests = () => {
  // Mock data for upcoming tests
  const tests = [
    {
      name: 'Weekly Physics MCQ',
      date: 'Today',
      time: '4:00 PM',
      type: 'Online',
      status: 'upcoming'
    },
    {
      name: 'Chemistry Full Test',
      date: 'Tomorrow',
      time: '10:00 AM',
      type: 'Online',
      status: 'upcoming'
    },
    {
      name: 'JEE Mock Test #5',
      date: '3 Sep',
      time: '9:00 AM',
      type: 'Center',
      status: 'registered'
    },
    {
      name: 'Mathematics Section Test',
      date: '5 Sep',
      time: '2:00 PM',
      type: 'Online',
      status: 'registered'
    },
  ];

  // Function to get the appropriate badge variant based on test status
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'default';
      case 'registered':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Upcoming Tests</CardTitle>
        <CardDescription>Your scheduled mock tests</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tests.map((test, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div>
                <h4 className="font-medium text-sm">{test.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {test.date} • {test.time}
                  </span>
                </div>
              </div>
              <Badge variant={getBadgeVariant(test.status)}>
                {test.type}
              </Badge>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <button className="text-sm text-jee-primary hover:text-jee-secondary hover:underline">
            View All Tests
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingTests;
