# All-Scheduler

A unified scheduler application that works with various calendar services like Calendly and Cal.com.

## Architecture

The application follows a simple Next.js architecture with API routes:

### Frontend

- Uses React with React Query for state management
- Makes direct API calls to the backend API routes
- Provides a simple interface for selecting slots and booking events

### Backend

- Next.js API routes handle the integration with calendar services
- The services (CalendlyService, CalService) run server-side, keeping API keys and sensitive logic secure
- API routes return standardized responses to the frontend
- Shared utilities ensure consistent behavior across routes

### API Routes

- `/api/scheduler/available-events` - Get available time slots for a calendar link
- `/api/scheduler/book-event` - Book an event with the specified details

### Shared Utilities

The application uses shared utilities to eliminate code duplication:

- `providers.ts` - Contains service provider selection logic and type definitions
- Type definitions ensure consistent API responses

## Services

- `CalendlyService` - Handles integration with Calendly
- `CalService` - Handles integration with Cal.com

## Running the Application

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to use the application.

## Benefits of this Architecture

1. **Security**: API keys and sensitive logic stay on the server
2. **Performance**: No client-side implementation of complex logic
3. **Maintainability**: Clear separation of concerns and reusable utilities
4. **Flexibility**: Easy to add new calendar service integrations
5. **Type Safety**: Consistent typing across frontend and backend
