import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/sonner';
import { BarChart, LineChart, PieChart } from '@/components/ui/chart';
import { User, Gamepad, Calendar, MessageCircle } from 'lucide-react';
import { useAnalytics } from '@/contexts/AnalyticsContext';

type TimeRange = '7d' | '30d' | '90d' | 'all';

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const { stats, isLoading } = useAnalytics();
  const { toast } = useToast();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-health-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  // Sample chart data
  const diseasesData = [
    { name: 'Anxiety', value: 45 },
    { name: 'Depression', value: 30 },
    { name: 'Insomnia', value: 15 },
    { name: 'Stress', value: 25 },
    { name: 'Other', value: 10 }
  ];

  const gameUsageData = [
    { name: 'Memory Match', value: 35 },
    { name: 'Breathing Exercise', value: 40 },
    { name: 'Reaction Time', value: 25 }
  ];

  const userEngagementData = [
    { name: 'Day 1', users: 10, sessions: 15 },
    { name: 'Day 2', users: 15, sessions: 24 },
    { name: 'Day 3', users: 12, sessions: 18 },
    { name: 'Day 4', users: 18, sessions: 27 },
    { name: 'Day 5', users: 20, sessions: 30 },
    { name: 'Day 6', users: 25, sessions: 40 },
    { name: 'Day 7', users: 22, sessions: 35 }
  ];

  const timeSpentData = [
    { name: 'Memory Match', '18-24': 10, '25-34': 15, '35-44': 8, '45+': 6 },
    { name: 'Breathing Exercise', '18-24': 8, '25-34': 12, '35-44': 15, '45+': 10 },
    { name: 'Reaction Time', '18-24': 12, '25-34': 8, '35-44': 6, '45+': 4 }
  ];

  const feedbackScoreData = [
    { name: 'Memory Match', score: 4.2 },
    { name: 'Breathing Exercise', score: 4.5 },
    { name: 'Reaction Time', score: 3.9 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Admin Dashboard</h2>
          <p className="text-muted-foreground">
            Analytics and statistics from user interactions
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as TimeRange)}
            className="border border-border rounded px-2 py-1 text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="all">All time</option>
          </select>
          
          <Button onClick={() => toast({ description: "Report data exported successfully" })}>
            Export Data
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value="128"
          description="+22% from last month"
          icon={<User className="h-5 w-5 text-health-primary" />}
        />
        <StatCard
          title="Game Sessions"
          value="512"
          description="+8% from last month"
          icon={<Gamepad className="h-5 w-5 text-health-primary" />}
        />
        <StatCard
          title="Avg. Session Time"
          value="9.4 min"
          description="+12% from last month"
          icon={<Calendar className="h-5 w-5 text-health-primary" />}
        />
        <StatCard
          title="Chat Messages"
          value="1,024"
          description="+16% from last month"
          icon={<MessageCircle className="h-5 w-5 text-health-primary" />}
        />
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid grid-cols-4 md:w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="diseases">Diseases</TabsTrigger>
          <TabsTrigger value="games">Game Usage</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">User Engagement</CardTitle>
                <CardDescription>Users and sessions over time</CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart
                  data={userEngagementData}
                  categories={['users', 'sessions']}
                  index="name"
                  colors={['#4FD1C5', '#38B2AC']}
                  valueFormatter={(value) => `${value} users`}
                  className="h-80"
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Disease Distribution</CardTitle>
                <CardDescription>Most reported health concerns</CardDescription>
              </CardHeader>
              <CardContent>
                <PieChart
                  data={diseasesData}
                  category="value"
                  index="name"
                  colors={['#4FD1C5', '#38B2AC', '#81E6D9', '#E6FFFA', '#285E61']}
                  className="h-80"
                />
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Time Spent by Age Group (minutes per session)</CardTitle>
              <CardDescription>Average time spent per game by age group</CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart
                data={timeSpentData}
                categories={['18-24', '25-34', '35-44', '45+']}
                index="name"
                colors={['#4FD1C5', '#38B2AC', '#81E6D9', '#E6FFFA']}
                className="h-80"
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="diseases">
          <Card>
            <CardHeader>
              <CardTitle>Disease Analysis</CardTitle>
              <CardDescription>
                Detailed breakdown of reported health concerns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">Health Concerns Distribution</h3>
                  <div className="h-80">
                    <PieChart
                      data={diseasesData}
                      category="value"
                      index="name"
                      colors={['#4FD1C5', '#38B2AC', '#81E6D9', '#E6FFFA', '#285E61']}
                    />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Recommended Games by Health Concern</h3>
                  <div className="space-y-2">
                    {[
                      { concern: 'Anxiety', games: ['Breathing Exercise', 'Memory Match'] },
                      { concern: 'Depression', games: ['Memory Match', 'Reaction Time'] },
                      { concern: 'Insomnia', games: ['Breathing Exercise'] },
                      { concern: 'Stress', games: ['Breathing Exercise', 'Reaction Time'] }
                    ].map((item) => (
                      <div key={item.concern} className="flex justify-between items-center border-b pb-2">
                        <span className="font-medium">{item.concern}</span>
                        <div className="flex gap-1">
                          {item.games.map((game) => (
                            <span key={game} className="text-xs bg-health-light text-health-dark px-2 py-1 rounded-full">
                              {game}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="games">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Game Usage Distribution</CardTitle>
                <CardDescription>Percentage of total game sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <PieChart
                  data={gameUsageData}
                  category="value"
                  index="name"
                  colors={['#4FD1C5', '#38B2AC', '#81E6D9']}
                  className="h-80"
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Game Feedback Scores</CardTitle>
                <CardDescription>Average user ratings (out of 5)</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={feedbackScoreData}
                  categories={['score']}
                  index="name"
                  colors={['#4FD1C5']}
                  valueFormatter={(value) => `${value} ★`}
                  startAxisFromZero={true}
                  className="h-80"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Analytics</CardTitle>
              <CardDescription>
                Detailed breakdown of user demographics and behavior
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">Age Distribution</h3>
                  <div className="h-80">
                    <BarChart
                      data={[
                        { age: '18-24', users: 45 },
                        { age: '25-34', users: 35 },
                        { age: '35-44', users: 25 },
                        { age: '45-54', users: 15 },
                        { age: '55+', users: 8 }
                      ]}
                      categories={['users']}
                      index="age"
                      colors={['#4FD1C5']}
                      className="h-80"
                    />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Gender Distribution</h3>
                  <div className="h-80">
                    <PieChart
                      data={[
                        { gender: 'Male', value: 52 },
                        { gender: 'Female', value: 45 },
                        { gender: 'Other', value: 3 }
                      ]}
                      category="value"
                      index="gender"
                      colors={['#4FD1C5', '#38B2AC', '#81E6D9']}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper component for stat cards
const StatCard = ({ title, value, description, icon }) => (
  <Card>
    <CardContent className="p-4">
      <div className="flex items-center gap-3">
        <div className="bg-health-primary/10 p-2 rounded-full">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const Button = ({ children, onClick, className = '' }) => (
  <button
    onClick={onClick}
    className={`bg-health-primary hover:bg-health-secondary text-white px-4 py-2 rounded-md text-sm ${className}`}
  >
    {children}
  </button>
);

export default AdminDashboard;
