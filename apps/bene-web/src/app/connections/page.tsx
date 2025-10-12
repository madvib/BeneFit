'use client'

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface ServiceConnection {
  id: number;
  name: string;
  description: string;
  connected: boolean;
  logo: string;
  lastSync?: string;
  dataType: string[];
}

export default function ConnectionsPage() {
  // Mock data for API/device connections
  const services: ServiceConnection[] = [
    {
      id: 1,
      name: 'Apple Health',
      description: 'Sync your health and fitness data from Apple devices',
      connected: true,
      logo: '/connection_logos/icons8-apple-fitness-48.png',
      lastSync: 'Just now',
      dataType: ['Steps', 'Heart Rate', 'Sleep', 'Workouts']
    },
    {
      id: 2,
      name: 'Strava',
      description: 'Connect your Strava account to import activities',
      connected: true,
      logo: '/connection_logos/strava-svgrepo-com.svg',
      lastSync: '2 hours ago',
      dataType: ['Running', 'Cycling', 'Swimming']
    },
    {
      id: 3,
      name: 'Google Fit',
      description: 'Import fitness data from Google Fit',
      connected: false,
      logo: '/connection_logos/google-fit-svgrepo-com.svg',
      dataType: ['Steps', 'Heart Rate', 'Workouts', 'Weight']
    },
    {
      id: 4,
      name: 'Fitbit',
      description: 'Connect your Fitbit to sync health data',
      connected: false,
      logo: 'https://logos-world.net/wp-content/uploads/2021/02/Fitbit-Logo.png',
      dataType: ['Steps', 'Sleep', 'Heart Rate', 'Calories']
    },
    {
      id: 5,
      name: 'WHOOP',
      description: 'Connect your WHOOP strap for recovery insights',
      connected: false,
      logo: 'https://logos-world.net/wp-content/uploads/2022/11/WHOOP-Logo.png',
      dataType: ['Recovery', 'Strain', 'Sleep', 'Workouts']
    }
  ];

  const handleConnect = (id: number) => {
    // In a real app, this would initiate OAuth flow
    console.log(`Connecting to service with id: ${id}`);
    alert(`Connecting to service ${services.find(s => s.id === id)?.name}`);
  };

  const handleDisconnect = (id: number) => {
    // In a real app, this would disconnect the service
    console.log(`Disconnecting service with id: ${id}`);
    alert(`Disconnected from ${services.find(s => s.id === id)?.name}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} />

      <main className="flex-grow container mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold">Service Connections</h2>
          <div className="text-sm text-muted-foreground">
            {services.filter(s => s.connected).length} of {services.length} services connected
          </div>
        </div>
        
        <div className="bg-secondary p-6 rounded-lg shadow-md">
          <div className="mb-6">
            <h3 className="text-2xl font-semibold mb-4">Connected Services</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services
                .filter(service => service.connected)
                .map((service) => (
                  <div key={service.id} className="bg-background p-6 rounded-lg shadow-sm border border-muted">
                    <div className="flex items-center mb-4">
                      <div className="bg-white dark:bg-gray-800 p-2 rounded-lg mr-4">
                        <img 
                          src={service.logo} 
                          alt={service.name} 
                          className="w-10 h-10 object-contain"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold">{service.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {service.lastSync ? `Last sync: ${service.lastSync}` : 'Connected'}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                    
                    <div className="mb-4">
                      <h5 className="text-sm font-medium mb-2">Data Synced:</h5>
                      <div className="flex flex-wrap gap-2">
                        {service.dataType.map((type, idx) => (
                          <span 
                            key={idx} 
                            className="text-xs bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 px-2 py-1 rounded"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleDisconnect(service.id)}
                      className="w-full btn btn-ghost text-red-600 hover:text-red-700 dark:hover:text-red-400"
                    >
                      Disconnect
                    </button>
                  </div>
                ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-2xl font-semibold mb-4">Available Services</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services
                .filter(service => !service.connected)
                .map((service) => (
                  <div key={service.id} className="bg-background p-6 rounded-lg shadow-sm border border-muted">
                    <div className="flex items-center mb-4">
                      <div className="bg-white dark:bg-gray-800 p-2 rounded-lg mr-4">
                        <img 
                          src={service.logo} 
                          alt={service.name} 
                          className="w-10 h-10 object-contain"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold">{service.name}</h4>
                        <p className="text-sm text-muted-foreground">Not connected</p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                    
                    <div className="mb-4">
                      <h5 className="text-sm font-medium mb-2">Data Available:</h5>
                      <div className="flex flex-wrap gap-2">
                        {service.dataType.map((type, idx) => (
                          <span 
                            key={idx} 
                            className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleConnect(service.id)}
                      className="w-full btn btn-primary"
                    >
                      Connect
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}