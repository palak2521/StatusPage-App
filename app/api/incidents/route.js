// app/api/incidents/route.js
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const body = await request.json()
    console.log(body);
    // Create the incident and the initial update entry
    const incident = await prisma.incident.create({
      data: {
        title: body.title,
        status: body.status.toUpperCase(),
        service: body.service,
        updates: {
          create: [
            {
              content: body.updates[0]
            }
          ]
        }
      },
      include: {
        updates: true
      }
    });
    return NextResponse.json(incident)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
export async function GET() {
    try {
      const incidents = await prisma.incident.findMany({
        include: {
          updates: {
            orderBy: {
              createdAt: 'desc'  // Get latest updates first
            }
          }
        },
        orderBy: {
          createdAt: 'desc'  // Get newest incidents first
        }
      })
      console.log(incidents);
      // Transform the data to match your frontend format
      const formattedIncidents = incidents.map(incident => ({
        id: incident.id,
        title: incident.title,
        status: incident.status.toLowerCase(), // Frontend expects lowercase status
        service: incident.service,
        createdAt: incident.createdAt,
        updates: incident.updates.map(update => update.content)
      }))
      
      return NextResponse.json(formattedIncidents)
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }
