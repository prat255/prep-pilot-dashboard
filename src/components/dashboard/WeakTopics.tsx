
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const WeakTopics = () => {
  // Mock data for weak topics
  const topics = [
    {
      name: 'Rotational Mechanics',
      subject: 'Physics',
      score: 45,
      status: 'critical'
    },
    {
      name: 'Chemical Equilibrium',
      subject: 'Chemistry',
      score: 52,
      status: 'warning'
    },
    {
      name: 'Integral Calculus',
      subject: 'Mathematics',
      score: 58,
      status: 'warning'
    },
    {
      name: 'Electrochemistry',
      subject: 'Chemistry',
      score: 60,
      status: 'improving'
    }
  ];

  // Function to get status badge styling based on status
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'critical':
        return <Badge variant="destructive">Need Focus</Badge>;
      case 'warning':
        return <Badge className="bg-amber-500">Needs Work</Badge>;
      case 'improving':
        return <Badge className="bg-emerald-500">Improving</Badge>;
      default:
        return <Badge>Review</Badge>;
    }
  };

  // Function to get subject badge styling
  const getSubjectBadge = (subject: string) => {
    switch(subject) {
      case 'Physics':
        return <Badge variant="outline" className="border-jee-primary text-jee-primary">{subject}</Badge>;
      case 'Chemistry':
        return <Badge variant="outline" className="border-jee-secondary text-jee-secondary">{subject}</Badge>;
      case 'Mathematics':
        return <Badge variant="outline" className="border-jee-accent text-jee-accent">{subject}</Badge>;
      default:
        return <Badge variant="outline">{subject}</Badge>;
    }
  };

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Weak Topics</CardTitle>
        <CardDescription>Topics that need more attention</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topics.map((topic, index) => (
            <div key={index} className="border dark:border-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{topic.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    {getSubjectBadge(topic.subject)}
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Latest Score: {topic.score}%
                    </span>
                  </div>
                </div>
                {getStatusBadge(topic.status)}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <button className="text-sm text-jee-primary hover:text-jee-secondary hover:underline">
            View All Topics
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeakTopics;
