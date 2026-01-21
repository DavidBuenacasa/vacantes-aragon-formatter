// app/api/maps/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const origins = searchParams.get('origins');
  const destinations = searchParams.get('destinations');
  const key = searchParams.get('key');

  const googleUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins}&destinations=${destinations}&key=${key}`;
  
  const res = await fetch(googleUrl);
  const data = await res.json();

  return NextResponse.json(data);
}