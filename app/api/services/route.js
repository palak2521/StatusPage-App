import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';  // Note the { prisma } destructuring
import { z } from 'zod';

// Define the schema for service data
const serviceSchema = z.object({
  name: z.string().min(1),
  status: z.enum(['OPERATIONAL', 'DEGRADED', 'OUTAGE']).default('OPERATIONAL'),
  uptime: z.number().min(0).max(100).default(100),
  userId: z.number()
});
export async function POST(req) {
    try {
      // Parse request body
      const json = await req.json();
      console.log('Received request body:', json); // Debug log
      
      // Validate the request body against our schema
      const validatedData = serviceSchema.parse(json);
      console.log('Validated data:', validatedData); // Debug log
      
      // Check if userId exists in the database first
      const user = await prisma.user.findUnique({
        where: {
          id: validatedData.userId
        }
      });
      
      if (!user) {
        return NextResponse.json({
          success: false,
          error: 'User not found'
        }, { status: 404 });
      }
      
      // Insert the validated service data into the database
      const newService = await prisma.service.create({
        data: {
          name: validatedData.name,
          status: validatedData.status,
          uptime: validatedData.uptime,
          userId: validatedData.userId,
        },
      });
      
      console.log('Created service:', newService); // Debug log
      
      return NextResponse.json({ 
        success: true, 
        data: newService 
      }, { status: 201 });
  
    } catch (error) {
      // Log the full error for debugging
      console.error('Full error details:', error);
      
      // Handle zod validation errors
      if (error instanceof z.ZodError) {
        return NextResponse.json({
          success: false,
          errors: error.errors
        }, { status: 400 });
      }
      
      // Handle Prisma errors
      if (error.code) {
        switch (error.code) {
          case 'P2002':
            return NextResponse.json({
              success: false,
              error: 'A service with this name already exists'
            }, { status: 409 });
          case 'P2003':
            return NextResponse.json({
              success: false,
              error: 'Foreign key constraint failed'
            }, { status: 400 });
          default:
            console.error('Prisma error:', error);
        }
      }
  
      // Handle other errors
      return NextResponse.json({
        success: false,
        error: 'Internal Server Error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }, { status: 500 });
    } finally {
      // Disconnect Prisma client to prevent connection leaks
      await prisma.$disconnect();
    }
  }
export async function GET() {
  try {
    // No need to manually connect in Next.js
    const services = await prisma.service.findMany();
    // console.log('Services fetched:', services);
    
    return NextResponse.json(services);
  } catch (error) {
    console.error('API Error:', {
      message: error.message,
      name: error.name,
      code: error.code,
      stack: error.stack,
    });

    return NextResponse.json(
      { 
        error: 'Error fetching services',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}