import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()
  // app/api/incidents/[id]/route.js
  export async function PATCH(request, { params }) {
    try {
      const { id } = params
      const body = await request.json()
        console.log(id);
        console.log(body.status.toUpperCase());
      const incident = await prisma.incident.update({
        where: { id :  parseInt(id)},
        data: {
          status: body.status.toUpperCase(),
        },
        include: {
          updates:{
          select: {
            content: true
          }
        }

        }
      })
      console.log(incident)
      return NextResponse.json(incident)
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }