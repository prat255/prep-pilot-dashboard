
import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { BookOpen, Plus, Check, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

type Subject = {
  id: string;
  name: string;
  topics: Topic[];
};

type Topic = {
  id: string;
  name: string;
  revisionCount: number;
  lastRevised: string | null;
  confidenceLevel: 'low' | 'medium' | 'high';
  notes: string;
};

const Revisions = () => {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [newTopicName, setNewTopicName] = useState('');
  const [newTopicNotes, setNewTopicNotes] = useState('');
  const [newTopicConfidence, setNewTopicConfidence] = useState<'low' | 'medium' | 'high'>('medium');
  const [newSubjectName, setNewSubjectName] = useState('');

  useEffect(() => {
    if (user) {
      // Load user's revision data
      loadUserData();
    }
  }, [user]);

  const loadUserData = () => {
    try {
      if (!user) return;
      
      const dataKey = `jeeTracker_${user.email}_data`;
      const userData = JSON.parse(localStorage.getItem(dataKey) || '{}');
      
      // Initialize subjects if they don't exist
      if (!userData.subjects) {
        userData.subjects = [];
        localStorage.setItem(dataKey, JSON.stringify(userData));
      }
      
      setSubjects(userData.subjects);
      
      // Select first subject if available
      if (userData.subjects.length > 0 && !selectedSubject) {
        setSelectedSubject(userData.subjects[0].id);
      }
      
    } catch (error) {
      console.error('Failed to load user data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your revision data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const saveUserData = (updatedSubjects: Subject[]) => {
    if (!user) return;
    
    try {
      const dataKey = `jeeTracker_${user.email}_data`;
      const userData = JSON.parse(localStorage.getItem(dataKey) || '{}');
      
      userData.subjects = updatedSubjects;
      localStorage.setItem(dataKey, JSON.stringify(userData));
      
      setSubjects(updatedSubjects);
    } catch (error) {
      console.error('Failed to save user data:', error);
      toast({
        title: 'Error',
        description: 'Failed to save your changes',
        variant: 'destructive',
      });
    }
  };

  const handleAddSubject = () => {
    if (!newSubjectName.trim()) {
      toast({
        title: 'Error',
        description: 'Subject name cannot be empty',
        variant: 'destructive',
      });
      return;
    }
    
    const newSubject: Subject = {
      id: Date.now().toString(),
      name: newSubjectName.trim(),
      topics: []
    };
    
    const updatedSubjects = [...subjects, newSubject];
    saveUserData(updatedSubjects);
    setSelectedSubject(newSubject.id);
    setNewSubjectName('');
    
    toast({
      title: 'Success',
      description: 'Subject added successfully',
    });
  };

  const handleAddTopic = () => {
    if (!selectedSubject) {
      toast({
        title: 'Error',
        description: 'Please select a subject first',
        variant: 'destructive',
      });
      return;
    }
    
    if (!newTopicName.trim()) {
      toast({
        title: 'Error',
        description: 'Topic name cannot be empty',
        variant: 'destructive',
      });
      return;
    }
    
    const newTopic: Topic = {
      id: Date.now().toString(),
      name: newTopicName.trim(),
      revisionCount: 0,
      lastRevised: null,
      confidenceLevel: newTopicConfidence,
      notes: newTopicNotes.trim()
    };
    
    const updatedSubjects = subjects.map(subject => {
      if (subject.id === selectedSubject) {
        return {
          ...subject,
          topics: [...subject.topics, newTopic]
        };
      }
      return subject;
    });
    
    saveUserData(updatedSubjects);
    setNewTopicName('');
    setNewTopicNotes('');
    setNewTopicConfidence('medium');
    
    toast({
      title: 'Success',
      description: 'Topic added successfully',
    });
  };

  const handleDeleteSubject = (subjectId: string) => {
    if (window.confirm('Are you sure you want to delete this subject and all its topics?')) {
      const updatedSubjects = subjects.filter(subject => subject.id !== subjectId);
      saveUserData(updatedSubjects);
      
      if (selectedSubject === subjectId) {
        setSelectedSubject(updatedSubjects.length > 0 ? updatedSubjects[0].id : null);
      }
      
      toast({
        title: 'Success',
        description: 'Subject deleted successfully',
      });
    }
  };

  const handleDeleteTopic = (subjectId: string, topicId: string) => {
    if (window.confirm('Are you sure you want to delete this topic and its revision history?')) {
      const updatedSubjects = subjects.map(subject => {
        if (subject.id === subjectId) {
          return {
            ...subject,
            topics: subject.topics.filter(topic => topic.id !== topicId)
          };
        }
        return subject;
      });
      
      saveUserData(updatedSubjects);
      
      toast({
        title: 'Success',
        description: 'Topic deleted successfully',
      });
    }
  };

  const handleMarkRevised = (subjectId: string, topicId: string) => {
    const updatedSubjects = subjects.map(subject => {
      if (subject.id === subjectId) {
        return {
          ...subject,
          topics: subject.topics.map(topic => {
            if (topic.id === topicId) {
              return {
                ...topic,
                revisionCount: topic.revisionCount + 1,
                lastRevised: new Date().toISOString()
              };
            }
            return topic;
          })
        };
      }
      return subject;
    });
    
    saveUserData(updatedSubjects);
    
    toast({
      title: 'Success',
      description: 'Topic marked as revised',
    });
  };

  const handleChangeConfidence = (subjectId: string, topicId: string, level: 'low' | 'medium' | 'high') => {
    const updatedSubjects = subjects.map(subject => {
      if (subject.id === subjectId) {
        return {
          ...subject,
          topics: subject.topics.map(topic => {
            if (topic.id === topicId) {
              return {
                ...topic,
                confidenceLevel: level
              };
            }
            return topic;
          })
        };
      }
      return subject;
    });
    
    saveUserData(updatedSubjects);
    
    toast({
      title: 'Success',
      description: 'Confidence level updated',
    });
  };

  // Get selected subject
  const currentSubject = subjects.find(subject => subject.id === selectedSubject);

  // Get confidence level color
  const confidenceColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'high':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <main className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Revisions</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Track your topic revisions and study progress.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Subjects</CardTitle>
                  <CardDescription>
                    Organize your study topics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-jee-primary"></div>
                    </div>
                  ) : (
                    <>
                      <div className="mb-4">
                        <div className="flex gap-2 mb-4">
                          <Input 
                            placeholder="New Subject" 
                            value={newSubjectName}
                            onChange={(e) => setNewSubjectName(e.target.value)}
                          />
                          <Button onClick={handleAddSubject} size="icon">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {subjects.length === 0 ? (
                          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            <BookOpen className="mx-auto h-10 w-10 mb-2 opacity-50" />
                            <p>No subjects added yet.</p>
                            <p className="text-sm">Add your first subject above.</p>
                          </div>
                        ) : (
                          <ul className="space-y-1">
                            {subjects.map(subject => (
                              <li key={subject.id}>
                                <div className="flex items-center justify-between group">
                                  <button
                                    className={`flex-1 text-left py-2 px-3 rounded-md transition-colors ${
                                      selectedSubject === subject.id 
                                        ? 'bg-jee-primary/10 text-jee-primary font-medium' 
                                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                                    onClick={() => setSelectedSubject(subject.id)}
                                  >
                                    {subject.name}
                                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                                      ({subject.topics.length})
                                    </span>
                                  </button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => handleDeleteSubject(subject.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-3">
              <Tabs defaultValue="topics">
                <TabsList className="mb-6">
                  <TabsTrigger value="topics">Topics</TabsTrigger>
                  <TabsTrigger value="add">Add New Topic</TabsTrigger>
                </TabsList>
                
                <TabsContent value="topics">
                  <Card>
                    <CardHeader>
                      <CardTitle>{currentSubject ? currentSubject.name : 'Select a Subject'}</CardTitle>
                      <CardDescription>
                        {currentSubject ? `${currentSubject.topics.length} topics in this subject` : 'Choose a subject from the left panel'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {!currentSubject ? (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                          <BookOpen className="mx-auto h-10 w-10 mb-2 opacity-50" />
                          <p>No subject selected</p>
                          <p className="text-sm">Select a subject from the left panel or create a new one.</p>
                        </div>
                      ) : currentSubject.topics.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                          <BookOpen className="mx-auto h-10 w-10 mb-2 opacity-50" />
                          <p>No topics added yet.</p>
                          <p className="text-sm">Add topics using the "Add New Topic" tab.</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                          {currentSubject.topics.map(topic => (
                            <div key={topic.id} className="py-4">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                                <div className="mb-2 sm:mb-0">
                                  <h3 className="text-lg font-medium">{topic.name}</h3>
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${confidenceColor(topic.confidenceLevel)}`}>
                                      Confidence: {topic.confidenceLevel}
                                    </span>
                                    <span className="inline-flex items-center rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 px-2.5 py-0.5 text-xs font-medium">
                                      Revisions: {topic.revisionCount}
                                    </span>
                                    {topic.lastRevised && (
                                      <span className="inline-flex items-center rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400 px-2.5 py-0.5 text-xs font-medium">
                                        Last: {new Date(topic.lastRevised).toLocaleDateString()}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  <Select 
                                    defaultValue={topic.confidenceLevel}
                                    onValueChange={(value) => handleChangeConfidence(
                                      currentSubject.id, 
                                      topic.id, 
                                      value as 'low' | 'medium' | 'high'
                                    )}
                                  >
                                    <SelectTrigger className="w-36">
                                      <SelectValue placeholder="Confidence" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="low">Low Confidence</SelectItem>
                                      <SelectItem value="medium">Medium Confidence</SelectItem>
                                      <SelectItem value="high">High Confidence</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  
                                  <Button 
                                    onClick={() => handleMarkRevised(currentSubject.id, topic.id)}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    <Check className="mr-2 h-4 w-4" />
                                    Mark Revised
                                  </Button>
                                  
                                  <Button
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => handleDeleteTopic(currentSubject.id, topic.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              
                              {topic.notes && (
                                <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-sm">
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Notes:</p>
                                  <p>{topic.notes}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="add">
                  <Card>
                    <CardHeader>
                      <CardTitle>Add New Topic</CardTitle>
                      <CardDescription>
                        Add a topic to {currentSubject ? currentSubject.name : 'the selected subject'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {!currentSubject ? (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                          <BookOpen className="mx-auto h-10 w-10 mb-2 opacity-50" />
                          <p>No subject selected</p>
                          <p className="text-sm">Select a subject from the left panel or create a new one.</p>
                        </div>
                      ) : (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleAddTopic();
                          }}
                          className="space-y-4"
                        >
                          <div className="space-y-2">
                            <Label htmlFor="topic-name">Topic Name</Label>
                            <Input 
                              id="topic-name" 
                              placeholder="Enter topic name" 
                              value={newTopicName}
                              onChange={(e) => setNewTopicName(e.target.value)}
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="topic-confidence">Initial Confidence Level</Label>
                            <Select 
                              defaultValue="medium"
                              onValueChange={(value) => setNewTopicConfidence(value as 'low' | 'medium' | 'high')}
                            >
                              <SelectTrigger id="topic-confidence">
                                <SelectValue placeholder="Select confidence level" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Low Confidence</SelectItem>
                                <SelectItem value="medium">Medium Confidence</SelectItem>
                                <SelectItem value="high">High Confidence</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="topic-notes">Notes (Optional)</Label>
                            <textarea 
                              id="topic-notes" 
                              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent p-3 text-sm"
                              rows={4}
                              placeholder="Add any details or notes about this topic"
                              value={newTopicNotes}
                              onChange={(e) => setNewTopicNotes(e.target.value)}
                            />
                          </div>
                          
                          <Button type="submit" className="mt-4">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Topic
                          </Button>
                        </form>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Revisions;
