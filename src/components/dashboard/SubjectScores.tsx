
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Edit, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

interface SubjectScore {
  id: string;
  name: string;
  score: number;
  color: string;
}

const DEFAULT_SUBJECTS: SubjectScore[] = [
  { id: '1', name: 'Physics', score: 78, color: 'bg-jee-primary' },
  { id: '2', name: 'Chemistry', score: 85, color: 'bg-jee-secondary' },
  { id: '3', name: 'Mathematics', score: 72, color: 'bg-jee-accent' }
];

const COLORS = [
  'bg-jee-primary',
  'bg-jee-secondary',
  'bg-jee-accent',
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-orange-500',
  'bg-red-500',
  'bg-pink-500',
  'bg-purple-500',
];

const SubjectScores = () => {
  const [subjects, setSubjects] = useState<SubjectScore[]>([]);
  const [editSubject, setEditSubject] = useState<SubjectScore | null>(null);
  const [newSubject, setNewSubject] = useState<Partial<SubjectScore>>({
    name: '',
    score: 0,
    color: COLORS[0]
  });
  
  // Load subjects from localStorage
  useEffect(() => {
    const savedSubjects = localStorage.getItem('jeeTrackerSubjects');
    if (savedSubjects) {
      try {
        setSubjects(JSON.parse(savedSubjects));
      } catch (error) {
        console.error('Failed to load subjects:', error);
        setSubjects(DEFAULT_SUBJECTS);
      }
    } else {
      setSubjects(DEFAULT_SUBJECTS);
      localStorage.setItem('jeeTrackerSubjects', JSON.stringify(DEFAULT_SUBJECTS));
    }
  }, []);
  
  // Save subjects to localStorage whenever they change
  useEffect(() => {
    if (subjects.length > 0) {
      localStorage.setItem('jeeTrackerSubjects', JSON.stringify(subjects));
    }
  }, [subjects]);
  
  // Calculate overall average
  const overallAverage = subjects.length > 0
    ? Math.round(subjects.reduce((sum, subject) => sum + subject.score, 0) / subjects.length)
    : 0;
  
  // Handle form submission for new subject
  const handleAddSubject = () => {
    if (!newSubject.name || newSubject.score === undefined) {
      toast({
        title: "Error",
        description: "Please enter both name and score",
        variant: "destructive"
      });
      return;
    }
    
    // Create new subject
    const subject: SubjectScore = {
      id: Date.now().toString(),
      name: newSubject.name,
      score: Math.min(100, Math.max(0, Number(newSubject.score))),
      color: newSubject.color || COLORS[Math.floor(Math.random() * COLORS.length)]
    };
    
    // Add to subjects list
    setSubjects([...subjects, subject]);
    
    // Reset form
    setNewSubject({
      name: '',
      score: 0,
      color: COLORS[0]
    });
    
    toast({
      title: "Success",
      description: `Added ${subject.name} to your subjects`
    });
  };
  
  // Handle form submission for editing subject
  const handleEditSubject = () => {
    if (!editSubject || !editSubject.name || editSubject.score === undefined) {
      toast({
        title: "Error",
        description: "Please enter both name and score",
        variant: "destructive"
      });
      return;
    }
    
    // Update the subject
    const updatedSubjects = subjects.map(s => 
      s.id === editSubject.id 
        ? { 
            ...editSubject, 
            score: Math.min(100, Math.max(0, editSubject.score)) 
          } 
        : s
    );
    
    setSubjects(updatedSubjects);
    setEditSubject(null);
    
    toast({
      title: "Success",
      description: `Updated ${editSubject.name}`
    });
  };
  
  // Handle deleting a subject
  const handleDeleteSubject = (id: string) => {
    const updatedSubjects = subjects.filter(s => s.id !== id);
    setSubjects(updatedSubjects);
    setEditSubject(null);
    
    toast({
      title: "Success",
      description: "Subject deleted"
    });
  };

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Subject Performance</CardTitle>
          <CardDescription>Your latest scores by subject</CardDescription>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Plus className="h-3.5 w-3.5" />
              <span>Add Subject</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Subject</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Subject Name</Label>
                <Input
                  id="name"
                  value={newSubject.name}
                  onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                  placeholder="e.g. Physics, Chemistry"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="score">Score (0-100)</Label>
                <Input
                  id="score"
                  type="number"
                  min="0"
                  max="100"
                  value={newSubject.score}
                  onChange={(e) => setNewSubject({ ...newSubject, score: Number(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Color</Label>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      className={`w-6 h-6 rounded-full ${color} ${newSubject.color === color ? 'ring-2 ring-gray-400 ring-offset-2' : ''}`}
                      onClick={() => setNewSubject({ ...newSubject, color })}
                      type="button"
                    />
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button onClick={handleAddSubject}>Add Subject</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {subjects.map((subject) => (
            <div key={subject.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="font-medium">{subject.name}</div>
                <div className="flex items-center gap-2">
                  <div className="text-sm text-gray-500 dark:text-gray-400">{subject.score}%</div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Subject</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="edit-name">Subject Name</Label>
                          <Input
                            id="edit-name"
                            value={editSubject?.name || subject.name}
                            onChange={(e) => setEditSubject({ ...subject, name: e.target.value })}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="edit-score">Score (0-100)</Label>
                          <Input
                            id="edit-score"
                            type="number"
                            min="0"
                            max="100"
                            value={editSubject?.score !== undefined ? editSubject.score : subject.score}
                            onChange={(e) => setEditSubject({ 
                              ...subject, 
                              score: Number(e.target.value)
                            })}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label>Color</Label>
                          <div className="flex flex-wrap gap-2">
                            {COLORS.map((color) => (
                              <button
                                key={color}
                                className={`w-6 h-6 rounded-full ${color} ${
                                  editSubject?.color === color || (!editSubject && subject.color === color) 
                                    ? 'ring-2 ring-gray-400 ring-offset-2' 
                                    : ''
                                }`}
                                onClick={() => setEditSubject({ ...subject, color })}
                                type="button"
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <DialogFooter className="flex justify-between">
                        <Button 
                          type="button" 
                          variant="destructive" 
                          onClick={() => handleDeleteSubject(subject.id)}
                        >
                          Delete
                        </Button>
                        <div className="flex gap-2">
                          <DialogClose asChild>
                            <Button type="button" variant="outline">Cancel</Button>
                          </DialogClose>
                          <DialogClose asChild>
                            <Button onClick={() => {
                              setEditSubject(subject);
                              handleEditSubject();
                            }}>
                              Save Changes
                            </Button>
                          </DialogClose>
                        </div>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <Progress value={subject.score} className={subject.color} />
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t dark:border-gray-800">
          <div className="flex items-center justify-between text-sm">
            <div className="text-gray-500 dark:text-gray-400">Overall Average</div>
            <div className="font-medium">{overallAverage}%</div>
          </div>
          <Progress value={overallAverage} className="bg-gradient-to-r from-jee-primary to-jee-secondary mt-2" />
        </div>
      </CardContent>
    </Card>
  );
};

export default SubjectScores;
