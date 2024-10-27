"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from "next/navigation";
import { 
  BarChart, 
  Bell, 
  Settings, 
  Users, 
  Plus,
  MoreVertical,
  CheckCircle,
  AlertTriangle,
  XCircle
} from 'lucide-react';

const AdminDashboard = () => {
  const services = [
    { id: 1, name: 'API Service', status: 'operational', uptime: '99.99%' },
    { id: 2, name: 'Web Dashboard', status: 'degraded', uptime: '99.85%' },
    { id: 3, name: 'Database', status: 'operational', uptime: '99.99%' },
    { id: 4, name: 'Authentication', status: 'operational', uptime: '99.95%' },
    { id: 5, name: 'File Storage', status: 'major', uptime: '98.75%' }
  ];
  const [activeTab, setActiveTab] = useState('overview'); // State to manage active tab
  const router = useRouter();
  const handleIncidentClick = () => {
    // This will navigate to /incident when the link is clicked
    router.push('/admin/incidents');
  };
  const handleTabClick = (tab) => {
    setActiveTab(tab); // Change the active tab when clicked
  };
  const getStatusStyle = (status) => {
    switch (status) {
      case 'operational':
        return 'bg-green-100 text-green-800';
      case 'degraded':
        return 'bg-yellow-100 text-yellow-800';
      case 'major':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white border-r">
        <div className="p-6">
          <h1 className="text-xl font-bold">StatusPage</h1>
        </div>
        <nav className="mt-6">
          <a className="flex items-center px-6 py-3 text-gray-900 bg-gray-100">
            <BarChart className="w-5 h-5 mr-3" />
            Overview
          </a>
          <a className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 cursor-pointer"  onClick={handleIncidentClick}>
            <Bell className="w-5 h-5 mr-3" />
            Incidents
          </a>
          <a className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50">
            <Users className="w-5 h-5 mr-3" />
            Team
          </a>
          <a className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50">
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-gray-600">Monitor and manage your services</p>
          </div>
          <div className="flex space-x-4">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Service
            </Button>
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Report Incident
            </Button>
          </div>
        </div>

        {/* Status Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Services</p>
                  <p className="text-2xl font-bold">5</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <BarChart className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Operational</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Degraded</p>
                  <p className="text-2xl font-bold">1</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Major Issues</p>
                  <p className="text-2xl font-bold">1</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Services Table */}
        <Card>
          <CardHeader>
            <CardTitle>Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Service</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Uptime</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map(service => (
                    <tr key={service.id} className="border-b">
                      <td className="py-3 px-4">{service.name}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(service.status)}`}>
                          {service.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">{service.uptime}</td>
                      <td className="py-3 px-4">
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;