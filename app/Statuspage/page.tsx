"use client";
import { Service,Incident, IncidentStatus,ServiceStatus } from '@/types';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, ChevronDown } from 'lucide-react';

const StatusPagePreview = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [servicesRes, incidentsRes] = await Promise.all([
          fetch('/api/services'),
          fetch('/api/incidents')
        ]);

        if (!servicesRes.ok || !incidentsRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const servicesData = await servicesRes.json();
        const incidentsData = await incidentsRes.json();

        setServices(servicesData);
        setIncidents(incidentsData);
      } catch (error) {
        const errorMessage = (error as Error).message || "An unknown error occurred";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  // type ServiceStatus = 'operational' | 'degraded' | 'major';
  const getStatusColor = (status: ServiceStatus): string => {
    const colors = {
      'OPERATIONAL': 'bg-green-500',
      'DEGRADED': 'bg-yellow-500',
      'MAJOR': 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getStatusBadge = (status: ServiceStatus | IncidentStatus): string => {
    const colors= {
      'OPERATIONAL': 'bg-green-100 text-green-800',
      'DEGRADED': 'bg-yellow-100 text-yellow-800',
      'MAJOR': 'bg-red-100 text-red-800',
      'ONGOING': 'bg-red-100 text-red-800',
      'SCHEDULED' : 'bg-yellow-100 text-yellow-800',
      'RESOLVED' : 'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  const operationalCount = services.filter(service => service.status === 'OPERATIONAL').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold">StatusPage</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Bell className="w-5 h-5" />
              </button>
              <button className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100">
                <img
                  src="/api/placeholder/32/32"
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">System Status</h1>
          <p className="text-gray-600 mt-2">
            Current status of all systems and components
          </p>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Operational</p>
                  <p className="text-2xl font-bold">{operationalCount}/{services.length}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 bg-green-500 rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Incidents</p>
                  <p className="text-2xl font-bold">{incidents.length}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 bg-yellow-500 rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Services Monitored</p>
                  <p className="text-2xl font-bold">{services.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 bg-blue-500 rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Services Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {services.map(service => (
                <div key={service.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">{service.name}</h3>
                    {/* <p className="text-sm text-gray-500">{service.description}</p> */}
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(service.status)}`} />
                    <span className="text-sm font-medium capitalize">{service.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Incidents */}
        <Card>
          <CardHeader>
            <CardTitle>Active Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            {incidents.length > 0 ? (
              incidents.map(incident => (
                <div key={incident.id} className="border-l-4 border-yellow-500 bg-yellow-50 p-4 rounded-lg mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">{incident.title}</h3>
                      <p className="text-sm text-gray-500">{incident.createdAt.toString()}</p>
                    </div>
                    <Badge className={getStatusBadge(incident.status)}>
                      {incident.status}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {incident.updates.map((update, idx) => (
                      <div key={idx} className="text-sm">
                       - {update.content}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No active incidents at this time.</p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default StatusPagePreview;