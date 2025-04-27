
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Mock data for our chart
const data = [
  { date: 'Jun 1', physics: 65, chemistry: 72, maths: 58 },
  { date: 'Jun 15', physics: 68, chemistry: 75, maths: 62 },
  { date: 'Jul 1', physics: 70, chemistry: 73, maths: 65 },
  { date: 'Jul 15', physics: 72, chemistry: 78, maths: 70 },
  { date: 'Aug 1', physics: 75, chemistry: 80, maths: 72 },
  { date: 'Aug 15', physics: 77, chemistry: 79, maths: 75 },
  { date: 'Sep 1', physics: 80, chemistry: 82, maths: 78 },
];

const ProgressChart = () => {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Progress Overview</CardTitle>
        <CardDescription>Track your performance across subjects over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="physics" 
                name="Physics" 
                stroke="#6366f1" 
                strokeWidth={2} 
                dot={{ r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="chemistry" 
                name="Chemistry" 
                stroke="#8b5cf6" 
                strokeWidth={2} 
                dot={{ r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="maths" 
                name="Mathematics" 
                stroke="#a78bfa" 
                strokeWidth={2} 
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressChart;
