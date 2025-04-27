
import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FileText, Plus, BarChart2, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

type MockTest = {
  id: string;
  name: string;
  date: string;
  duration: number;
  maxMarks: number;
  obtained: number;
  subjects: {
    name: string;
    maxMarks: number;
    obtained: number;
  }[];
};

const MockTests = () => {
  const { user } = useAuth();
  const [tests, setTests] = useState<MockTest[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form states for new test
  const [newTest, setNewTest] = useState<Omit<MockTest, 'id'>>({
    name: '',
    date: new Date().toISOString().split('T')[0],
    duration: 180,
    maxMarks: 360,
    obtained: 0,
    subjects: [
      { name: 'Physics', maxMarks: 120, obtained: 0 },
      { name: 'Chemistry', maxMarks: 120, obtained: 0 },
      { name: 'Mathematics', maxMarks: 120, obtained: 0 }
    ]
  });

  useEffect(() => {
    if (user) {
      // Load user's test data
      loadUserData();
    }
  }, [user]);

  const loadUserData = () => {
    try {
      if (!user) return;
      
      const dataKey = `jeeTracker_${user.email}_data`;
      const userData = JSON.parse(localStorage.getItem(dataKey) || '{}');
      
      // Initialize mock tests if they don't exist
      if (!userData.mockTests) {
        userData.mockTests = [];
        localStorage.setItem(dataKey, JSON.stringify(userData));
      }
      
      setTests(userData.mockTests);
    } catch (error) {
      console.error('Failed to load user data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your test data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const saveUserData = (updatedTests: MockTest[]) => {
    if (!user) return;
    
    try {
      const dataKey = `jeeTracker_${user.email}_data`;
      const userData = JSON.parse(localStorage.getItem(dataKey) || '{}');
      
      userData.mockTests = updatedTests;
      localStorage.setItem(dataKey, JSON.stringify(userData));
      
      setTests(updatedTests);
    } catch (error) {
      console.error('Failed to save user data:', error);
      toast({
        title: 'Error',
        description: 'Failed to save your test data',
        variant: 'destructive',
      });
    }
  };

  const handleAddTest = () => {
    // Validate test data
    if (!newTest.name.trim()) {
      toast({
        title: 'Error',
        description: 'Test name cannot be empty',
        variant: 'destructive',
      });
      return;
    }
    
    // Calculate total obtained marks
    const totalObtained = newTest.subjects.reduce((sum, subject) => sum + subject.obtained, 0);
    
    const testToAdd: MockTest = {
      ...newTest,
      id: Date.now().toString(),
      obtained: totalObtained,
    };
    
    const updatedTests = [...tests, testToAdd];
    saveUserData(updatedTests);
    
    // Reset form
    setNewTest({
      name: '',
      date: new Date().toISOString().split('T')[0],
      duration: 180,
      maxMarks: 360,
      obtained: 0,
      subjects: [
        { name: 'Physics', maxMarks: 120, obtained: 0 },
        { name: 'Chemistry', maxMarks: 120, obtained: 0 },
        { name: 'Mathematics', maxMarks: 120, obtained: 0 }
      ]
    });
    
    toast({
      title: 'Success',
      description: 'Mock test added successfully',
    });
  };

  const handleDeleteTest = (testId: string) => {
    if (window.confirm('Are you sure you want to delete this test record?')) {
      const updatedTests = tests.filter(test => test.id !== testId);
      saveUserData(updatedTests);
      
      toast({
        title: 'Success',
        description: 'Test deleted successfully',
      });
    }
  };

  const handleSubjectMarksChange = (index: number, value: number) => {
    const updatedSubjects = [...newTest.subjects];
    updatedSubjects[index].obtained = value;
    
    setNewTest({
      ...newTest,
      subjects: updatedSubjects
    });
  };

  // Calculate performance metrics
  const getPerformanceMetrics = () => {
    if (tests.length === 0) {
      return {
        totalTests: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
        averagePercentage: 0,
        subjectAverages: {
          Physics: 0,
          Chemistry: 0,
          Mathematics: 0
        },
        trend: 'neutral'
      };
    }
    
    const totalTests = tests.length;
    const scores = tests.map(test => test.obtained);
    const highestScore = Math.max(...scores);
    const lowestScore = Math.min(...scores);
    const totalScore = scores.reduce((sum, score) => sum + score, 0);
    const averageScore = totalScore / totalTests;
    
    // Calculate average percentage
    const totalMaxMarks = tests.reduce((sum, test) => sum + test.maxMarks, 0);
    const averagePercentage = (totalScore / totalMaxMarks) * 100;
    
    // Calculate subject averages
    const subjectAverages: {[key: string]: number} = {
      Physics: 0,
      Chemistry: 0,
      Mathematics: 0
    };
    
    // Count each subject's occurrence
    const subjectCounts: {[key: string]: number} = {
      Physics: 0,
      Chemistry: 0,
      Mathematics: 0
    };
    
    tests.forEach(test => {
      test.subjects.forEach(subject => {
        if (subjectAverages[subject.name] !== undefined) {
          subjectAverages[subject.name] += subject.obtained;
          subjectCounts[subject.name]++;
        }
      });
    });
    
    // Calculate averages
    Object.keys(subjectAverages).forEach(subject => {
      if (subjectCounts[subject] > 0) {
        subjectAverages[subject] = subjectAverages[subject] / subjectCounts[subject];
      }
    });
    
    // Determine trend (improving, declining, neutral)
    let trend = 'neutral';
    if (tests.length >= 3) {
      const recentTests = [...tests].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ).slice(0, 3);
      
      const recentScores = recentTests.map(test => test.obtained / test.maxMarks);
      
      if (recentScores[0] > recentScores[1] && recentScores[1] > recentScores[2]) {
        trend = 'improving';
      } else if (recentScores[0] < recentScores[1] && recentScores[1] < recentScores[2]) {
        trend = 'declining';
      }
    }
    
    return {
      totalTests,
      averageScore,
      highestScore,
      lowestScore,
      averagePercentage,
      subjectAverages,
      trend
    };
  };

  const metrics = getPerformanceMetrics();

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <main className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Mock Tests</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Track and analyze your mock test performance.
            </p>
          </div>
          
          <Tabs defaultValue="overview">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="tests">Test Records</TabsTrigger>
              <TabsTrigger value="add">Add New Test</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium text-gray-700 dark:text-gray-300">Total Tests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <FileText className="h-8 w-8 text-jee-primary opacity-80" />
                      <span className="text-3xl font-bold ml-3">{metrics.totalTests}</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium text-gray-700 dark:text-gray-300">Average Percentage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <BarChart2 className="h-8 w-8 text-jee-primary opacity-80" />
                      <span className="text-3xl font-bold ml-3">
                        {metrics.averagePercentage.toFixed(1)}%
                      </span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium text-gray-700 dark:text-gray-300">
                      Performance Trend
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <div 
                        className={`h-8 w-8 rounded-full flex items-center justify-center ${
                          metrics.trend === 'improving' 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
                            : metrics.trend === 'declining'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                        }`}
                      >
                        {metrics.trend === 'improving' ? '↑' : metrics.trend === 'declining' ? '↓' : '→'}
                      </div>
                      <span className="text-xl font-medium ml-3 capitalize">{metrics.trend}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>Subject Analysis</CardTitle>
                    <CardDescription>
                      Average scores by subject
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-jee-primary"></div>
                      </div>
                    ) : metrics.totalTests === 0 ? (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <FileText className="mx-auto h-12 w-12 mb-3 opacity-50" />
                        <p>No test data available</p>
                        <p className="text-sm">Add your first test to see analytics</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {Object.entries(metrics.subjectAverages).map(([subject, average]) => (
                          <div key={subject}>
                            <div className="flex justify-between mb-1">
                              <span>{subject}</span>
                              <span>{average.toFixed(1)} / 120</span>
                            </div>
                            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                              <div 
                                className="h-2 rounded-full bg-jee-primary"
                                style={{ width: `${(average / 120) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>Recent Tests</CardTitle>
                    <CardDescription>
                      Your most recent test results
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-jee-primary"></div>
                      </div>
                    ) : tests.length === 0 ? (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <FileText className="mx-auto h-12 w-12 mb-3 opacity-50" />
                        <p>No test data available</p>
                        <p className="text-sm">Add your first test to see results</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-200 dark:divide-gray-700 -mx-6">
                        {[...tests]
                          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                          .slice(0, 5)
                          .map((test) => (
                          <div key={test.id} className="px-6 py-3 flex justify-between items-center">
                            <div>
                              <div className="font-medium">{test.name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {new Date(test.date).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">{test.obtained} / {test.maxMarks}</div>
                              <div 
                                className={`text-sm ${
                                  (test.obtained / test.maxMarks) >= 0.7
                                    ? 'text-green-600 dark:text-green-400'
                                    : (test.obtained / test.maxMarks) >= 0.4
                                    ? 'text-yellow-600 dark:text-yellow-400'
                                    : 'text-red-600 dark:text-red-400'
                                }`}
                              >
                                {((test.obtained / test.maxMarks) * 100).toFixed(1)}%
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="tests">
              <Card>
                <CardHeader>
                  <CardTitle>Test Records</CardTitle>
                  <CardDescription>
                    View and manage your mock test records
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-jee-primary"></div>
                    </div>
                  ) : tests.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <FileText className="mx-auto h-12 w-12 mb-3 opacity-50" />
                      <p>No test records found</p>
                      <p className="text-sm">Add your first test record to start tracking progress</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead>
                          <tr>
                            <th className="py-3 text-left font-medium text-gray-500 dark:text-gray-400">Test Name</th>
                            <th className="py-3 text-left font-medium text-gray-500 dark:text-gray-400">Date</th>
                            <th className="py-3 text-left font-medium text-gray-500 dark:text-gray-400">Duration</th>
                            <th className="py-3 text-left font-medium text-gray-500 dark:text-gray-400">Score</th>
                            <th className="py-3 text-left font-medium text-gray-500 dark:text-gray-400">Physics</th>
                            <th className="py-3 text-left font-medium text-gray-500 dark:text-gray-400">Chemistry</th>
                            <th className="py-3 text-left font-medium text-gray-500 dark:text-gray-400">Mathematics</th>
                            <th className="py-3 text-left font-medium text-gray-500 dark:text-gray-400">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                          {tests.map(test => (
                            <tr key={test.id}>
                              <td className="py-3">{test.name}</td>
                              <td className="py-3">{new Date(test.date).toLocaleDateString()}</td>
                              <td className="py-3">{test.duration} min</td>
                              <td className="py-3 font-medium">
                                {test.obtained} / {test.maxMarks}
                                <span className="ml-2 text-sm">
                                  ({((test.obtained / test.maxMarks) * 100).toFixed(1)}%)
                                </span>
                              </td>
                              {test.subjects.map(subject => (
                                <td key={subject.name} className="py-3">
                                  {subject.obtained} / {subject.maxMarks}
                                </td>
                              ))}
                              <td className="py-3">
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => handleDeleteTest(test.id)}
                                >
                                  Delete
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="add">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Test Record</CardTitle>
                  <CardDescription>
                    Record your mock test results to track progress
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleAddTest();
                    }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="test-name">Test Name</Label>
                        <Input 
                          id="test-name" 
                          placeholder="Enter test name" 
                          value={newTest.name}
                          onChange={(e) => setNewTest({...newTest, name: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="test-date">Test Date</Label>
                        <Input 
                          id="test-date" 
                          type="date" 
                          value={newTest.date}
                          onChange={(e) => setNewTest({...newTest, date: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="test-duration">Duration (minutes)</Label>
                        <Input 
                          id="test-duration" 
                          type="number" 
                          min="1"
                          value={newTest.duration}
                          onChange={(e) => setNewTest({...newTest, duration: parseInt(e.target.value) || 0})}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="test-maxmarks">Maximum Marks</Label>
                        <Input 
                          id="test-maxmarks" 
                          type="number" 
                          min="1"
                          value={newTest.maxMarks}
                          onChange={(e) => setNewTest({...newTest, maxMarks: parseInt(e.target.value) || 0})}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Subject Scores</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {newTest.subjects.map((subject, index) => (
                          <div key={subject.name} className="space-y-2">
                            <Label htmlFor={`subject-${index}`}>{subject.name} (out of {subject.maxMarks})</Label>
                            <Input 
                              id={`subject-${index}`} 
                              type="number" 
                              min="0"
                              max={subject.maxMarks}
                              value={subject.obtained}
                              onChange={(e) => handleSubjectMarksChange(index, parseInt(e.target.value) || 0)}
                              required
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Button type="submit" className="mt-4">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Test Record
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default MockTests;
