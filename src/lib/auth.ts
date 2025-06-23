import { verifySession, SessionPayload } from './session'
import { redirect } from 'next/navigation'

export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
  created: string
  updated: string
}

export async function getCurrentUser(): Promise<SessionPayload | null> {
  return await verifySession()
}

export async function requireAuth(): Promise<SessionPayload> {
  const session = await verifySession()
  
  if (!session) {
    redirect('/auth/login')
  }
  
  return session
}

export async function requireAdmin(): Promise<SessionPayload> {
  const session = await requireAuth()
  
  if (session.role !== 'admin') {
    redirect('/auth/unauthorized')
  }
  
  return session
}

export function isAdmin(session: SessionPayload | null): boolean {
  return session?.role === 'admin'
}

export function isAuthenticated(session: SessionPayload | null): boolean {
  return !!session?.userId
} 