
import React, { useState } from 'react';
import { Calendar, MapPin, Users, Clock, Plus, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface EventsProps {
  onPageChange?: (page: string) => void;
}

const Events = ({ onPageChange }: EventsProps) => {
  const [filter, setFilter] = useState('all');

  const events = [
    {
      id: 1,
      name: 'Tech Conference 2024',
      description: 'Annual technology conference featuring the latest in AI and web development',
      date: '2024-12-15',
      time: '09:00 AM',
      location: 'Convention Center, San Francisco',
      attendees: 245,
      maxAttendees: 300,
      status: 'active',
      ticketsSold: 245,
      revenue: '$12,450',
      image: '/placeholder.svg'
    },
    {
      id: 2,
      name: 'Music Festival',
      description: 'Three-day outdoor music festival with top artists',
      date: '2024-12-20',
      time: '02:00 PM',
      location: 'Golden Gate Park, San Francisco',
      attendees: 189,
      maxAttendees: 500,
      status: 'selling',
      ticketsSold: 189,
      revenue: '$8,920',
      image: '/placeholder.svg'
    },
    {
      id: 3,
      name: 'Business Summit',
      description: 'Strategic business planning and networking event',
      date: '2025-01-05',
      time: '10:00 AM',
      location: 'Hilton Hotel, Downtown',
      attendees: 67,
      maxAttendees: 150,
      status: 'open',
      ticketsSold: 67,
      revenue: '$3,340',
      image: '/placeholder.svg'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'selling':
        return 'bg-blue-100 text-blue-800';
      case 'open':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredEvents = filter === 'all' ? events : events.filter(event => event.status === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Events</h1>
          <p className="text-slate-600 mt-1">Manage your events and track performance</p>
        </div>
        <Button
          onClick={() => onPageChange?.('create-event')}
          className="gradient-primary text-white border-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Event
        </Button>
      </div>

      {/* Filters */}
      <div className="flex space-x-2">
        {['all', 'active', 'selling', 'open'].map((status) => (
          <Button
            key={status}
            variant={filter === status ? "default" : "outline"}
            onClick={() => setFilter(status)}
            className={filter === status ? "gradient-primary text-white border-0" : ""}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Button>
        ))}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <Card key={event.id} className="hover:shadow-lg transition-shadow overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Calendar className="h-12 w-12 text-white" />
            </div>
            
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg line-clamp-2">{event.name}</CardTitle>
                <Badge className={getStatusColor(event.status)}>
                  {event.status}
                </Badge>
              </div>
              <p className="text-sm text-slate-600 line-clamp-2">{event.description}</p>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-slate-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  {event.date} at {event.time}
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {event.location}
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <Users className="h-4 w-4 mr-2" />
                  {event.attendees} / {event.maxAttendees} attendees
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="text-sm text-slate-600">Revenue</p>
                  <p className="font-semibold text-slate-900">{event.revenue}</p>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create New Event Card */}
      <Card 
        className="border-dashed border-2 border-slate-300 hover:border-blue-400 transition-colors cursor-pointer"
        onClick={() => onPageChange?.('create-event')}
      >
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Plus className="h-12 w-12 text-slate-400 mb-4" />
          <h3 className="text-lg font-semibold text-slate-600">Create New Event</h3>
          <p className="text-slate-500 text-center mt-2">
            Start planning your next amazing event
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Events;
