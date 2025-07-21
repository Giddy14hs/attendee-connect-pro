import axios from 'axios';
import { oauthService } from './oauth';

const EVENTBRITE_API_URL = 'https://www.eventbriteapi.com/v3';
const EVENTBRITE_PUBLIC_TOKEN = import.meta.env.VITE_EVENTBRITE_PUBLIC_TOKEN || 'VVLPCDH5LEAEESMSJWXM';

// Helper to get an authenticated axios instance with the OAuth token
const getAuthenticatedApi = async () => {
  const token = await oauthService.getToken();
  if (!token) throw new Error('No OAuth token available');
  return axios.create({
    baseURL: EVENTBRITE_API_URL,
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};

// Helper to get a public axios instance with the public token
const getPublicApi = () => {
  return axios.create({
    baseURL: EVENTBRITE_API_URL,
    headers: {
      'Authorization': `Bearer ${EVENTBRITE_PUBLIC_TOKEN}`,
    },
  });
};

// Fetch public events using the public token
export const getPublicEvents = async (params = {}) => {
  const api = getPublicApi();
  const response = await api.get('/events/search/', { params });
  return response.data.events;
};

export interface EventbriteEvent {
  id: string;
  name: {
    text: string;
  };
  description: {
    text: string;
  };
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
}

// Fallback data for when Eventbrite API is not available
const fallbackEvents: EventbriteEvent[] = [
  {
    id: '1',
    name: { text: 'Tech Conference 2024' },
    description: { text: 'Annual technology conference featuring the latest in AI and web development' },
    start: { local: '2024-12-15T09:00:00' },
    end: { local: '2024-12-15T18:00:00' },
    logo: { url: 'https://via.placeholder.com/300x200/3B82F6/FFFFFF?text=Tech+Conference' },
    venue: { name: 'Convention Center', address: { city: 'San Francisco', region: 'CA' } },
    ticket_availability: { is_sold_out: false },
    url: '#'
  },
  {
    id: '2',
    name: { text: 'Music Festival' },
    description: { text: 'Three-day outdoor music festival with top artists' },
    start: { local: '2024-12-20T14:00:00' },
    end: { local: '2024-12-22T23:00:00' },
    logo: { url: 'https://via.placeholder.com/300x200/8B5CF6/FFFFFF?text=Music+Festival' },
    venue: { name: 'Golden Gate Park', address: { city: 'San Francisco', region: 'CA' } },
    ticket_availability: { is_sold_out: false },
    url: '#'
  },
  {
    id: '3',
    name: { text: 'Business Summit' },
    description: { text: 'Strategic business planning and networking event' },
    start: { local: '2025-01-05T10:00:00' },
    end: { local: '2025-01-05T17:00:00' },
    logo: { url: 'https://via.placeholder.com/300x200/10B981/FFFFFF?text=Business+Summit' },
    venue: { name: 'Hilton Hotel', address: { city: 'San Francisco', region: 'CA' } },
    ticket_availability: { is_sold_out: false },
    url: '#'
  }
];

// Cache for organization ID
let cachedOrgId: string | null = null;

export const testApiConnection = async () => {
  try {
    console.log('Testing public Eventbrite API connection...');
    const api = getPublicApi();
    const eventsResponse = await api.get('/events/search/', {
      params: {
        'q': 'education',
        'location.latitude': -1.286389,
        'location.longitude': 36.817223,
        'location.within': '10km',
        'expand': 'venue',
        'sort_by': 'date'
      }
    });
    console.log('Public events:', eventsResponse.data);
    return {
      events: eventsResponse.data
    };
  } catch (error) {
    console.error('API connection test failed:', error);
    throw error;
  }
};

// Function to fetch organization ID
export const getOrganizationId = async (): Promise<string | null> => {
  if (cachedOrgId) return cachedOrgId;
  try {
    const api = await getAuthenticatedApi();
    const response = await api.get('/users/me/organizations/');
    if (response.data.organizations && response.data.organizations.length > 0) {
      cachedOrgId = response.data.organizations[0].id;
      return cachedOrgId;
    }
    return null;
  } catch (error) {
    return null;
  }
};

// Function to fetch events from organization or public events
export const getOrganizationEvents = async (): Promise<EventbriteEvent[]> => {
  const orgId = await getOrganizationId();
  if (!orgId) {

    try {
      // const api = await getAuthenticatedApi();
      const api = getPublicApi();
      const response = await api.get('/events/search/', {
        params: {
          q : 'keyword',             // broad keywords
          expand: 'venue',                             // include venue info
          sort_by: 'date',                             // sort chronologically
          'location.latitude': -1.286389,              // Nairobi example
          'location.longitude': 36.817223,
          'location.within': '50km',                   // wider radius = more results
          'start_date.range_start': new Date().toISOString()  // only future events
        }
      });
      if (response.data.events && response.data.events.length > 0) {
        return response.data.events as EventbriteEvent[];
      }
    } catch (error) {
      console.error('Error fetching public events:', error);
    }
    return fallbackEvents;
  }
  try {
    const api = await getAuthenticatedApi();
    const response = await api.get(`/organizations/${orgId}/events/`, {
      params: {
        'expand': 'venue',
        'status': 'live',
        'order_by': 'start_date.asc'
      }
    });
    return response.data.events as EventbriteEvent[];
  } catch (error) {
    console.error('Error fetching organization events:', error);
    return fallbackEvents;
  }
};

export const getEvents = async (location?: string) => {
  console.log('getEvents called with location:', location);
  
  try {
    // Use organization events directly with private token
    return await getOrganizationEvents();
  } catch (error) {
    console.error('Error in getEvents:', error);
    return fallbackEvents;
  }
};

export const getSchoolEvents = async () => {
  try {
    // Get all organization events and filter for education-related ones
    const allEvents = await getOrganizationEvents();
    return allEvents.filter(event => 
      event.name.text.toLowerCase().includes('school') || 
      event.name.text.toLowerCase().includes('education') ||
      event.name.text.toLowerCase().includes('academic') ||
      event.name.text.toLowerCase().includes('learning')
    );
  } catch (error) {
    console.error('Error fetching school events:', error);
    return fallbackEvents.filter(event => 
      event.name.text.toLowerCase().includes('school') || 
      event.name.text.toLowerCase().includes('education')
    );
  }
};

export const getRecommendedEvents = async (location: string) => {
  console.log('Requested location:', location);

  try {
    // Get all organization events and return them as recommended
    const allEvents = await getOrganizationEvents();
    
    // For now, return all events as recommended
    // You could add logic here to filter by location or other criteria
    return allEvents;
  } catch (error) {
    console.error('Error fetching recommended events:', error);
    return fallbackEvents;
  }
}; 

// Fetch events from our PHP backend (private token, no login required)
export const getBackendEvents = async () => {
  const response = await fetch('http://localhost:8000/api/eventbrite_fetch.php', { credentials: 'include' });
  if (!response.ok) throw new Error('Failed to fetch events from backend');
  const data = await response.json();
  // Eventbrite API returns events in data.events
  return data.events || [];
}; 