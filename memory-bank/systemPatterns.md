# System Patterns: Workers AI Image Playground

## System Architecture

### High-Level Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js App   │    │ Cloudflare AI   │    │   Cloudflare    │
│   (Frontend)    │◄──►│   (Image Gen)   │◄──►│   R2 Storage    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Edge Runtime  │    │   AI Models     │    │   Image Files   │
│   (API Routes)  │    │   (flux-1-schnell) │   (JPEG/PNG)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Component Architecture
```
App/
├── page.tsx (Home)
├── images/
│   └── page.tsx (Gallery)
└── api/
    ├── generate_image/route.ts
    ├── models/route.ts
    ├── schema/route.ts
    ├── images/route.ts
    └── image/route.ts

Components/
├── ImageGenerator.tsx (Main Generator)
├── ImageListing.tsx (Gallery)
└── ui/ (Design System)
    ├── button.tsx
    ├── input.tsx
    ├── textarea.tsx
    ├── select.tsx
    └── label.tsx
```

## Key Technical Decisions

### 1. Next.js 14 App Router
- **Rationale**: Modern React framework with built-in API routes and edge runtime
- **Benefits**: Server-side rendering, API routes, edge deployment
- **Pattern**: App router with TypeScript for type safety

### 2. Cloudflare Workers AI Integration
- **Pattern**: Edge runtime with AI binding
- **Implementation**: Direct AI model calls from API routes
- **Benefits**: Global edge deployment, low latency, cost-effective

### 3. Dynamic Schema-Based Forms
- **Pattern**: Schema-driven UI generation
- **Implementation**: Fetch model schemas and generate forms dynamically
- **Benefits**: Supports multiple models without code changes

### 4. R2 Storage for Images
- **Pattern**: Object storage with metadata
- **Implementation**: Base64 to binary conversion and R2 upload
- **Benefits**: Global CDN, cost-effective, integrated with Cloudflare

### 5. Modern UI Design System
- **Pattern**: Component-based design with Tailwind CSS
- **Implementation**: Radix UI primitives with custom styling
- **Benefits**: Consistent design, accessibility, maintainability

## Design Patterns

### 1. Container/Presenter Pattern
```typescript
// Container: ImageGenerator.tsx
export default function ImageGenerator() {
  // State management and business logic
  return <ImageGeneratorUI {...props} />
}

// Presenter: UI components handle presentation
```

### 2. Custom Hook Pattern
```typescript
// Form state management
const [inputValues, setInputValues] = useState<Record<string, any>>({})
const [isLoading, setIsLoading] = useState(false)
```

### 3. API Route Pattern
```typescript
// Edge runtime API routes
export const runtime = "edge"
export async function POST(request: NextRequest) {
  // Handle request with Cloudflare context
}
```

### 4. Dynamic Form Generation
```typescript
// Schema-based form rendering
{Object.entries(schema.input.properties).map(([key, value]) => (
  <FormField key={key} field={key} config={value} />
))}
```

## Critical Implementation Paths

### 1. Image Generation Flow
```
User Input → API Route → AI Model → Base64 Response → R2 Storage → UI Update
```

### 2. Model Schema Fetching
```
Model Selection → Schema API → Cloudflare API → Dynamic Form Generation
```

### 3. Image Retrieval Flow
```
Gallery Request → R2 List → Image URLs → UI Rendering
```

## Component Relationships

### Data Flow
```
ImageGenerator
├── Model Selection → Schema Fetch → Dynamic Form
├── Form Submission → Image Generation → R2 Storage
└── Image Display → Download Functionality

ImageListing
├── Image Fetch → R2 List → Grid Display
├── Image Modal → Full View → Download
└── Navigation → Generator Link
```

### State Management
- **Local State**: React hooks for component state
- **Form State**: Controlled inputs with validation
- **Loading States**: UI feedback during operations
- **Error Handling**: Try-catch with user feedback

## Security Patterns

### 1. Input Validation
- **Client-side**: Form validation with required fields
- **Server-side**: API route validation and sanitization

### 2. Error Handling
- **Graceful Degradation**: Fallback UI for errors
- **User Feedback**: Clear error messages and loading states

### 3. Cloudflare Security
- **Edge Security**: Built-in DDoS protection
- **API Security**: Token-based authentication
- **Storage Security**: R2 access controls

## Performance Patterns

### 1. Edge Computing
- **Global Deployment**: Cloudflare's edge network
- **Low Latency**: Close to user locations
- **Caching**: Built-in CDN capabilities

### 2. Image Optimization
- **Next.js Image**: Automatic optimization
- **R2 Storage**: Global CDN distribution
- **Lazy Loading**: Component-level optimization

### 3. Bundle Optimization
- **Tree Shaking**: Unused code elimination
- **Code Splitting**: Route-based splitting
- **Minification**: Production build optimization

## Scalability Patterns

### 1. Model Expansion
- **Dynamic Schema**: Support new models without code changes
- **API Abstraction**: Consistent interface across models

### 2. Storage Scaling
- **R2 Integration**: Automatic scaling with usage
- **Metadata Management**: Efficient image organization

### 3. User Growth
- **Edge Deployment**: Global performance
- **Stateless Design**: Horizontal scaling ready
