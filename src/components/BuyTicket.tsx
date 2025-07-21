import React, { useState } from 'react';
import { ArrowLeft, Calendar, MapPin, Users, Star, CreditCard, Lock, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface BuyTicketProps {
  onPageChange?: (page: string) => void;
}

const BuyTicket = ({ onPageChange }: BuyTicketProps) => {
  const [selectedTicket, setSelectedTicket] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [step, setStep] = useState(1);
  
  const [paymentData, setPaymentData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    billingAddress: ''
  });

  const event = {
    name: 'Tech Conference 2024',
    date: 'December 15, 2024',
    time: '9:00 AM - 6:00 PM',
    location: 'Convention Center, San Francisco',
    image: '/placeholder.svg'
  };

  const ticketTypes = [
    {
      id: 'early-bird',
      name: 'Early Bird',
      price: 99,
      originalPrice: 149,
      available: 50,
      perks: ['All sessions access', 'Welcome kit', 'Lunch included']
    },
    {
      id: 'regular',
      name: 'Regular',
      price: 149,
      originalPrice: 199,
      available: 200,
      perks: ['All sessions access', 'Welcome kit', 'Lunch included', 'Networking dinner']
    },
    {
      id: 'vip',
      name: 'VIP',
      price: 299,
      originalPrice: 399,
      available: 25,
      perks: ['All sessions access', 'Premium welcome kit', 'All meals included', 'VIP lounge access', 'Meet & greet with speakers', 'Priority seating']
    }
  ];

  const handleNext = () => {
    if (step === 1 && !selectedTicket) {
      alert('Please select a ticket type');
      return;
    }
    // Add login check before proceeding to payment step
    if (step === 1) {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      if (!user) {
        alert('Please log in or sign up to buy tickets.');
        return;
      }
    }
    if (step === 2) {
       if (!paymentData.email || !paymentData.firstName || !paymentData.lastName || !paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv || !paymentData.billingAddress) {
        alert('Please fill in all payment details');
        return;
      }
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const calculateTotal = () => {
    const ticket = ticketTypes.find(t => t.id === selectedTicket);
    return ticket ? ticket.price * quantity : 0;
  };

  const handleComplete = async () => {
    // 1. Register user if not exists
    try {
      const resUser = await fetch('/api/user_api.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'register_from_ticket', email: paymentData.email, name: paymentData.firstName + ' ' + paymentData.lastName })
      });
      await resUser.json();
      // 2. Get userId (optional: you may want to fetch user by email or store in localStorage)
      // For now, just use email as identifier
      // 3. Register for event (replace 1 with actual eventId)
      const eventId = 1; // TODO: Replace with actual eventId from props or context
      const resReg = await fetch('/api/user_api.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'register_for_event', userId: paymentData.email, eventId })
      });
      const data = await resReg.json();
      if (!resReg.ok) {
        alert(data.error || 'Failed to register for event');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Select Ticket Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ticketTypes.map((ticket) => (
                <Card
                  key={ticket.id}
                  className={`cursor-pointer hover:shadow-md transition-shadow ${selectedTicket === ticket.id ? 'border-2 border-blue-500 shadow-md' : ''}`}
                  onClick={() => setSelectedTicket(ticket.id)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {ticket.name}
                      <Badge className="bg-green-100 text-green-800">{ticket.available} left</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${ticket.price}</div>
                    <div className="text-sm text-slate-500 line-through">${ticket.originalPrice}</div>
                    <ul className="list-disc pl-4 mt-2 space-y-1">
                      {ticket.perks.map((perk, index) => (
                        <li key={index} className="text-sm text-slate-600">{perk}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Payment Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={paymentData.email}
                  onChange={(e) => setPaymentData({ ...paymentData, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="name">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Enter your first name"
                  value={paymentData.firstName}
                  onChange={(e) => setPaymentData({ ...paymentData, firstName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="name">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Enter your last name"
                  value={paymentData.lastName}
                  onChange={(e) => setPaymentData({ ...paymentData, lastName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  type="text"
                  placeholder="Enter your card number"
                  value={paymentData.cardNumber}
                  onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="text"
                  placeholder="MM/YY"
                  value={paymentData.expiryDate}
                  onChange={(e) => setPaymentData({ ...paymentData, expiryDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  type="text"
                  placeholder="CVV"
                  value={paymentData.cvv}
                  onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="billingAddress">Billing Address</Label>
                <Input
                  id="billingAddress"
                  type="text"
                  placeholder="Enter your billing address"
                  value={paymentData.billingAddress}
                  onChange={(e) => setPaymentData({ ...paymentData, billingAddress: e.target.value })}
                />
              </div>
            </div>
          </div>
        );
      case 3:
        const ticket = ticketTypes.find(t => t.id === selectedTicket);
        const totalPrice = calculateTotal();
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Confirmation</h2>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>Event: {event.name}</p>
                  <p>Ticket: {ticket?.name}</p>
                  <p>Quantity: {quantity}</p>
                  <p>Total: ${totalPrice}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>Email: {paymentData.email}</p>
                  <p>Name: {paymentData.firstName} {paymentData.lastName}</p>
                  <p>Card Number: ****-****-****-{paymentData.cardNumber.slice(-4)}</p>
                </div>
              </CardContent>
            </Card>
            <div className="text-green-600 font-semibold text-center">
              <Check className="inline-block h-6 w-6 mr-2 align-middle" />
              Payment Successful!
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto mt-8 p-6">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" onClick={() => onPageChange?.('dashboard')}>
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold text-center mt-4">Buy Ticket</h1>
      </div>

      {/* Event Details */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">{event.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <img src={event.image} alt={event.name} className="rounded-md" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-slate-500" />
                {event.date}, {event.time}
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-slate-500" />
                {event.location}
              </div>
              <p>
                Join us for the Tech Conference 2024, featuring the latest in AI and web development.
                Get your tickets now!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Steps */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className={`flex-1 text-center py-2 ${step === 1 ? 'font-semibold text-blue-600' : 'text-slate-500'}`}>
            1. Select Ticket
          </div>
          <div className={`flex-1 text-center py-2 ${step === 2 ? 'font-semibold text-blue-600' : 'text-slate-500'}`}>
            2. Payment Details
          </div>
          <div className={`flex-1 text-center py-2 ${step === 3 ? 'font-semibold text-blue-600' : 'text-slate-500'}`}>
            3. Confirmation
          </div>
        </div>
        <div className="h-1 bg-slate-200 rounded-full mt-2">
          <div
            className="h-1 bg-blue-500 rounded-full"
            style={{ width: `${(step - 1) * 50}%` }}
          ></div>
        </div>
      </div>

      {/* Step Content */}
      {renderStepContent()}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={step === 1 || step === 3}
        >
          Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={step === 3}
          className="gradient-primary text-white border-0"
        >
          {step === 3 ? 'Complete' : 'Next'}
        </Button>
      </div>
    </div>
  );
};

export default BuyTicket;
