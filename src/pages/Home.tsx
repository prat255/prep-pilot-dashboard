
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Check, 
  Settings, 
  ArrowRight,
  ListCheck,
  Clock,
  Calendar as CalendarIcon,
} from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <ListCheck className="w-6 h-6 text-jee-primary" />,
      title: 'Mock Test Tracking',
      description: 'Record and analyze your mock test scores over time. Identify strengths and weaknesses.'
    },
    {
      icon: <Calendar className="w-6 h-6 text-jee-primary" />,
      title: 'Revision Logger',
      description: 'Keep track of topics you've revised, review cycles, and comprehension levels.'
    },
    {
      icon: <Clock className="w-6 h-6 text-jee-primary" />,
      title: 'Pomodoro Timer',
      description: 'Stay focused with built-in study timers to maximize productivity and minimize burnout.'
    },
    {
      icon: <CalendarIcon className="w-6 h-6 text-jee-primary" />,
      title: 'Study Planner',
      description: 'Create and manage daily and weekly study schedules with smart recommendations.'
    },
    {
      icon: <Check className="w-6 h-6 text-jee-primary" />,
      title: 'Progress Analytics',
      description: 'Visualize your preparation journey with comprehensive charts and insights.'
    },
    {
      icon: <Settings className="w-6 h-6 text-jee-primary" />,
      title: 'Personalized Dashboard',
      description: 'Customize your experience with widgets that matter most to your preparation.'
    },
  ];

  const testimonials = [
    {
      content: "JEETracker+ transformed my preparation. I could clearly see my progress and focus on weak areas. Went from 12k rank to under 5k!",
      author: "Rahul Sharma",
      rank: "AIR 4873"
    },
    {
      content: "The revision tracking feature helped me maintain consistency. The analytics showed me exactly what I needed to work on.",
      author: "Priya Patel",
      rank: "AIR 3241"
    },
    {
      content: "The mock test analysis was a game changer. It highlighted patterns in my mistakes I couldn't see before.",
      author: "Arjun Singh",
      rank: "AIR 8752"
    }
  ];

  // Motivational quotes for JEE preparation
  const quotes = [
    ""Success is the sum of small efforts, repeated day in and day out." — Robert Collier",
    ""The difference between ordinary and extraordinary is that little extra." — Jimmy Johnson",
    ""Don't watch the clock; do what it does. Keep going." — Sam Levenson",
    ""The only way to do great work is to love what you do." — Steve Jobs",
    ""Believe you can and you're halfway there." — Theodore Roosevelt"
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-purple-50 dark:from-gray-900 dark:to-gray-800 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 space-y-6 animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                Master Your <span className="jee-gradient-text">JEE Preparation</span> Journey
              </h1>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                Track progress, analyze performance, and achieve your dream rank with the most comprehensive JEE preparation toolkit.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button size="lg" className="bg-gradient-to-r from-jee-primary to-jee-secondary hover:opacity-90">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button size="lg" variant="outline">
                    Explore Dashboard
                  </Button>
                </Link>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 pt-2">
                📆 Join 10,000+ JEE aspirants already on track
              </div>
            </div>
            <div className="md:w-1/2 animate-fade-in">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-jee-primary to-jee-secondary rounded-lg blur opacity-25"></div>
                <div className="relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-xl">
                  <img 
                    src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=800" 
                    alt="JEE Preparation Dashboard" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Everything You Need to <span className="jee-gradient-text">Ace JEE</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Purpose-built features designed specifically for JEE preparation, helping you organize, track, and optimize your study routine.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="jee-card p-6 flex flex-col h-full"
              >
                <div className="bg-purple-50 dark:bg-gray-700 p-3 rounded-full w-fit mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 flex-grow">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Motivational Quote */}
      <section className="bg-gradient-to-r from-jee-primary to-jee-secondary py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <blockquote className="text-2xl md:text-3xl font-medium italic">
            {quotes[Math.floor(Math.random() * quotes.length)]}
          </blockquote>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-purple-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              See how JEETracker+ has helped students achieve their dream ranks.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md"
              >
                <p className="text-gray-600 dark:text-gray-300 italic mb-4">"{testimonial.content}"</p>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="font-medium">{testimonial.author}</p>
                    <p className="text-jee-primary text-sm">{testimonial.rank}</p>
                  </div>
                  <div className="bg-jee-muted dark:bg-gray-700 px-3 py-1 rounded-full text-xs font-medium text-jee-primary dark:text-jee-accent">
                    JEE 2023
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Begin Your Success Journey Today</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Join thousands of students who are taking control of their JEE preparation and seeing real results.
            </p>
            <Link to="/signup">
              <Button size="lg" className="bg-gradient-to-r from-jee-primary to-jee-secondary hover:opacity-90">
                Create Free Account
              </Button>
            </Link>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              No credit card required. Free forever for basic features.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
