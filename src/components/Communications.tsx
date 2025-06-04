
import React, { useState } from 'react';
import { Mail, MessageSquare, Send, Users, Calendar, Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface CommunicationsProps {
  onPageChange?: (page: string) => void;
}

const Communications = ({ onPageChange }: CommunicationsProps) => {
  const [messageType, setMessageType] = useState('email');
  const [messageData, setMessageData] = useState({
    subject: '',
    content: '',
    recipient: 'all',
    event: '',
    scheduledTime: ''
  });

  const recentMessages = [
    {
      id: 1,
      type: 'email',
      subject: 'Welcome to Tech Conference 2024',
      recipients: 245,
      status: 'sent',
      sentAt: '2024-11-25 10:30 AM',
      event: 'Tech Conference 2024'
    },
    {
      id: 2,
      type: 'sms',
      subject: 'Event Reminder - Tomorrow!',
      recipients: 189,
      status: 'scheduled',
      sentAt: '2024-12-14 09:00 AM',
      event: 'Music Festival'
    },
    {
      id: 3,
      type: 'email',
      subject: 'Parking Information Update',
      recipients: 67,
      status: 'sent',
      sentAt: '2024-11-20 02:15 PM',
      event: 'Business Summit'
    },
  ];

  const templates = [
    { id: 'welcome', name: 'Welcome Message', description: 'Greet new attendees' },
    { id: 'reminder', name: 'Event Reminder', description: 'Day before reminder' },
    { id: 'update', name: 'Event Update', description: 'Schedule or location changes' },
    { id: 'thank-you', name: 'Thank You Message', description: 'Post-event appreciation' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSendMessage = () => {
    console.log('Sending message:', messageData);
    // Handle message sending logic here
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Communications</h1>
          <p className="text-slate-600 mt-1">Send emails and SMS notifications to attendees</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message Composer */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Send className="h-5 w-5 mr-2" />
                Compose Message
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Message Type */}
              <div className="flex space-x-2">
                <Button
                  variant={messageType === 'email' ? "default" : "outline"}
                  onClick={() => setMessageType('email')}
                  className={messageType === 'email' ? "gradient-primary text-white border-0" : ""}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
                <Button
                  variant={messageType === 'sms' ? "default" : "outline"}
                  onClick={() => setMessageType('sms')}
                  className={messageType === 'sms' ? "gradient-primary text-white border-0" : ""}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  SMS
                </Button>
              </div>

              {/* Recipients */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="recipients">Recipients</Label>
                  <Select value={messageData.recipient} onValueChange={(value) => setMessageData({ ...messageData, recipient: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipients" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Attendees</SelectItem>
                      <SelectItem value="confirmed">Confirmed Only</SelectItem>
                      <SelectItem value="vip">VIP Ticket Holders</SelectItem>
                      <SelectItem value="regular">Regular Ticket Holders</SelectItem>
                      <SelectItem value="early-bird">Early Bird Holders</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="event">Event</Label>
                  <Select value={messageData.event} onValueChange={(value) => setMessageData({ ...messageData, event: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select event" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tech-conference">Tech Conference 2024</SelectItem>
                      <SelectItem value="music-festival">Music Festival</SelectItem>
                      <SelectItem value="business-summit">Business Summit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Subject (for emails) */}
              {messageType === 'email' && (
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={messageData.subject}
                    onChange={(e) => setMessageData({ ...messageData, subject: e.target.value })}
                    placeholder="Enter email subject"
                  />
                </div>
              )}

              {/* Message Content */}
              <div>
                <Label htmlFor="content">
                  {messageType === 'email' ? 'Email Content' : 'SMS Message'}
                </Label>
                <Textarea
                  id="content"
                  value={messageData.content}
                  onChange={(e) => setMessageData({ ...messageData, content: e.target.value })}
                  placeholder={messageType === 'email' ? 'Enter your email content...' : 'Enter your SMS message (max 160 characters)...'}
                  rows={messageType === 'email' ? 6 : 3}
                  maxLength={messageType === 'sms' ? 160 : undefined}
                />
                {messageType === 'sms' && (
                  <p className="text-sm text-slate-500 mt-1">
                    {messageData.content.length}/160 characters
                  </p>
                )}
              </div>

              {/* Schedule (optional) */}
              <div>
                <Label htmlFor="schedule">Schedule for Later (Optional)</Label>
                <Input
                  id="schedule"
                  type="datetime-local"
                  value={messageData.scheduledTime}
                  onChange={(e) => setMessageData({ ...messageData, scheduledTime: e.target.value })}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <Button onClick={handleSendMessage} className="gradient-primary text-white border-0">
                  <Send className="h-4 w-4 mr-2" />
                  {messageData.scheduledTime ? 'Schedule' : 'Send Now'}
                </Button>
                <Button variant="outline">
                  Save as Draft
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Messages */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentMessages.map((message) => (
                  <div key={message.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-full ${message.type === 'email' ? 'bg-blue-100' : 'bg-green-100'}`}>
                        {message.type === 'email' ? (
                          <Mail className={`h-4 w-4 ${message.type === 'email' ? 'text-blue-600' : 'text-green-600'}`} />
                        ) : (
                          <MessageSquare className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">{message.subject}</h4>
                        <p className="text-sm text-slate-600">{message.event}</p>
                        <p className="text-sm text-slate-500">{message.recipients} recipients • {message.sentAt}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(message.status)}>
                      {message.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Message Templates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Templates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="p-3 border rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <h4 className="font-medium text-slate-900">{template.name}</h4>
                    <p className="text-sm text-slate-600">{template.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">12</div>
                <div className="text-sm text-slate-600">Emails Sent Today</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">8</div>
                <div className="text-sm text-slate-600">SMS Sent Today</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">95%</div>
                <div className="text-sm text-slate-600">Delivery Rate</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Communications;
