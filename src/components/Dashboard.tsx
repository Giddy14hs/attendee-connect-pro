import React from 'react';
import { Calendar, Users, Ticket, TrendingUp, DollarSign, Clock, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DashboardProps {
  onPageChange?: (page: string) => void;
}

const Dashboard = ({ onPageChange }: DashboardProps) => {
  const stats = [
    {
      title: 'Total Events',
      value: '24',
      change: '+12%',
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Registered Attendees',
      value: '1,234',
      change: '+23%',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Tickets Sold',
      value: '856',
      change: '+18%',
      icon: Ticket,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Revenue',
      value: '$45,230',
      change: '+31%',
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
    },
  ];

  const recentEvents = [
    {
      name: 'Tech Conference 2024',
      date: 'Dec 15, 2024',
      attendees: 245,
      status: 'Active',
      revenue: '$12,450'
    },
    {
      name: 'Music Festival',
      date: 'Dec 20, 2024',
      attendees: 189,
      status: 'Selling',
      revenue: '$8,920'
    },
    {
      name: 'Business Summit',
      date: 'Jan 5, 2025',
      attendees: 67,
      status: 'Open',
      revenue: '$3,340'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
            <p className="text-blue-100 text-lg">
              Manage your events, track attendance, and grow your business.
            </p>
          </div>
          <div className="hidden md:block animate-float">
            <Calendar className="h-24 w-24 text-blue-200" />
          </div>
        </div>
        
        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            onClick={() => onPageChange?.('create-event')}
            className="bg-white text-blue-600 hover:bg-blue-50"
          >
            Create New Event
          </Button>
          <Button
            onClick={() => onPageChange?.('events')}
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-blue-600"
          >
            View All Events
          </Button>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">{stat.change}</span>
                  </div>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Events
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange?.('events')}
              >
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentEvents.map((event, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-slate-900">{event.name}</h4>
                    <div className="flex items-center text-sm text-slate-600 mt-1">
                      <Clock className="h-4 w-4 mr-1" />
                      {event.date}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">{event.revenue}</p>
                    <p className="text-sm text-slate-600">{event.attendees} attendees</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => onPageChange?.('create-event')}
                className="h-20 flex flex-col items-center justify-center gradient-primary text-white border-0"
              >
                <Calendar className="h-6 w-6 mb-2" />
                Create Event
              </Button>
              <Button
                onClick={() => onPageChange?.('attendees')}
                variant="outline"
                className="h-20 flex flex-col items-center justify-center"
              >
                <Users className="h-6 w-6 mb-2" />
                Manage Attendees
              </Button>
              <Button
                onClick={() => onPageChange?.('tickets')}
                variant="outline"
                className="h-20 flex flex-col items-center justify-center"
              >
                <Ticket className="h-6 w-6 mb-2" />
                Ticket Types
              </Button>
              <Button
                onClick={() => onPageChange?.('communications')}
                variant="outline"
                className="h-20 flex flex-col items-center justify-center"
              >
                <Mail className="h-6 w-6 mb-2" />
                Send Messages
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
