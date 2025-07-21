import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Users, DollarSign, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CreateEventProps {
  onPageChange?: (page: string) => void;
}

const CreateEvent = ({ onPageChange }: CreateEventProps) => {
  const [eventData, setEventData] = useState({
    name: '',
    description: '',
    date: '',
    time: '',
    location: '',
    maxAttendees: '',
    category: '',
    ticketTypes: [
      { name: 'Early Bird', price: '', quantity: '', description: '' },
      { name: 'Regular', price: '', quantity: '', description: '' },
      { name: 'VIP', price: '', quantity: '', description: '' },
    ]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    try {
      const res = await fetch('/api/event_api.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_event',
          title: eventData.name,
          description: eventData.description,
          date: eventData.date,
          time: eventData.time,
          location: eventData.location,
          max_attendees: eventData.maxAttendees,
          category: eventData.category,
          organizer_id: user.id || user.email, // fallback to email if id is not available
          ticket_types: eventData.ticketTypes
        })
      });
      const data = await res.json();
      if (res.ok) {
        onPageChange?.('events');
      } else {
        alert(data.error || 'Failed to create event');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  const updateTicketType = (index: number, field: string, value: string) => {
    const newTicketTypes = [...eventData.ticketTypes];
    newTicketTypes[index] = { ...newTicketTypes[index], [field]: value };
    setEventData({ ...eventData, ticketTypes: newTicketTypes });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          onClick={() => onPageChange?.('events')}
          className="p-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Create New Event</h1>
          <p className="text-slate-600 mt-1">Set up your event details and ticket types</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="eventName">Event Name</Label>
                <Input
                  id="eventName"
                  value={eventData.name}
                  onChange={(e) => setEventData({ ...eventData, name: e.target.value })}
                  placeholder="Enter event name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={eventData.category} onValueChange={(value) => setEventData({ ...eventData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conference">Conference</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="networking">Networking</SelectItem>
                    <SelectItem value="festival">Festival</SelectItem>
                    <SelectItem value="concert">Concert</SelectItem>
                    <SelectItem value="seminar">Seminar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={eventData.description}
                onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                placeholder="Describe your event"
                rows={3}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Date, Time & Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Date, Time & Location
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={eventData.date}
                  onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={eventData.time}
                  onChange={(e) => setEventData({ ...eventData, time: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="maxAttendees">Max Attendees</Label>
                <Input
                  id="maxAttendees"
                  type="number"
                  value={eventData.maxAttendees}
                  onChange={(e) => setEventData({ ...eventData, maxAttendees: e.target.value })}
                  placeholder="100"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={eventData.location}
                onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
                placeholder="Enter venue address"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Ticket Types */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Ticket Types
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {eventData.ticketTypes.map((ticket, index) => (
              <div key={index} className="p-4 border rounded-lg bg-slate-50">
                <h4 className="font-semibold text-slate-900 mb-3">{ticket.name} Ticket</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor={`price-${index}`}>Price ($)</Label>
                    <Input
                      id={`price-${index}`}
                      type="number"
                      value={ticket.price}
                      onChange={(e) => updateTicketType(index, 'price', e.target.value)}
                      placeholder="0.00"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                    <Input
                      id={`quantity-${index}`}
                      type="number"
                      value={ticket.quantity}
                      onChange={(e) => updateTicketType(index, 'quantity', e.target.value)}
                      placeholder="50"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`description-${index}`}>Description</Label>
                    <Input
                      id={`description-${index}`}
                      value={ticket.description}
                      onChange={(e) => updateTicketType(index, 'description', e.target.value)}
                      placeholder="Ticket benefits"
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onPageChange?.('events')}
          >
            Cancel
          </Button>
          <Button type="submit" className="gradient-primary text-white border-0">
            Create Event
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;
