'use client'

import { useState, useEffect } from 'react'
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AlertCircle, BarChart, Bell, CheckCircle2, Clock, Settings, Users, Plus, AlertTriangle } from 'lucide-react'

// Mock data and functions (replace with actual API calls)
const mockIncidents = [
  { id: 1, title: 'Server Outage', status: 'ongoing', service: 'API', updates: ['Initial outage reported'] },
  { id: 2, title: 'Database Maintenance', status: 'scheduled', service: 'Database', updates: ['Scheduled for tonight'] },
]

const mockServices = ['API', 'Website', 'Database', 'Authentication']

const createIncident = async (incident) => {
  try {
    const response = await fetch('/api/incidents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(incident),
    })
    
    if (!response.ok) {
      throw new Error('Failed to create incident')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error creating incident:', error)
    // You might want to show an error notification here
  }
}
const addUpdate = async (id, content) => {
  try {
    const response = await fetch(`/api/incidents/${id}/updates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    })
    
    if (!response.ok) {
      throw new Error('Failed to add update')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error adding update:', error)
    // You might want to show an error notification here
  }
}

const updateIncidentStatus = async (id, status) => {
  try {
    const response = await fetch(`/api/incidents/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    })
    
    if (!response.ok) {
      throw new Error('Failed to update incident status')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error updating incident status:', error)
    // You might want to show an error notification here
  }
}

export default function IncidentManagement() {
  const [incidents, setIncidents] = useState(mockIncidents)
  const [showForm, setShowForm] = useState(false)
  const [selectedIncident, setSelectedIncident] = useState(null)
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter()
  useEffect(() => {
    setIsLoading(true);
    const fetchIncidents = async () => {
      try {
        const response = await fetch('/api/incidents')
        console.log(response)
        if (!response.ok) {
          throw new Error('Failed to fetch incidents')
        }
        const data = await response.json()
        setIncidents(data)
      } catch (error) {
        console.error('Error fetching incidents:', error)
      }
      finally {
        setIsLoading(false);
      }
    }
  
    fetchIncidents()
  }, [])
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
  }
    const ws = new WebSocket('ws://localhost:8080');

    ws.onopen = () => {
        console.log('Connected to WebSocket server');
    };

    ws.onmessage = (event) => {
      console.log("Message received:", event.data);
        const updatedIncident = JSON.parse(event.data);
        console.log(updatedIncident.title);
        const title = updatedIncident.title || 'No Title';
        const status = updatedIncident.status || 'No Status';
    
        // Generate an alert with the title and status
        alert(`Incident Updated:\nTitle: ${title}\nStatus: ${status}`);
      setIncidents((prevIncidents) =>
        prevIncidents.map(incident =>
          incident.id === updatedIncident.id 
            ? { 
                ...incident, 
                ...updatedIncident,
                updates: updatedIncident.updates.map(update => 
                  typeof update === 'string' ? update : update.content
                )
              } 
            : incident
        )
      );
    };

    ws.onclose = () => {
        console.log('Disconnected from WebSocket server');
    };

    return () => ws.close();
}, []);
if (isLoading) {
  return <div className="flex justify-center items-center h-screen">Loading...</div>;
}
  const handleCreateIncident = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const newIncident = {
      id: incidents.length + 1,
      title: formData.get('title'),
      status: formData.get('type') === 'incident' ? 'ongoing' : 'scheduled',
      service: formData.get('service'),
      updates: [formData.get('description')],
    }
    const createdIncident = await createIncident(newIncident)
    if (createdIncident) {
      setIncidents([...incidents, {
        ...createdIncident,
        updates: createdIncident.updates.map(update => 
          typeof update === 'string' ? update : update.content
        )
      }])
      setShowForm(false)
  }
  }

  const handleAddUpdate = async (id, updateContent) => {
    const addedUpdate = await addUpdate(id, updateContent)
    if (addedUpdate) {
      setIncidents(prevIncidents => prevIncidents.map(incident => {
        if (incident.id === id) {
          return {
            ...incident,
            updates: [
              ...incident.updates, 
              typeof addedUpdate === 'string' ? addedUpdate : addedUpdate.content
            ]
          }
        }
        return incident
      }))
    }
  }

  const handleStatusChange = async (id, newStatus) => {
    const updatedIncident = await updateIncidentStatus(id, newStatus)
    console.log(updatedIncident)
    if (updatedIncident) {
      setIncidents(incidents.map(incident => 
        incident.id === id 
          ? {
              ...updatedIncident,
              updates: updatedIncident.updates.map(update => 
                typeof update === 'string' ? update : update.content
              )
            } 
          : incident
      ))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white border-r">
        <div className="p-6">
          <h1 className="text-xl font-bold">StatusPage</h1>
        </div>
        <nav className="mt-6">
          <a className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 cursor-pointer" onClick={() => router.push('/admin')}>
            <BarChart className="w-5 h-5 mr-3" />
            Overview
          </a>
          <a className="flex items-center px-6 py-3 text-gray-900 bg-gray-100 cursor-pointer" >
            <Bell className="w-5 h-5 mr-3" />
            Incidents
          </a>
          <a className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 cursor-pointer" onClick={() => router.push('/admin/teams')}>
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
      <div className="ml-64 flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Incident/Maintenance Management</h1>
            <p className="text-gray-600">Manage and update incidents and scheduled maintenances</p>
          </div>
          <Button variant="outline" onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Report Incident
            </Button>
        </div>
        
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Report Incident/Maintenance</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateIncident}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" name="title" placeholder="Enter incident/maintenance title" required />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="type">Type</Label>
                    <Select name="type" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="incident">Incident</SelectItem>
                        <SelectItem value="maintenance">Scheduled Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="service">Affected Service</Label>
                    <Select name="service" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select service" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {mockServices.map(service => (
                          <SelectItem className="cursor-pointer" key={service} value={service}>{service}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" name="description" placeholder="Describe the incident or maintenance" required />
                  </div>
                </div>
                <CardFooter className="flex justify-between mt-4">
                  <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                  <Button type="submit">Submit</Button>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {incidents.map(incident => (
            <Card key={incident.id}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  {incident.status.toUpperCase() === 'ONGOING' ? (
                    <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                  ) : incident.status.toUpperCase() === 'SCHEDULED' ? (
                    <Clock className="w-5 h-5 text-yellow-500 mr-2" />
                  ) : incident.status.toUpperCase() === 'RESOLVED' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-orange-500 mr-2" />
                  )}
                  {incident.title}
                </CardTitle>
                <CardDescription>Status: {incident.status.toUpperCase()} | Service: {incident.service}</CardDescription>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold mb-2">Updates:</h3>
                <ul className="list-disc pl-5 mb-4">
                  {incident.updates.map((update, index) => (
                    <li key={index}>{update}</li>
                  ))}
                </ul>
                {incident.status.toUpperCase()!== 'RESOLVED' && (
                  <form onSubmit={(e) => {
                    e.preventDefault()
                    const update = e.target.update.value
                    handleAddUpdate(incident.id, update)
                    e.target.reset()
                  }}>
                    <div className="flex items-center space-x-2">
                      <Input name="update" placeholder="Add an update" required />
                      <Button type="submit">Add Update</Button>
                    </div>
                  </form>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Select
                  value={incident.status.toUpperCase()}
                  onValueChange={(newStatus) => handleStatusChange(incident.id, newStatus)}
                >
                  <SelectTrigger className="w-[180px]">
                  <SelectValue>{incident.status.toUpperCase()}</SelectValue>
                   
                  </SelectTrigger>
                  
                  <SelectContent className="bg-popover/95 supports-[backdrop-filter]:bg-popover/100 bg-white">
                    <SelectItem className="cursor-pointer" value="ONGOING">Ongoing</SelectItem>
                    <SelectItem className="cursor-pointer" value="SCHEDULED">Scheduled</SelectItem>
                    <SelectItem  className="cursor-pointer" value="RESOLVED">Resolved</SelectItem>
                  </SelectContent>
                </Select>
                {incident.status.toUpperCase() !== 'RESOLVED' && (
                  <Button onClick={() => handleStatusChange(incident.id, 'RESOLVED')}>
                    Resolve Incident
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}