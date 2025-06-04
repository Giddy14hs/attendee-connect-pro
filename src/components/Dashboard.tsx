import React from 'react';
import { Calendar, Users, Ticket, TrendingUp, DollarSign, Clock, Mail, Search, MapPin, Star, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

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

  // Sample data for carousels
  const coverImages = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=1200&h=600&fit=crop',
      title: 'Tech Conference 2024',
      description: 'Join the biggest tech event of the year',
      date: 'Dec 15, 2024',
      location: 'San Francisco, CA'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&h=600&fit=crop',
      title: 'AI & Machine Learning Summit',
      description: 'Explore the future of artificial intelligence',
      date: 'Jan 20, 2025',
      location: 'New York, NY'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=600&fit=crop',
      title: 'Startup Pitch Competition',
      description: 'Watch innovative startups present their ideas',
      date: 'Feb 10, 2025',
      location: 'Austin, TX'
    }
  ];

  const otherEvents = [
    {
      id: 1,
      title: 'Web Development Workshop',
      date: 'Dec 20, 2024',
      location: 'Online',
      price: '$49',
      image: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=250&fit=crop',
      organizer: 'TechEdu',
      attendees: 156
    },
    {
      id: 2,
      title: 'Design Thinking Bootcamp',
      date: 'Jan 5, 2025',
      location: 'Los Angeles, CA',
      price: '$199',
      image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=250&fit=crop',
      organizer: 'Creative Minds',
      attendees: 89
    },
    {
      id: 3,
      title: 'Blockchain Summit',
      date: 'Jan 15, 2025',
      location: 'Miami, FL',
      price: '$299',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=250&fit=crop',
      organizer: 'CryptoEvents',
      attendees: 234
    },
    {
      id: 4,
      title: 'Mobile App Development',
      date: 'Feb 1, 2025',
      location: 'Seattle, WA',
      price: '$149',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=250&fit=crop',
      organizer: 'AppMakers',
      attendees: 112
    }
  ];

  const recommendedEvents = [
    {
      id: 1,
      title: 'Local Networking Meetup',
      date: 'Dec 18, 2024',
      location: 'San Francisco, CA',
      price: 'Free',
      image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=250&fit=crop',
      organizer: 'SF Tech Community',
      attendees: 78,
      rating: 4.8
    },
    {
      id: 2,
      title: 'Product Management Workshop',
      date: 'Dec 22, 2024',
      location: 'San Francisco, CA',
      price: '$89',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=250&fit=crop',
      organizer: 'PM Academy',
      attendees: 145,
      rating: 4.9
    },
    {
      id: 3,
      title: 'Data Science Bootcamp',
      date: 'Jan 8, 2025',
      location: 'San Francisco, CA',
      price: '$249',
      image: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=250&fit=crop',
      organizer: 'DataLab',
      attendees: 67,
      rating: 4.7
    },
    {
      id: 4,
      title: 'UX/UI Design Conference',
      date: 'Jan 12, 2025',
      location: 'San Francisco, CA',
      price: '$179',
      image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=250&fit=crop',
      organizer: 'Design Hub',
      attendees: 203,
      rating: 4.6
    }
  ];

  const quickLinks = [
    { label: 'Buy a ticket', href: '#buy-ticket', action: () => onPageChange?.('buy-ticket') },
    { label: 'Events', href: '#events', action: () => onPageChange?.('events') },
    { label: 'Sell a ticket', href: '#sell-ticket', action: () => {} },
    { label: 'Buy/Sell a package', href: '#package', action: () => {} },
    { label: 'Find my ticket', href: '#find-ticket', action: () => {} },
    { label: 'Login/Signup', href: '#auth', action: () => onPageChange?.('auth') },
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

      {/* Cover Photo Carousel */}
      <section>
        <Carousel className="w-full">
          <CarouselContent>
            {coverImages.map((item) => (
              <CarouselItem key={item.id}>
                <div className="relative h-96 rounded-2xl overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-8 left-8 text-white">
                    <h2 className="text-4xl font-bold mb-2">{item.title}</h2>
                    <p className="text-xl mb-4">{item.description}</p>
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 mr-2" />
                        {item.date}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 mr-2" />
                        {item.location}
                      </div>
                    </div>
                    <Button className="mt-4 bg-white text-black hover:bg-gray-100">
                      Learn More
                    </Button>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </section>

      {/* Other Events Slideshow */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-slate-900">Other Events</h3>
          <Button
            variant="outline"
            onClick={() => onPageChange?.('events')}
            className="flex items-center"
          >
            View All <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        
        <Carousel className="w-full">
          <CarouselContent className="-ml-2 md:-ml-4">
            {otherEvents.map((event) => (
              <CarouselItem key={event.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="relative">
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-md text-sm font-semibold">
                      {event.price}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-slate-900 mb-2">{event.title}</h4>
                    <div className="space-y-2 text-sm text-slate-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {event.date}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {event.location}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        {event.attendees} attendees
                      </div>
                      <p className="text-xs">By {event.organizer}</p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>

      {/* Recommended Events Slideshow */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">Recommended for You</h3>
            <p className="text-slate-600">Based on your location in San Francisco, CA</p>
          </div>
          <Button
            variant="outline"
            onClick={() => onPageChange?.('events')}
            className="flex items-center"
          >
            View All <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        
        <Carousel className="w-full">
          <CarouselContent className="-ml-2 md:-ml-4">
            {recommendedEvents.map((event) => (
              <CarouselItem key={event.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="relative">
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-md text-sm font-semibold">
                      {event.price}
                    </div>
                    <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-md text-xs flex items-center">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      {event.rating}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-slate-900 mb-2">{event.title}</h4>
                    <div className="space-y-2 text-sm text-slate-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {event.date}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {event.location}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        {event.attendees} attendees
                      </div>
                      <p className="text-xs">By {event.organizer}</p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white mt-16 -mx-6 -mb-6 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-4 gradient-primary bg-clip-text text-transparent">
                EventPro
              </h4>
              <p className="text-slate-400">
                Your premier platform for event management and ticketing.
              </p>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Quick Links</h5>
              <ul className="space-y-2">
                {quickLinks.slice(0, 3).map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={link.action}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Services</h5>
              <ul className="space-y-2">
                {quickLinks.slice(3).map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={link.action}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Contact</h5>
              <ul className="space-y-2 text-slate-400">
                <li>support@eventpro.com</li>
                <li>+1 (555) 123-4567</li>
                <li>123 Event Street<br />San Francisco, CA 94102</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 EventPro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
