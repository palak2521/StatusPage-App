import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

// app/api/incidents/[id]/updates/route.js
export async function POST(request, { params }) {
    try {
      const { id } = params
      const body = await request.json()
      
      const update = await prisma.update.create({
        data: {
          content: body.content,
          incidentId: parseInt(id)
        }
      })
      
      return NextResponse.json(update)
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }
  