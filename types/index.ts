export enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN'
  }
  
  export enum ServiceStatus {
    OPERATIONAL = 'OPERATIONAL',
    DEGRADED = 'DEGRADED',
    MAJOR = 'MAJOR'
  }
  
  export enum IncidentStatus {
    ONGOING = 'ONGOING',
    SCHEDULED = 'SCHEDULED',
    RESOLVED = 'RESOLVED'
  }
  
  // Interface definitions
  export interface User {
    id: number;
    name: string | null;
    email: string;
    password: string;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
    services: Service[];
  }
  
  export interface Service {
    id: number;
    name: string;
    status: ServiceStatus;
    uptime: number;
    createdAt: Date;
    updatedAt: Date;
    userId: number;
    user?: User;
  }
  
  export interface Update {
    id: number;
    content: string;
    incidentId: number;
    createdAt: Date;
    incident?: Incident;
  }
  
  export interface Incident {
    id: number;
    title: string;
    status: IncidentStatus;
    service: string;
    createdAt: Date;
    updates: Update[];
  }