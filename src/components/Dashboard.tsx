import React, { useEffect, useState } from 'react';
import { Calendar, Search, MapPin, Star, ChevronRight, DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useDebounce } from '@/hooks/useDebounce';

interface EventbriteEvent {
  id: string;
  name: {
    text: string;
  };
  description: {
    text: string;
  } | string;
  start: {
    local: string;
  };
  end: {
    local: string;
  };
  logo: {
    url: string;
  };
  venue: {
    name: string;
    address: {
      city: string;
      region: string;
    };
  };
  ticket_availability: {
    is_sold_out: boolean;
  };
  url: string;
  // Additional properties for static data
  title?: string;
  date?: string;
  location?: string;
  price?: string;
  image?: string;
  organizer?: string;
  attendees?: number;
  rating?: number;
}

interface DashboardProps {
  onPageChange?: (page: string) => void;
}

const Dashboard = ({ onPageChange }: DashboardProps) => {
  // State for events
  const [schoolEvents, setSchoolEvents] = useState<EventbriteEvent[]>([]);
  const [otherEvents, setOtherEvents] = useState<EventbriteEvent[]>([]);
  const [recommendedEvents, setRecommendedEvents] = useState<EventbriteEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // State for search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<EventbriteEvent[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Example: use browser location or fallback
  const userLocation = 'San Francisco, CA';

  // Fetch initial events
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const [schoolRes, otherRes, recommendedRes] = await Promise.all([
          fetch('/api/search_events.php?q=school education'),
          fetch('/api/search_events.php'),
          fetch(`/api/search_events.php?location=${encodeURIComponent(userLocation)}`)
        ]);

        const [schoolData, otherData, recommendedData] = await Promise.all([
          schoolRes.json(),
          otherRes.json(),
          recommendedRes.json()
        ]);

        setSchoolEvents(schoolData.events || []);
        setOtherEvents(otherData.events || []);
        setRecommendedEvents(recommendedData.events || []);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Search effect
  useEffect(() => {
    const searchEvents = async () => {
      if (!debouncedSearchQuery) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetch(`/api/search_events.php?q=${encodeURIComponent(debouncedSearchQuery)}`);
        const data = await response.json();
        setSearchResults(data.events || []);
      } catch (error) {
        console.error('Error searching events:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    searchEvents();
  }, [debouncedSearchQuery]);

  return (
    <div className="space-y-8">
      {/* Cover Photo Section */}
      <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
        <img 
          src="/images/school-event-cover.jpg" 
          alt="School Event Registration"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-12 left-12 text-white max-w-2xl">
          <h1 className="text-6xl font-bold mb-6 leading-tight">Welcome to School Event Registration</h1>
          <p className="text-2xl mb-8 text-gray-200">Discover and register for exciting school events, workshops, and activities in your area.</p>
          <div className="flex gap-6">
            <Button 
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg"
              onClick={() => onPageChange?.('create-event')}
            >
              Create Event
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-6 text-lg"
              onClick={() => onPageChange?.('events')}
            >
              Browse Events
            </Button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-3xl mx-auto -mt-8 relative z-10">
        <div className="relative">
          <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
          <Input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-16 pr-6 py-8 text-lg rounded-2xl bg-white shadow-xl border-0"
          />
        </div>
        
        {/* Search Results Dropdown */}
        {isSearching && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl z-50">
            <div className="p-4 text-center text-gray-500">Searching...</div>
          </div>
        )}
        
        {!isSearching && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto">
            {searchResults.map((event) => (
              <div
                key={event.id}
                className="p-4 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                onClick={() => window.open(event.url, '_blank')}
              >
                <h3 className="font-semibold text-gray-900">{event.name?.text || event.title}</h3>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <Calendar className="h-4 w-4 mr-1" />
                  {event.start?.local ? new Date(event.start.local).toLocaleDateString() : event.date}
                </div>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  {event.venue?.address?.city || event.location || 'N/A'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommended Events Section */}
      <section className="mt-16">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-slate-900">Recommended for You</h2>
          <p className="text-lg text-slate-600 mt-2">Based on your location in {userLocation}</p>
        </div>
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <Carousel className="w-full">
            <CarouselContent className="-ml-4">
              {recommendedEvents.map((event) => (
                <CarouselItem key={event.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border-0">
                    <div className="relative group">
                      <img 
                        src={event.logo?.url || event.image || '/default-event.jpg'} 
                        alt={event.name?.text || event.title || 'Event'}
                        className="w-full h-64 object-cover rounded-t-xl transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-xl" />
                    </div>
                    <CardContent className="p-6">
                      <h4 className="text-xl font-semibold text-slate-900 mb-3 line-clamp-2">{event.name?.text || event.title}</h4>
                      <div className="space-y-3 text-sm text-slate-600">
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                          {event.start?.local ? new Date(event.start.local).toLocaleDateString() : event.date}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                          {event.venue?.address?.city || event.location || 'N/A'}
                        </div>
                        {event.price && (
                          <div className="flex items-center">
                            <DollarSign className="h-5 w-5 mr-2 text-blue-600" />
                            {event.price}
                          </div>
                        )}
                        {event.rating && (
                          <div className="flex items-center">
                            <Star className="h-5 w-5 mr-2 text-yellow-400" />
                            {event.rating}
                          </div>
                        )}
                      </div>
                      <Button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white" asChild>
                        <a href={event.url} target="_blank" rel="noopener noreferrer">View Event</a>
                      </Button>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        )}
      </section>

      {/* Other Events Section */}
      <section className="mt-16">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-slate-900">Other Events</h2>
          <p className="text-lg text-slate-600 mt-2">Discover more events in your area</p>
        </div>
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <Carousel className="w-full">
            <CarouselContent className="-ml-4">
              {otherEvents.map((event) => (
                <CarouselItem key={event.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border-0">
                    <div className="relative group">
                      <img 
                        src={event.logo?.url || event.image || '/default-event.jpg'} 
                        alt={event.name?.text || event.title || 'Event'}
                        className="w-full h-64 object-cover rounded-t-xl transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-xl" />
                    </div>
                    <CardContent className="p-6">
                      <h4 className="text-xl font-semibold text-slate-900 mb-3 line-clamp-2">{event.name?.text || event.title}</h4>
                      <div className="space-y-3 text-sm text-slate-600">
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                          {event.start?.local ? new Date(event.start.local).toLocaleDateString() : event.date}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                          {event.venue?.address?.city || event.location || 'N/A'}
                        </div>
                        {event.price && (
                          <div className="flex items-center">
                            <DollarSign className="h-5 w-5 mr-2 text-blue-600" />
                            {event.price}
                          </div>
                        )}
                      </div>
                      <Button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white" asChild>
                        <a href={event.url} target="_blank" rel="noopener noreferrer">View Event</a>
                      </Button>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
