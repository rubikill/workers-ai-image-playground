# Technical Context: Workers AI Image Playground

## Technology Stack

### Frontend Technologies
- **React 18**: Modern React with hooks and functional components
- **TypeScript 5**: Type-safe development with strict configuration
- **Next.js 14.2.5**: App router with edge runtime support
- **Tailwind CSS 3.4.13**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **Lucide React**: Modern icon library

### Backend & API Technologies
- **Cloudflare Workers AI**: AI model integration
- **Cloudflare R2**: Object storage for images
- **Cloudflare Pages**: Edge deployment platform
- **Edge Runtime**: Serverless edge computing

### Development Tools
- **ESLint**: Code linting with Next.js configuration
- **PostCSS**: CSS processing with Tailwind
- **Wrangler**: Cloudflare development CLI
- **Vercel**: Alternative deployment option

## Development Setup

### Prerequisites
```bash
# Node.js 18+ required
node --version

# Cloudflare account with AI and R2 access
# Wrangler CLI for deployment
npm install -g wrangler
```

### Environment Configuration
```bash
# Required environment variables
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_API_TOKEN=your_api_token

# Wrangler configuration
wrangler.toml
```

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Deploy to Cloudflare Pages
npm run deploy
```

## Technical Constraints

### Cloudflare Integration
- **AI Binding**: Must use Cloudflare Workers AI for image generation
- **R2 Storage**: Images must be stored in Cloudflare R2
- **Edge Runtime**: API routes must use edge runtime
- **Account Requirements**: Cloudflare account with AI and R2 access

### Performance Constraints
- **Image Generation**: AI model response times (typically 10-30 seconds)
- **File Size**: R2 storage limits and image optimization
- **Bandwidth**: Global CDN distribution for images
- **Memory**: Edge runtime memory limitations

### Browser Compatibility
- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Mobile Support**: Responsive design for all screen sizes
- **Progressive Enhancement**: Graceful degradation for older browsers

## Dependencies

### Core Dependencies
```json
{
  "next": "14.2.5",
  "react": "^18",
  "react-dom": "^18",
  "typescript": "^5",
  "tailwindcss": "^3.4.13"
}
```

### UI Dependencies
```json
{
  "@radix-ui/react-icons": "^1.3.0",
  "@radix-ui/react-label": "^2.1.0",
  "@radix-ui/react-select": "^2.1.1",
  "@radix-ui/react-slot": "^1.1.0",
  "class-variance-authority": "^0.7.0",
  "clsx": "^2.1.1",
  "lucide-react": "^0.446.0",
  "tailwind-merge": "^2.5.2",
  "tailwindcss-animate": "^1.0.7"
}
```

### Form & Validation
```json
{
  "@hookform/resolvers": "^3.9.0",
  "react-hook-form": "^7.53.0",
  "zod": "^3.23.8"
}
```

### Cloudflare Dependencies
```json
{
  "cloudflare": "^3.5.0",
  "@cloudflare/pages-plugin-cloudflare-access": "^1.0.5"
}
```

### Development Dependencies
```json
{
  "@cloudflare/next-on-pages": "^1.13.3",
  "@types/node": "^20",
  "@types/react": "^18",
  "@types/react-dom": "^18",
  "autoprefixer": "^10.4.20",
  "eslint": "^8",
  "eslint-config-next": "14.2.5",
  "postcss": "^8.4.47",
  "wrangler": "^3.78.10"
}
```

## Build Configuration

### Next.js Configuration
```javascript
// next.config.mjs
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@cloudflare/next-on-pages']
  }
}
```

### Tailwind Configuration
```javascript
// tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        'spin': 'spin 1s linear infinite',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

### TypeScript Configuration
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

## Deployment Configuration

### Cloudflare Pages Configuration
```toml
# wrangler.toml
name = "workers-ai-image-playground"
compatibility_date = "2024-09-25"
compatibility_flags = ["nodejs_compat"]
pages_build_output_dir = ".vercel/output/static"

[ai]
binding = "AI"

[[r2_buckets]]
bucket_name = "ai-image-playground"
binding = "BUCKET"
```

### Build Scripts
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "pages:build": "npx @cloudflare/next-on-pages",
    "preview": "npm run pages:build && wrangler pages dev",
    "deploy": "npm run pages:build && wrangler pages deploy"
  }
}
```

## Tool Usage Patterns

### Development Workflow
1. **Local Development**: `npm run dev` for hot reloading
2. **Testing**: Manual testing with browser dev tools
3. **Building**: `npm run build` for production build
4. **Deployment**: `npm run deploy` for Cloudflare Pages

### Cloudflare Integration
1. **AI Models**: Direct API calls to Cloudflare Workers AI
2. **R2 Storage**: Object storage for generated images
3. **Edge Runtime**: Serverless edge computing
4. **Global CDN**: Automatic content distribution

### Code Quality
1. **ESLint**: Code linting with Next.js rules
2. **TypeScript**: Type checking and IntelliSense
3. **Prettier**: Code formatting (via editor)
4. **Git Hooks**: Pre-commit validation

## Performance Considerations

### Bundle Optimization
- **Tree Shaking**: Remove unused code
- **Code Splitting**: Route-based splitting
- **Image Optimization**: Next.js Image component
- **Minification**: Production build optimization

### Caching Strategy
- **Static Assets**: CDN caching for images
- **API Responses**: Edge caching where appropriate
- **Browser Caching**: Cache headers for static content

### Monitoring
- **Cloudflare Analytics**: Built-in performance monitoring
- **Error Tracking**: Console logging and error boundaries
- **Performance Metrics**: Core Web Vitals tracking
