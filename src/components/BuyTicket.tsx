
import React, { useState } from 'react';
import { Ticket, CreditCard, Calendar, MapPin, Users, ArrowLeft, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface BuyTicketProps {
  onPageChange?: (page: string) => void;
}

const BuyTicket = ({ onPageChange }: BuyTicketProps) => {
  const [selectedEvent, setSelectedEvent] = useState('tech-conference');
  const [selectedTickets, setSelectedTickets] = useState<{[key: string]: number}>({});
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
    email: '',
    phone: ''
  });

  const events = [
    {
      id: 'tech-conference',
      name: 'Tech Conference 2024',
      date: 'December 15, 2024',
      time: '9:00 AM - 6:00 PM',
      location: 'Convention Center, San Francisco',
      description: 'Annual technology conference featuring the latest in AI and web development',
      image: '/placeholder.svg'
    },
    {
      id: 'music-festival',
      name: 'Music Festival',
      date: 'December 20, 2024',
      time: '2:00 PM - 11:00 PM',
      location: 'Golden Gate Park, San Francisco',
      description: 'Three-day outdoor music festival with top artists',
      image: '/placeholder.svg'
    },
  ];

  const ticketTypes = {
    'tech-conference': [
      {
        id: 'early-bird',
        name: 'Early Bird',
        price: 49.99,
        originalPrice: 79.99,
        available: 15,
        perks: ['Digital Swag Bag', 'Early Access', 'Reserved Seating']
      },
      {
        id: 'regular',
        name: 'Regular',
        price: 79.99,
        available: 58,
        perks: ['Digital Swag Bag', 'General Admission']
      },
      {
        id: 'vip',
        name: 'VIP',
        price: 149.99,
        available: 32,
        perks: ['Premium Swag Bag', 'VIP Lounge Access', 'Front Row Seating', 'Meet & Greet']
      },
    ],
    'music-festival': [
      {
        id: 'general',
        name: 'General Admission',
        price: 89.99,
        available: 120,
        perks: ['Festival Wristband', 'Access to All Stages']
      },
      {
        id: 'vip',
        name: 'VIP Experience',
        price: 199.99,
        available: 25,
        perks: ['VIP Area Access', 'Complimentary Drinks', 'Artist Meet & Greet', 'Premium Viewing']
      },
    ]
  };

  const currentEvent = events.find(e => e.id === selectedEvent);
  const currentTickets = ticketTypes[selectedEvent as keyof typeof ticketTypes] || [];

  const updateTicketQuantity = (ticketId: string, quantity: number) => {
    if (quantity <= 0) {
      const newSelected = { ...selectedTickets };
      delete newSelected[ticketId];
      setSelectedTickets(newSelected);
    } else {
      setSelectedTickets({ ...selectedTickets, [ticketId]: quantity });
    }
  };

  const calculateTotal = () => {
    return currentTickets.reduce((total, ticket) => {
      const quantity = selectedTickets[ticket.id] || 0;
      return total + (ticket.price * quantity);
    }, 0);
  };

  const getTotalTickets = () => {
    return Object.values(selectedTickets).reduce((sum, qty) => sum + qty, 0);
  };

  const handlePurchase = () => {
    console.log('Purchase data:', { selectedTickets, paymentData, event: selectedEvent });
    // Handle payment processing here
    alert('Purchase successful! Redirecting to confirmation...');
    onPageChange?.('dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button
            variant="outline"
            onClick={() => onPageChange?.('dashboard')}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Buy Tickets</h1>
            <p className="text-slate-600 mt-1">Select your event and purchase tickets</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event Selection & Tickets */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Selector */}
            <Card>
              <CardHeader>
                <CardTitle>Select Event</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedEvent === event.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                      onClick={() => setSelectedEvent(event.id)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <Calendar className="h-8 w-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900">{event.name}</h3>
                          <div className="flex items-center text-sm text-slate-600 mt-1">
                            <Calendar className="h-4 w-4 mr-1" />
                            {event.date} • {event.time}
                          </div>
                          <div className="flex items-center text-sm text-slate-600 mt-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            {event.location}
                          </div>
                        </div>
                        {selectedEvent === event.id && (
                          <Check className="h-6 w-6 text-blue-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Ticket Selection */}
            {currentEvent && (
              <Card>
                <CardHeader>
                  <CardTitle>Select Tickets for {currentEvent.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentTickets.map((ticket) => (
                    <div key={ticket.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-slate-900">{ticket.name}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-lg font-bold text-slate-900">${ticket.price}</span>
                            {ticket.originalPrice && ticket.originalPrice !== ticket.price && (
                              <span className="text-sm text-slate-500 line-through">
                                ${ticket.originalPrice}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-600">{ticket.available} available</p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateTicketQuantity(ticket.id, (selectedTickets[ticket.id] || 0) - 1)}
                            disabled={!selectedTickets[ticket.id]}
                          >
                            -
                          </Button>
                          <span className="w-8 text-center">{selectedTickets[ticket.id] || 0}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateTicketQuantity(ticket.id, (selectedTickets[ticket.id] || 0) + 1)}
                            disabled={(selectedTickets[ticket.id] || 0) >= ticket.available}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {ticket.perks.map((perk, index) => (
                          <Badge key={index} variant="outline" className="bg-slate-50">
                            {perk}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary & Payment */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Ticket className="h-5 w-5 mr-2" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentEvent && (
                  <div>
                    <h4 className="font-semibold text-slate-900">{currentEvent.name}</h4>
                    <p className="text-sm text-slate-600">{currentEvent.date}</p>
                  </div>
                )}
                
                <div className="space-y-2">
                  {currentTickets.map((ticket) => {
                    const quantity = selectedTickets[ticket.id] || 0;
                    if (quantity === 0) return null;
                    
                    return (
                      <div key={ticket.id} className="flex justify-between">
                        <span>{ticket.name} × {quantity}</span>
                        <span>${(ticket.price * quantity).toFixed(2)}</span>
                      </div>
                    );
                  })}
                </div>
                
                {getTotalTickets() > 0 && (
                  <>
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>${calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="text-sm text-slate-600">
                      <Users className="h-4 w-4 inline mr-1" />
                      {getTotalTickets()} ticket{getTotalTickets() !== 1 ? 's' : ''}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Payment Form */}
            {getTotalTickets() > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Payment Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={paymentData.name}
                      onChange={(e) => setPaymentData({ ...paymentData, name: e.target.value })}
                      placeholder="John Smith"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={paymentData.email}
                      onChange={(e) => setPaymentData({ ...paymentData, email: e.target.value })}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={paymentData.phone}
                      onChange={(e) => setPaymentData({ ...paymentData, phone: e.target.value })}
                      placeholder="+1 (555) 123-4567"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      value={paymentData.cardNumber}
                      onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        value={paymentData.expiryDate}
                        onChange={(e) => setPaymentData({ ...paymentData, expiryDate: e.target.value })}
                        placeholder="MM/YY"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        value={paymentData.cvv}
                        onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
                        placeholder="123"
                        required
                      />
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handlePurchase}
                    className="w-full gradient-primary text-white border-0"
                    disabled={!paymentData.name || !paymentData.email || !paymentData.cardNumber}
                  >
                    Complete Purchase - ${calculateTotal().toFixed(2)}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyTicket;
