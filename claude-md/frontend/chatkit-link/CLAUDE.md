# ChatKit Link Development Log

## Overview
ChatKit Link is a web application that allows users to demo their ChatKit workflows by providing a workflow ID and OpenAI API key. Built with FastAPI backend and Vite + React frontend.

## Tech Stack
- **Backend**: Python 3.9, FastAPI, requests library
- **Frontend**: Vite 7.1.9, React 19.2.0, @openai/chatkit-react 0.0.0
- **Deployment**: Render (both backend and frontend)
- **Domain**: chatkit.link

## Key Features

### 1. Sidebar Workflow Management
- **API Key Input**: Single API key shared across all workflows (top of sidebar)
- **Add Workflow**: Button with inline form to add new workflows with optional labels
- **Workflow List**: Display all saved workflows with labels and truncated IDs
- **Active Indicator**: Green checkmark (✓) shows currently active workflow
- **Delete Workflow**: × button on each workflow to remove it
- **Switch Workflows**: Click any workflow to load it without re-entering API key
- **Collapse/Expand**: Toggle button to minimize sidebar to 50px width
- **Collapsed State**: Shows "C" logo at top, expand arrow (→) at bottom
- **Persistence**: All data saved to localStorage (workflows, API key, active workflow, sidebar state)

### 2. URL Parameter Support
- Workflows can be shared via URL: `?workflow=wf_abc123`
- URL updates when switching workflows

### 3. ChatKit Integration
- Uses `@openai/chatkit-react` package
- Authentication via `getClientSecret` method
- Session creation through backend API endpoint
- Configurable theme, start screen, and composer

## Backend API

### Endpoint: POST /api/create-session
**Request:**
```json
{
  "workflow_id": "wf_abc123...",
  "api_key": "sk-proj-...",
  "user_id": "optional-uuid"
}
```

**Response:**
```json
{
  "client_secret": "ek_...",
  ...
}
```

**Implementation Details:**
- Generates UUID for user_id if not provided
- Makes direct HTTP request to OpenAI API `/v1/chatkit/sessions`
- Includes required headers: `OpenAI-Beta: chatkit_beta=v1`
- Returns full session response including client_secret

## Frontend Architecture

### State Management
- `apiKey`: User's OpenAI API key (localStorage)
- `workflows`: Array of {id, label} objects (localStorage)
- `activeWorkflowId`: Currently selected workflow (localStorage)
- `sidebarCollapsed`: Boolean for sidebar state (localStorage)
- `clientSecret`: Active ChatKit session secret
- `loading`: Loading state during session creation
- `error`: Error messages

### Component Structure
```
App
├── Sidebar (expanded or collapsed)
│   ├── API Key Section
│   ├── Add Workflow Form
│   └── Workflows List
└── Main Content
    └── ChatKit Component or Placeholder
```

## CSS Layout
- **Full-height layout**: Uses flexbox with `height: 100vh`
- **Sidebar**: 280px expanded, 50px collapsed, smooth transition
- **Main content**: Flex: 1 to fill remaining space
- **Colors**: Green accent (#10a37f), neutral grays
- **Responsive**: Handles overflow with scrolling in workflow list

## Content Security Policy (CSP)
Configured to allow ChatKit resources:
```
script-src: cdn.platform.openai.com, chatgpt.com, cdn.openai.com
connect-src: chatgpt.com, sentinel.openai.com, *.oaiusercontent.com, api.openai.com, mixpanel, backend
style-src: cdn.openai.com
font-src: cdn.openai.com
frame-src: cdn.platform.openai.com (required for ChatKit iframe)
img-src: data:, blob:, https:
```

## Critical Configuration Notes

### ChatKit Authentication
**IMPORTANT**: Use EITHER `getClientSecret` OR `domainKey`, not both.

**Current Implementation (Correct):**
```javascript
useChatKit({
  api: {
    async getClientSecret(existing) {
      return clientSecret;
    },
  },
  // NO domainKey - incompatible with getClientSecret
})
```

**Why domainKey was removed:**
- `domainKey` + `url` is for custom backend implementations that proxy all ChatKit API calls
- `getClientSecret` is for direct OpenAI API integration (our approach)
- Using both causes `InvalidFrameParamsError: Invalid input → at api`

### Deployment Configuration

**Backend (Web Service):**
- Build: `pip install -r requirements.txt`
- Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Region: Oregon
- Plan: Starter
- URL: https://chatkit-link-backend.onrender.com

**Frontend (Static Site):**
- Build: `cd .conductor/chicago && npm install && npm run build`
- Publish Path: `.conductor/chicago/dist`
- Region: Oregon
- URL: https://chatkit-link-frontend.onrender.com
- Auto-deploys on push to main

**Environment Variables:**
- Frontend uses `VITE_API_URL` (defaults to backend.onrender.com)
- Backend uses `CHATKIT_API_BASE` (defaults to api.openai.com)

## Git Workflow
- Main branch: `main` (production, auto-deploys to Render)
- Feature branch: `chatkit-demo-site` (development work)
- PRs created from feature branch, squash merged to main

## Common Issues & Solutions

### Issue: ChatKit iframe not loading
**Cause:** CSP blocking frame-src
**Solution:** Add `https://cdn.platform.openai.com` to frame-src directive

### Issue: InvalidFrameParamsError
**Cause:** Using `domainKey` with `getClientSecret`
**Solution:** Remove `domainKey` from ChatKit config

### Issue: Session not loading on workflow click
**Cause:** Missing API key or inactive workflow state
**Solution:** Ensure API key is entered and `loadWorkflow` is called on click

### Issue: Workflows not persisting
**Cause:** localStorage not being updated
**Solution:** Verify useEffect hooks save to localStorage on state changes

## File Structure
```
.conductor/chicago/
├── index.html          # Entry point, CSP, ChatKit CDN script
├── src/
│   ├── App.jsx        # Main component with sidebar & ChatKit
│   ├── App.css        # All styling
│   └── main.jsx       # React entry
├── package.json       # Dependencies
├── vite.config.js     # Dev server config
└── .gitignore         # Excludes node_modules

Backend:
├── main.py            # FastAPI server
├── requirements.txt   # Python dependencies
└── .env.example       # Environment template
```

## localStorage Keys
- `chatkit_api_key`: User's OpenAI API key
- `chatkit_workflows`: JSON array of {id, label}
- `chatkit_active_workflow`: Currently selected workflow ID
- `chatkit_sidebar_collapsed`: "true" or "false"

## Recent Changes (Session Summary)

### PR #1: Initial ChatKit Link Implementation
- Created FastAPI backend with session creation endpoint
- Built React frontend with Vite
- Integrated @openai/chatkit-react
- Added API key and workflow ID inputs
- Deployed to Render

### PR #2: Production Backend URL
- Updated frontend to call deployed backend
- Added VITE_API_URL environment variable support

### PR #3: Sidebar Workflow Management
- Complete UI overhaul with sidebar
- Multi-workflow support
- localStorage persistence
- Collapse/expand functionality

### PR #4: Form Button Styling
- Fixed Add/Cancel button borders and colors
- Added proper hover states

### PR #5: UI Improvements
- Fixed CSP frame-src for ChatKit iframe
- Removed workflow count from collapsed sidebar
- Changed expand button from green to neutral gray
- Moved expand arrow to bottom

### PR #6: Logo and ChatKit Fix (Current)
- Added "C" logo to collapsed sidebar
- Removed domainKey to fix InvalidFrameParamsError
- Resolved merge conflicts
- Final CSP configuration

## Future Considerations
- Custom domain setup (chatkit.link DNS configuration)
- Error handling improvements
- Workflow editing/renaming
- Export/import workflows
- Session refresh handling
- Rate limiting on backend
