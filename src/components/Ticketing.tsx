
import React, { useState } from 'react';
import { Ticket, Plus, Edit, Trash2, TrendingUp, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface TicketingProps {
  onPageChange?: (page: string) => void;
}

const Ticketing = ({ onPageChange }: TicketingProps) => {
  const [selectedEvent, setSelectedEvent] = useState('tech-conference');

  const events = [
    { id: 'tech-conference', name: 'Tech Conference 2024' },
    { id: 'music-festival', name: 'Music Festival' },
    { id: 'business-summit', name: 'Business Summit' },
  ];

  const ticketTypes = [
    {
      id: 1,
      name: 'Early Bird',
      price: 49.99,
      originalPrice: 79.99,
      sold: 85,
      total: 100,
      revenue: 4249.15,
      status: 'active',
      description: 'Limited time early bird pricing',
      perks: ['Digital Swag Bag', 'Early Access', 'Reserved Seating']
    },
    {
      id: 2,
      name: 'Regular',
      price: 79.99,
      originalPrice: 79.99,
      sold: 142,
      total: 200,
      revenue: 11358.58,
      status: 'active',
      description: 'Standard admission ticket',
      perks: ['Digital Swag Bag', 'General Admission']
    },
    {
      id: 3,
      name: 'VIP',
      price: 149.99,
      originalPrice: 149.99,
      sold: 18,
      total: 50,
      revenue: 2699.82,
      status: 'active',
      description: 'Premium experience with exclusive benefits',
      perks: ['Premium Swag Bag', 'VIP Lounge Access', 'Front Row Seating', 'Meet & Greet']
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'sold-out':
        return 'bg-red-100 text-red-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalRevenue = ticketTypes.reduce((sum, ticket) => sum + ticket.revenue, 0);
  const totalSold = ticketTypes.reduce((sum, ticket) => sum + ticket.sold, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Ticketing</h1>
          <p className="text-slate-600 mt-1">Manage ticket types and pricing for your events</p>
        </div>
        <Button className="gradient-primary text-white border-0">
          <Plus className="h-4 w-4 mr-2" />
          Create Ticket Type
        </Button>
      </div>

      {/* Event Selector */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-slate-700">Select Event:</label>
            <div className="flex space-x-2">
              {events.map((event) => (
                <Button
                  key={event.id}
                  variant={selectedEvent === event.id ? "default" : "outline"}
                  onClick={() => setSelectedEvent(event.id)}
                  className={selectedEvent === event.id ? "gradient-primary text-white border-0" : ""}
                >
                  {event.name}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Revenue</p>
                <p className="text-2xl font-bold text-slate-900">${totalRevenue.toFixed(2)}</p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Tickets Sold</p>
                <p className="text-2xl font-bold text-slate-900">{totalSold}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <Ticket className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Avg. Ticket Price</p>
                <p className="text-2xl font-bold text-slate-900">
                  ${(totalRevenue / totalSold).toFixed(2)}
                </p>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ticket Types */}
      <div className="grid gap-6">
        {ticketTypes.map((ticket) => (
          <Card key={ticket.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Ticket className="h-5 w-5 mr-2" />
                  {ticket.name} Ticket
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(ticket.status)}>
                    {ticket.status}
                  </Badge>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Pricing */}
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Pricing</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-slate-900">${ticket.price}</span>
                      {ticket.originalPrice !== ticket.price && (
                        <span className="text-sm text-slate-500 line-through">
                          ${ticket.originalPrice}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600">{ticket.description}</p>
                  </div>
                </div>

                {/* Sales Progress */}
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Sales Progress</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Sold: {ticket.sold}</span>
                      <span>Total: {ticket.total}</span>
                    </div>
                    <Progress value={(ticket.sold / ticket.total) * 100} className="h-2" />
                    <p className="text-sm text-slate-600">
                      {Math.round((ticket.sold / ticket.total) * 100)}% sold
                    </p>
                  </div>
                </div>

                {/* Revenue */}
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Revenue</h4>
                  <div className="space-y-2">
                    <span className="text-2xl font-bold text-green-600">
                      ${ticket.revenue.toFixed(2)}
                    </span>
                    <p className="text-sm text-slate-600">
                      ${(ticket.revenue / ticket.sold).toFixed(2)} avg per ticket
                    </p>
                  </div>
                </div>
              </div>

              {/* Perks */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Included Perks</h4>
                <div className="flex flex-wrap gap-2">
                  {ticket.perks.map((perk, index) => (
                    <Badge key={index} variant="outline" className="bg-slate-50">
                      {perk}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add New Ticket Type */}
        <Card className="border-dashed border-2 border-slate-300 hover:border-blue-400 transition-colors cursor-pointer">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Plus className="h-12 w-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-semibold text-slate-600">Add New Ticket Type</h3>
            <p className="text-slate-500 text-center mt-2">
              Create additional pricing tiers for your event
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Ticketing;
