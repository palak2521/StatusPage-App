"use client";
import { Service,ServiceStatus } from '@/types';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AdminDashboard = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    OPERATIONAL: 0,
    DEGRADED: 0,
    MAJOR: 0
  });
  
   // New state for form handling
   const [isDialogOpen, setIsDialogOpen] = useState(false);
   const [formData, setFormData] = useState({
     name: '',
     description: '',
     status: 'OPERATIONAL',
     uptime: null as number | null, 
     userId: null as number | null, 
   });
   const [isSubmitting, setIsSubmitting] = useState(false);
   
  const router = useRouter();
  const { toast } = useToast();
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    console.log(userId);
    // Redirect to login page if userId is not found
    if (!userId) {
      router.push("/login");
    }
    else
    {
      const parsedUserId = parseInt(userId, 10);
      setFormData(prev => ({
        ...prev,
        userId: parsedUserId
      }));
    }
    
  }, [router]);
  // Updated status options to match your data
  const statusOptions = {
    OPERATIONAL: {
      label: "Operational",
      style: "bg-green-100 text-green-800",
      icon: CheckCircle
    },
    DEGRADED: {
      label: "Degraded Performance",
      style: "bg-yellow-100 text-yellow-800",
      icon: AlertTriangle
    },
    MAJOR: {
      label: "Major Outage",
      style: "bg-red-100 text-red-800",
      icon: XCircle
    }
  };
  
    // Form handlers
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };
  
    const handleStatusChange = (value: ServiceStatus) => {
      setFormData(prev => ({
        ...prev,
        status: value
      }));
    };
  
    const resetForm = () => {
      const currentUserId = formData.userId;
      setFormData({
        name: '',
        description: '',
        status: 'OPERATIONAL',
        uptime:100.00,
        userId: currentUserId, 
      });
    };
    
    const handleNewService = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmitting(true);
  
      try {
        const response = await fetch('/api/services', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
  
        if (!response.ok) {
          throw new Error('Failed to create service');
        }
  
        const newService = await response.json();
        console.log(newService.data);
        // Update services with the new service
        setServices((prev) => {
          // Create a new array including the new service
          const updatedServices = [...prev, newService.data];
          console.log(updateServiceStatus)
          // Update stats with the new services array
          updateStats(updatedServices);

          return updatedServices; // Return the updated services array
        });
        
        toast({
          title: "Success",
          description: "Service created successfully",
        });
        
        setIsDialogOpen(false);
        resetForm();
      } catch (error) {
        console.error('Error creating service:', error);
        toast({
          title: "Error",
          description: "Failed to create service. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    };
    
  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await fetchServices();
        console.log(data);
        setServices(data);
        updateStats(data);
      } catch (error) {
        console.error('Error loading services:', error);
      }
    };

    loadServices();
  }, []);


  async function fetchServices() {
    try {
      const response = await fetch('/api/services');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
  }

  const updateStats = (serviceData: Service[]) => {
    const stats = serviceData.reduce((acc, service) => ({
      ...acc,
      total: acc.total + 1,
      [service.status]: (acc[service.status] || 0) + 1
    }), { total: 0, OPERATIONAL: 0, DEGRADED: 0, MAJOR: 0 });
    
    setStats(stats);
  };

  const updateServiceStatus = async (serviceId: number, newStatus: Service['status']) => {
    try {
      const response = await fetch(`/api/services/${serviceId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedServices = services.map(service => 
          service.id === serviceId ? { ...service, status: newStatus } : service
        );
        setServices(updatedServices);
        updateStats(updatedServices);
      }
    } catch (error) {
      console.error('Error updating service status:', error);
    }
  };

  const handleIncidentClick = () => {
    router.push('/admin/incidents');
  };
  const handleTeamsClick = () => {
    router.push('/admin/teams');
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar - remains the same */}
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
          <a className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 cursor-pointer" onClick={handleTeamsClick}>
            <Users className="w-5 h-5 mr-3" />
            Team Management
          </a>
          <a className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 cursor-pointer">
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
          <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Service
            </Button>
           
          </div>
        </div>
        {/* Service Entry Form Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
  <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle>Add New Service</DialogTitle>
    </DialogHeader>
    <form onSubmit={handleNewService} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Service Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Enter service name"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="status">Initial Status</Label>
        <Select
          value={formData.status}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent className="bg-white ">
            {Object.entries(statusOptions).map(([value, { label }]) => (
              <SelectItem className="cursor-pointer" key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="uptime">Uptime (%)</Label>
        <Input
          id="uptime"
          name="uptime"
          type="number"
          step="0.01"
          value={formData.uptime?? ''}
          onChange={(e) =>
            setFormData({ ...formData, uptime: e.target.value ? parseFloat(e.target.value) : null })
          }
          placeholder="Enter uptime as a percentage"
          required
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setIsDialogOpen(false);
            resetForm();
          }}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Service'}
        </Button>
      </div>
    </form>
  </DialogContent>
</Dialog>

        {/* Status Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Services</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
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
                  <p className="text-2xl font-bold">{stats.OPERATIONAL}</p>
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
                  <p className="text-2xl font-bold">{stats.DEGRADED}</p>
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
                  <p className="text-2xl font-bold">{stats.MAJOR}</p>
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
                    <th className="text-left py-3 px-4">Last Updated</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map(service => (
                    <tr key={service.id} className="border-b">
                      <td className="py-3 px-4">{service.name}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusOptions[service.status].style}`}>
                          {statusOptions[service.status].label}
                        </span>
                      </td>
                      <td className="py-3 px-4">{service.uptime}%</td>
                      <td className="py-3 px-4">
                        {new Date(service.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-white">
                            {Object.entries(statusOptions).map(([status, { label }]) => (
                              <DropdownMenuItem className="cursor-pointer"
                                key={status}
                                onClick={() => updateServiceStatus(service.id, status as Service['status'])}
                              >
                                Set as {label}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
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