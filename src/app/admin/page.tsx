import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  FileText, 
  Activity,
  UserCheck,
} from "lucide-react";

const Dashboard = () => {
  // Mock data for charts
  const userGrowthData = [
    { month: "Jan", users: 4000 },
    { month: "Feb", users: 5200 },
    { month: "Mar", users: 6100 },
    { month: "Apr", users: 7800 },
    { month: "May", users: 9200 },
    { month: "Jun", users: 11500 },
  ];

  const postEngagementData = [
    { day: "Mon", posts: 120, engagement: 890 },
    { day: "Tue", posts: 150, engagement: 1200 },
    { day: "Wed", posts: 180, engagement: 1500 },
    { day: "Thu", posts: 200, engagement: 1800 },
    { day: "Fri", posts: 240, engagement: 2100 },
    { day: "Sat", posts: 190, engagement: 1600 },
    { day: "Sun", posts: 160, engagement: 1400 },
  ];

  const userTypeData = [
    { name: "Regular Users", value: 68, color: "hsl(var(--primary))" },
    { name: "Premium Users", value: 22, color: "hsl(var(--accent))" },
    { name: "Recruiters", value: 10, color: "hsl(var(--muted-foreground))" },
  ];

  const contentMetrics = [
    { type: "Articles", count: 1234, growth: "+12%" },
    { type: "Posts", count: 5678, growth: "+18%" },
    { type: "Videos", count: 456, growth: "+25%" },
    { type: "Events", count: 89, growth: "+8%" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Monitor platform analytics and performance
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">11,523</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+20.1%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Users
            </CardTitle>
            <UserCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">8,234</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+15.3%</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Posts
            </CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">7,457</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+32.5%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Engagement Rate
            </CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">24.8%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+5.2%</span> from last week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Recent Platform Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { user: "John Doe", action: "Published a new article", time: "2 minutes ago" },
              { user: "Jane Smith", action: "Reported inappropriate content", time: "5 minutes ago" },
              { user: "Mike Johnson", action: "Upgraded to Premium", time: "10 minutes ago" },
              { user: "Sarah Williams", action: "Created a company page", time: "15 minutes ago" },
              { user: "Admin", action: "Removed spam post", time: "20 minutes ago" },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="font-medium text-foreground">{activity.user}</p>
                  <p className="text-sm text-muted-foreground">{activity.action}</p>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;