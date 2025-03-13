import { NextResponse } from 'next/server'
 
export async function POST() {
  const res = await fetch('https://data.mongodb-api.com/...', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      
    },
    body: JSON.stringify({ time: new Date().toISOString() }),
  })
 
  const data = await res.json()
 
  return Response.json(data)
  catch (error) {
      return Response.json({ error: "Failed" }, { status: 500 });
    }
}