
import React, { useState } from 'react';
import { Calendar, Users, Ticket, Mail, Search, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface LayoutProps {
  children: React.ReactNode;
  currentPage?: string;
  onPageChange?: (page: string) => void;
}

const Layout = ({ children, currentPage = 'dashboard', onPageChange }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Calendar },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'attendees', label: 'Attendees', icon: Users },
    { id: 'tickets', label: 'Ticketing', icon: Ticket },
    { id: 'communications', label: 'Communications', icon: Mail },
  ];

  const quickLinks = [
    { label: 'Buy a ticket', href: '#buy-ticket' },
    { label: 'Events', href: '#events' },
    { label: 'Sell a ticket', href: '#sell-ticket' },
    { label: 'Buy/Sell a package', href: '#package' },
    { label: 'Find my ticket', href: '#find-ticket' },
    { label: 'Login/Signup', href: '#auth' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-6 border-b">
          <h1 className="text-xl font-bold gradient-primary bg-clip-text text-transparent">
            EventPro
          </h1>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onPageChange?.(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-slate-100 ${
                currentPage === item.id 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md' 
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-slate-50">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Relevant Links</h3>
          <div className="space-y-1">
            {quickLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block text-sm text-slate-600 hover:text-blue-600 transition-colors py-1"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search events, attendees, tickets..."
                  className="pl-10 w-96 bg-slate-50 border-slate-200"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                onClick={() => onPageChange?.('auth')}
                variant="outline"
                className="hidden sm:inline-flex"
              >
                Login / Signup
              </Button>
              <Button
                onClick={() => onPageChange?.('buy-ticket')}
                className="gradient-primary text-white border-0 hover:opacity-90"
              >
                Buy Ticket
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
