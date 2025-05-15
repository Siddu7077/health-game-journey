
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useGameTracker } from '@/contexts/GameTrackerContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AuthForm from '@/components/auth/AuthForm';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const StatsPage = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const { user } = useAuth();
  const { sessions } = useGameTracker();

  if (!user) {
    return (
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Login to View Your Stats</h1>
        <AuthForm />
      </div>
    );
  }

  // Process game sessions data for visualization
  const gameSessionsByType = sessions.reduce((acc, session) => {
    acc[session.gameId] = (acc[session.gameId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const gameSessionsData = Object.entries(gameSessionsByType).map(([name, count]) => ({
    name,
    count
  }));

  const totalTimeByGame = sessions.reduce((acc, session) => {
    if (session.duration) {
      acc[session.gameId] = (acc[session.gameId] || 0) + session.duration;
    }
    return acc;
  }, {} as Record<string, number>);

  const timeData = Object.entries(totalTimeByGame).map(([name, duration]) => ({
    name,
    minutes: Math.round(duration / 60000) // Convert ms to minutes
  }));

  // Recent sessions
  const recentSessions = [...sessions]
    .sort((a, b) => b.startTime - a.startTime)
    .slice(0, 10);

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-2">My Health Stats</h1>
        <p className="text-muted-foreground">
          Track your progress and engagement with therapeutic activities
        </p>
      </div>

      <Tabs defaultValue="overview" onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="games">Games</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Total Sessions</CardTitle>
                <CardDescription>Games and activities completed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-health-primary">
                  {sessions.length}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Total Time</CardTitle>
                <CardDescription>Minutes spent on activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-health-primary">
                  {Object.values(totalTimeByGame).reduce((acc, time) => acc + time, 0) / 60000 | 0}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Most Played</CardTitle>
                <CardDescription>Your favorite activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-health-primary capitalize">
                  {gameSessionsData.length > 0 
                    ? gameSessionsData.sort((a, b) => b.count - a.count)[0].name
                    : 'No data yet'}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Activity Distribution</CardTitle>
                <CardDescription>Games played by type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={gameSessionsData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        nameKey="name"
                        label={({name}) => name}
                      >
                        {gameSessionsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Time Per Activity</CardTitle>
                <CardDescription>Minutes spent on each game</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={timeData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="minutes" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="games" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gameSessionsData.map((game, index) => (
              <Card key={game.name}>
                <CardHeader className="pb-2">
                  <CardTitle className="capitalize">{game.name}</CardTitle>
                  <CardDescription>{game.count} total sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium">Total time</div>
                      <div className="text-2xl font-bold text-health-primary">
                        {Math.round((totalTimeByGame[game.name] || 0) / 60000)} min
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium">Average session</div>
                      <div className="text-lg font-bold">
                        {Math.round((totalTimeByGame[game.name] || 0) / game.count / 1000)} sec
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {gameSessionsData.length === 0 && (
              <div className="col-span-3 text-center py-10">
                <p className="text-muted-foreground">
                  You haven't played any games yet. Start playing to collect stats!
                </p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest game sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="py-2 px-4 text-left font-medium">Game</th>
                      <th className="py-2 px-4 text-left font-medium">Date</th>
                      <th className="py-2 px-4 text-left font-medium">Duration</th>
                      <th className="py-2 px-4 text-left font-medium">Completed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentSessions.map((session, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-muted/20'}>
                        <td className="py-2 px-4 capitalize">{session.gameId}</td>
                        <td className="py-2 px-4">
                          {new Date(session.startTime).toLocaleDateString()}
                        </td>
                        <td className="py-2 px-4">
                          {session.duration ? `${Math.round(session.duration / 1000)}s` : 'N/A'}
                        </td>
                        <td className="py-2 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            session.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {session.completed ? 'Completed' : 'Abandoned'}
                          </span>
                        </td>
                      </tr>
                    ))}
                    
                    {recentSessions.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-6 text-center text-muted-foreground">
                          No activity recorded yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StatsPage;
