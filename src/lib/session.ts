import { cookies } from 'next/headers'

export interface SessionPayload {
  userId: string
  email: string
  role: string
  expiresAt: Date
}

// Simple encryption using base64 encoding with a secret key
const secretKey = process.env.SESSION_SECRET || 'fallback-secret-key-for-development'

export async function encrypt(payload: SessionPayload): Promise<string> {
  const sessionData = JSON.stringify(payload)
  // Create a delimiter that's unlikely to appear in data
  const delimiter = '|||PAWSITIVE_SESSION|||'
  // Simple base64 encoding with secret key prefix for basic security
  const encoded = Buffer.from(`${secretKey}${delimiter}${sessionData}`).toString('base64')
  return encoded
}

export async function decrypt(session: string | undefined = ''): Promise<SessionPayload | null> {
  if (!session) return null
  
  try {
    console.log('decrypt: Starting session decryption...')
    const decoded = Buffer.from(session, 'base64').toString('utf-8')
    console.log('decrypt: Successfully decoded base64')
    
    const delimiter = '|||PAWSITIVE_SESSION|||'
    const delimiterIndex = decoded.indexOf(delimiter)
    
    if (delimiterIndex === -1) {
      console.error('Invalid session format: delimiter not found')
      return null
    }
    console.log('decrypt: Delimiter found at index:', delimiterIndex)
    
    const key = decoded.substring(0, delimiterIndex)
    const sessionData = decoded.substring(delimiterIndex + delimiter.length)
    
    if (key !== secretKey) {
      console.error('Invalid session: secret key mismatch')
      console.log('Expected key:', secretKey.substring(0, 10) + '...')
      console.log('Received key:', key.substring(0, 10) + '...')
      // Return null instead of throwing error - this will clear the invalid session
      return null
    }
    console.log('decrypt: Secret key validated')
    
    if (!sessionData) {
      console.error('Invalid session: no session data found')
      return null
    }
    console.log('decrypt: Session data found, parsing JSON...')
    
    const payload = JSON.parse(sessionData) as SessionPayload
    console.log('decrypt: JSON parsed successfully, checking expiration...')
    
    // Check if session has expired
    if (new Date() > new Date(payload.expiresAt)) {
      console.error('Session expired')
      return null
    }
    console.log('decrypt: Session is valid and not expired')
    
    return payload
  } catch (error) {
    console.error('Failed to verify session:', error)
    return null
  }
}

export async function createSession(userId: string, email: string, venueManager: boolean = false) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  // Map venueManager to role: true = admin, false = user
  const role = venueManager ? 'admin' : 'user'
  const sessionPayload = { userId, email, role, expiresAt }
  
  console.log('Creating session for:', { userId, email, role, venueManager })
  
  const session = await encrypt(sessionPayload)

  const cookieStore = await cookies()
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
  
  console.log('Session created successfully')
}

export async function verifySession(): Promise<SessionPayload | null> {
  try {
    console.log('verifySession: Starting...')
    const cookieStore = await cookies()
    console.log('verifySession: Got cookie store')
    
    const cookie = cookieStore.get('session')?.value
    console.log('verifySession: Cookie exists:', !!cookie)
    
    if (!cookie) {
      console.log('verifySession: No session cookie found')
      return null
    }
    
    const session = await decrypt(cookie)
    console.log('verifySession: Decrypt result:', session ? 'Success' : 'Failed')

    if (!session?.userId) {
      console.log('verifySession: No valid session or userId')
      return null
    }

    console.log('verifySession: Returning valid session for user:', session.userId)
    return session
  } catch (error) {
    console.error('verifySession: Error occurred:', error)
    throw error
  }
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}

export async function updateSession() {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')?.value
  const payload = await decrypt(session)

  if (!session || !payload) {
    return null
  }

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expires,
    sameSite: 'lax',
    path: '/',
  })
} 