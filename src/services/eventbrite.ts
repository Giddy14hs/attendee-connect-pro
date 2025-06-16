import axios from 'axios';

const EVENTBRITE_API_URL = 'https://www.eventbriteapi.com/v3';
const EVENTBRITE_TOKEN = process.env.NEXT_PUBLIC_EVENTBRITE_TOKEN;

const eventbriteApi = axios.create({
  baseURL: EVENTBRITE_API_URL,
  headers: {
    'Authorization': `Bearer ${EVENTBRITE_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

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

export const getEvents = async (location?: string) => {
  try {
    const params: any = {
      'expand': 'venue',
      'sort_by': 'date',
    };

    if (location) {
      params['location.address'] = location;
    }

    const response = await eventbriteApi.get('/events/search', { params });
    return response.data.events as EventbriteEvent[];
  } catch (error) {
    console.error('Error fetching events from Eventbrite:', error);
    return [];
  }
};

export const getSchoolEvents = async () => {
  try {
    const params = {
      'expand': 'venue',
      'sort_by': 'date',
      'q': 'school education',
    };

    const response = await eventbriteApi.get('/events/search', { params });
    return response.data.events as EventbriteEvent[];
  } catch (error) {
    console.error('Error fetching school events from Eventbrite:', error);
    return [];
  }
};

export const getRecommendedEvents = async (location: string) => {
  try {
    const params = {
      'expand': 'venue',
      'sort_by': 'date',
      'location.address': location,
    };

    const response = await eventbriteApi.get('/events/search', { params });
    return response.data.events as EventbriteEvent[];
  } catch (error) {
    console.error('Error fetching recommended events from Eventbrite:', error);
    return [];
  }
}; 