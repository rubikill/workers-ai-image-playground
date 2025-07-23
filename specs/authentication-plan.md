# Authentication Feature Plan: Cloudflare Zero Trust with Google SSO

## Project Context

**Workers AI Image Playground** - A modern web application that leverages Cloudflare Workers AI to generate images using state-of-the-art AI models. The application provides an intuitive interface for users to create, view, and download AI-generated images.

### Current State
- ✅ **Cloudflare Access Configuration**: Completed
- ✅ **Google SSO Setup**: Completed (handled by Cloudflare Access)
- 🔄 **JWT Token Validation**: In Progress
- 🔄 **User Context Integration**: In Progress
- 🔄 **API Route Protection**: Pending

## Implementation Plan

### Phase 1: JWT Token Validation & User Context

#### 1.1 JWT Validation Utility
```typescript
// lib/auth.ts
import jwt from 'jsonwebtoken'

interface CloudflareUser {
  sub: string
  email: string
  name: string
  picture?: string
  aud: string
  iss: string
  exp: number
  iat: number
}

export function validateCloudflareJWT(token: string): CloudflareUser | null {
  try {
    // Decode JWT without verification (Cloudflare handles verification)
    const decoded = jwt.decode(token) as CloudflareUser

    if (!decoded || !decoded.sub || !decoded.email) {
      return null
    }

    // Validate required fields
    if (!decoded.aud || !decoded.iss || !decoded.exp) {
      return null
    }

    // Check if token is expired
    if (decoded.exp * 1000 < Date.now()) {
      return null
    }

    return decoded
  } catch (error) {
    console.error('JWT validation error:', error)
    return null
  }
}
```

#### 1.2 Authentication Middleware
```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { validateCloudflareJWT } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  // Skip auth for public routes
  if (request.nextUrl.pathname.startsWith('/api/public')) {
    return NextResponse.next()
  }

  // Get CF_Authorization cookie
  const authCookie = request.cookies.get('CF_Authorization')

  if (!authCookie?.value) {
    // Redirect to Cloudflare Access login
    return NextResponse.redirect(new URL('/.cloudflareaccess/', request.url))
  }

  // Validate JWT token
  const user = validateCloudflareJWT(authCookie.value)

  if (!user) {
    // Invalid token, redirect to login
    return NextResponse.redirect(new URL('/.cloudflareaccess/', request.url))
  }

  // Add user info to request headers for API routes
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-user-id', user.sub)
  requestHeaders.set('x-user-email', user.email)
  requestHeaders.set('x-user-name', user.name)

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: [
    '/api/((?!public).*)',
    '/((?!_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
}
```

### Phase 2: User Context & Components

#### 2.1 User Context Provider
```typescript
// components/UserContext.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { validateCloudflareJWT } from '@/lib/auth'

interface User {
  id: string
  email: string
  name: string
  picture?: string
}

interface UserContextType {
  user: User | null
  loading: boolean
  logout: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for CF_Authorization cookie on client side
    const checkAuth = () => {
      const cookies = document.cookie.split(';')
      const authCookie = cookies.find(cookie =>
        cookie.trim().startsWith('CF_Authorization=')
      )

      if (authCookie) {
        const token = authCookie.split('=')[1]
        const userData = validateCloudflareJWT(token)
        setUser(userData)
      }

      setLoading(false)
    }

    checkAuth()
  }, [])

  const logout = () => {
    // Clear CF_Authorization cookie
    document.cookie = 'CF_Authorization=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    document.cookie = 'CF_Binding=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    document.cookie = 'CF_AppSession=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'

    // Redirect to Cloudflare Access logout
    window.location.href = '/.cloudflareaccess/logout'
  }

  return (
    <UserContext.Provider value={{ user, loading, logout }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
```

#### 2.2 User Profile Component
```typescript
// components/UserProfile.tsx
'use client'

import { useUser } from './UserContext'
import { Button } from '@/components/ui/button'
import { LogOut, User } from 'lucide-react'

export function UserProfile() {
  const { user, loading, logout } = useUser()

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
        <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        {user.picture ? (
          <img
            src={user.picture}
            alt={user.name}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        )}
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {user.name}
        </span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={logout}
        className="text-gray-500 hover:text-gray-700"
      >
        <LogOut className="w-4 h-4" />
      </Button>
    </div>
  )
}
```

### Phase 3: API Route Protection

#### 3.1 Protected API Route Helper
```typescript
// lib/api-auth.ts
import { NextRequest } from 'next/server'
import { validateCloudflareJWT } from '@/lib/auth'

export interface AuthenticatedRequest extends NextRequest {
  user: {
    id: string
    email: string
    name: string
  }
}

export function getAuthenticatedUser(request: NextRequest) {
  const authCookie = request.cookies.get('CF_Authorization')

  if (!authCookie?.value) {
    return null
  }

  return validateCloudflareJWT(authCookie.value)
}

export function requireAuth(request: NextRequest): AuthenticatedRequest {
  const user = getAuthenticatedUser(request)

  if (!user) {
    throw new Response('Unauthorized', { status: 401 })
  }

  return request as AuthenticatedRequest
}
```

#### 3.2 Updated Image Generation Route
```typescript
// app/api/generate_image/route.ts
import { requireAuth } from '@/lib/api-auth'

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const authenticatedRequest = requireAuth(request)
    const user = authenticatedRequest.user

    const context = getRequestContext()
    const { AI, BUCKET } = context.env

    let { prompt, model } = await authenticatedRequest.json<{
      prompt: string
      model: string
    }>()

    if (!model) model = "@cf/black-forest-labs/flux-1-schnell"

    const inputs = { prompt }
    const response = await AI.run(model, inputs)

    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2, 15)
    // Store images in user-specific folders
    const fileName = `${user.id}/${timestamp}-${randomId}.jpeg`
    const binaryString = atob(response.image)

    // @ts-ignore
    const img = Uint8Array.from(binaryString, (m) => m.codePointAt(0))
    await BUCKET.put(fileName, img, {
      httpMetadata: {
        customMetadata: {
          userId: user.id,
          userEmail: user.email,
          generatedAt: timestamp.toString(),
          prompt: prompt,
          model: model
        }
      }
    })

    return new Response(`data:image/jpeg;base64,${response.image}`, {
      headers: {
        "Content-Type": "image/jpeg",
      },
    })
  } catch (error: any) {
    console.log(error)
    return new Response(error.message, { status: 500 })
  }
}
```

### Phase 4: User-Specific Image Management

#### 4.1 Updated Images API Route
```typescript
// app/api/images/route.ts
import { requireAuth } from '@/lib/api-auth'

export async function GET(request: NextRequest) {
  try {
    const authenticatedRequest = requireAuth(request)
    const user = authenticatedRequest.user

    const context = getRequestContext()
    const { BUCKET } = context.env

    // List only user's images
    const list = await BUCKET.list({ prefix: `${user.id}/` })
    const images = await Promise.all(
      list.objects.map(async (object) => {
        const metadata = await BUCKET.head(object.key)
        return {
          key: object.key,
          size: object.size,
          uploaded: object.uploaded,
          metadata: metadata.customMetadata
        }
      })
    )

    return new Response(JSON.stringify(images), {
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error: any) {
    console.log(error)
    return new Response(error.message, { status: 500 })
  }
}
```

### Phase 5: UI Integration

#### 5.1 Updated Layout with User Context
```typescript
// app/layout.tsx
import { UserProvider } from '@/components/UserContext'
import { UserProfile } from '@/components/UserProfile'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <header className="border-b bg-white/80 backdrop-blur-sm">
              <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI Image Playground
                </h1>
                <UserProfile />
              </div>
            </header>
            <main>
              {children}
            </main>
          </div>
        </UserProvider>
      </body>
    </html>
  )
}
```

#### 5.2 Updated Image Generator with User Context
```typescript
// components/ImageGenerator.tsx
'use client'

import { useUser } from './UserContext'

export default function ImageGenerator() {
  const { user, loading } = useUser()

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Sign in to Generate Images
          </h2>
          <p className="text-gray-600 mb-6">
            Please sign in with your Google account to access the AI image generator.
          </p>
          <a
            href="/.cloudflareaccess/"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In with Google
          </a>
        </div>
      </div>
    )
  }

  // Rest of the existing ImageGenerator component...
}
```

## Implementation Timeline

### Week 1: Core Authentication (Current Focus)
- [x] Cloudflare Access Configuration ✅
- [ ] JWT Validation Utility
- [ ] Authentication Middleware
- [ ] User Context Provider
- [ ] Logout Functionality

### Week 2: API Protection & User Data
- [ ] Protected API Routes
- [ ] User-Specific Image Storage
- [ ] Updated Image Management APIs
- [ ] User Profile Components

### Week 3: UI Integration & Testing
- [ ] Layout Updates with User Context
- [ ] Protected Component Updates
- [ ] Comprehensive Testing
- [ ] Error Handling Improvements

### Week 4: Polish & Documentation
- [ ] Performance Optimization
- [ ] Security Review
- [ ] Documentation Updates
- [ ] Memory Bank Updates

## Key Technical Details

### JWT Token Structure
Based on the [Cloudflare documentation](https://developers.cloudflare.com/cloudflare-one/identity/authorization-cookie/), the `CF_Authorization` cookie contains a JWT with:
- `sub`: User ID
- `email`: User email
- `name`: User display name
- `picture`: User profile picture (optional)
- `aud`: Audience (application ID)
- `iss`: Issuer (Cloudflare)
- `exp`: Expiration timestamp
- `iat`: Issued at timestamp

### Cookie Management
Following the [Cloudflare Authorization Cookie documentation](https://developers.cloudflare.com/cloudflare-one/identity/authorization-cookie/), we need to handle:
- `CF_Authorization`: Main authorization token
- `CF_Binding`: Optional binding cookie
- `CF_AppSession`: CSRF protection token

### Security Considerations
1. **JWT Validation**: Validate token structure and expiration
2. **Cookie Security**: Proper cookie cleanup on logout
3. **User Isolation**: Ensure users can only access their own data
4. **Error Handling**: Graceful handling of auth failures

## Dependencies Required

### New Dependencies
```json
{
  "jsonwebtoken": "^9.0.0",
  "@types/jsonwebtoken": "^9.0.0"
}
```

## Success Metrics

### Technical Metrics
- **Authentication Success Rate**: >99%
- **Login Time**: <2 seconds
- **Session Security**: No unauthorized access
- **API Protection**: All endpoints properly secured

### User Experience Metrics
- **Login Flow**: Seamless Google SSO experience
- **Personalization**: User-specific galleries working
- **Performance**: No degradation in image generation
- **Error Handling**: Graceful auth error handling

### Business Metrics
- **User Adoption**: Track authenticated user growth
- **Usage Patterns**: Monitor user activity and engagement
- **Data Privacy**: Ensure user data protection
- **Security**: Zero security incidents

## Risk Mitigation

### Technical Risks
1. **Edge Runtime Compatibility**: Test thoroughly with Cloudflare edge runtime
2. **Session Management**: Implement robust session handling
3. **API Performance**: Monitor impact on image generation performance
4. **Data Migration**: Plan for existing image data migration

### User Experience Risks
1. **Login Friction**: Ensure smooth Google SSO flow
2. **Data Loss**: Prevent loss of existing user data
3. **Performance Impact**: Maintain fast image generation
4. **Accessibility**: Ensure auth flows are accessible

---

*This plan leverages Cloudflare's built-in authentication system while adding the necessary JWT validation and user context management for a personalized experience.*
