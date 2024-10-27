import { NextResponse } from 'next/server';
import  { prisma } from '@/lib/prisma';

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const { status } = await request.json();

    const updatedService = await prisma.service.update({
      where: {
        id: parseInt(id)
      },
      data: {
        status
      }
    });

    return NextResponse.json(updatedService);
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      { error: 'Error updating service status' },
      { status: 500 }
    );
  }
}