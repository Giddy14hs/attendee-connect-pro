
import React, { useState } from 'react';
import { Users, Search, Filter, Mail, UserPlus, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface AttendeesProps {
  onPageChange?: (page: string) => void;
}

const Attendees = ({ onPageChange }: AttendeesProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const attendees = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@email.com',
      event: 'Tech Conference 2024',
      ticketType: 'VIP',
      status: 'confirmed',
      registrationDate: '2024-11-15',
      phone: '+1 (555) 123-4567'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      event: 'Music Festival',
      ticketType: 'Regular',
      status: 'pending',
      registrationDate: '2024-11-20',
      phone: '+1 (555) 987-6543'
    },
    {
      id: 3,
      name: 'Mike Davis',
      email: 'mike.davis@email.com',
      event: 'Business Summit',
      ticketType: 'Early Bird',
      status: 'confirmed',
      registrationDate: '2024-11-10',
      phone: '+1 (555) 456-7890'
    },
    {
      id: 4,
      name: 'Emily Chen',
      email: 'emily.chen@email.com',
      event: 'Tech Conference 2024',
      ticketType: 'Regular',
      status: 'waitlist',
      registrationDate: '2024-11-25',
      phone: '+1 (555) 321-0987'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'waitlist':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTicketTypeColor = (type: string) => {
    switch (type) {
      case 'VIP':
        return 'bg-purple-100 text-purple-800';
      case 'Early Bird':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const filteredAttendees = attendees.filter(attendee => {
    const matchesSearch = attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         attendee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         attendee.event.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || attendee.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Attendees</h1>
          <p className="text-slate-600 mt-1">Manage event registrations and attendee information</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button className="gradient-primary text-white border-0">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Attendee
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search attendees by name, email, or event..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex space-x-2">
              {['all', 'confirmed', 'pending', 'waitlist'].map((status) => (
                <Button
                  key={status}
                  variant={filterStatus === status ? "default" : "outline"}
                  onClick={() => setFilterStatus(status)}
                  className={filterStatus === status ? "gradient-primary text-white border-0" : ""}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendees List */}
      <div className="grid gap-4">
        {filteredAttendees.map((attendee) => (
          <Card key={attendee.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {attendee.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h3 className="font-semibold text-slate-900">{attendee.name}</h3>
                    <p className="text-slate-600">{attendee.email}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-slate-500">{attendee.event}</span>
                      <Badge className={getTicketTypeColor(attendee.ticketType)}>
                        {attendee.ticketType}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <Badge className={getStatusColor(attendee.status)}>
                      {attendee.status}
                    </Badge>
                    <p className="text-sm text-slate-500 mt-1">
                      Registered: {attendee.registrationDate}
                    </p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600">
              {attendees.filter(a => a.status === 'confirmed').length}
            </div>
            <div className="text-sm text-slate-600">Confirmed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {attendees.filter(a => a.status === 'pending').length}
            </div>
            <div className="text-sm text-slate-600">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {attendees.filter(a => a.status === 'waitlist').length}
            </div>
            <div className="text-sm text-slate-600">Waitlist</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-slate-600">
              {attendees.length}
            </div>
            <div className="text-sm text-slate-600">Total</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Attendees;
