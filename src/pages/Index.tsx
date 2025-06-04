
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import Dashboard from '@/components/Dashboard';
import Events from '@/components/Events';
import CreateEvent from '@/components/CreateEvent';
import Attendees from '@/components/Attendees';
import Ticketing from '@/components/Ticketing';
import Communications from '@/components/Communications';
import Auth from '@/components/Auth';
import BuyTicket from '@/components/BuyTicket';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onPageChange={setCurrentPage} />;
      case 'events':
        return <Events onPageChange={setCurrentPage} />;
      case 'create-event':
        return <CreateEvent onPageChange={setCurrentPage} />;
      case 'attendees':
        return <Attendees onPageChange={setCurrentPage} />;
      case 'tickets':
        return <Ticketing onPageChange={setCurrentPage} />;
      case 'communications':
        return <Communications onPageChange={setCurrentPage} />;
      case 'auth':
        return <Auth onPageChange={setCurrentPage} />;
      case 'buy-ticket':
        return <BuyTicket onPageChange={setCurrentPage} />;
      default:
        return <Dashboard onPageChange={setCurrentPage} />;
    }
  };

  // For auth and buy-ticket pages, render without the main layout
  if (currentPage === 'auth' || currentPage === 'buy-ticket') {
    return renderPage();
  }

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
};

export default Index;
