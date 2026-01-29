# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a comprehensive 6-week interactive web course for teaching pixel art creation for Unity game development. The application is a client-side single-page application with sub-tab navigation that provides focused learning experiences without long scrolling.

## Development Commands

Since this is a client-side web application, no build process is required:

- **Local Development**: Open `index.html` directly in a web browser
- **Testing**: No formal test suite - manual testing by navigating through weeks and tabs
- **Deployment**: Static files can be deployed to any web server (GitHub Pages, Netlify, etc.)

## Architecture

### File Structure
- `index.html` (151 lines): Main HTML structure with templates
- `css/styles.css` (513 lines): All application styles
- `js/main.js` (457 lines): Application logic, navigation, and state management  
- `js/canvas.js` (575 lines): Canvas class system for interactive drawing tools
- `js/content.js` (1,703 lines): All course content for 6 weeks

### Navigation System
- **Main Navigation**: 6 weeks of content
- **Sub-Navigation**: Each week has 6 tabs (Overview, Concepts, Practice 1, Practice 2, Challenge, Assessment)
- **State Management**: Tracks current week, tab, canvas instances, and quiz progress in `main.js`

### Canvas System Architecture
The interactive drawing functionality is built around a class hierarchy:

- **PixelCanvas**: Base class with core pixel drawing functionality (`canvas.js:3`)
- **LayeredCanvas**: Extends PixelCanvas with layer support for complex sprites (`canvas.js:~400`)
- **AnimationCanvas**: Frame-by-frame animation with onion skinning (`canvas.js:~500`)
- **TileCanvas**: Seamless tile creation with live preview (`canvas.js:~600`)

Canvas instances are managed in `state.canvasInstances` Map and created dynamically based on exercise requirements.

### Content Management
All educational content is stored in `courseContent` object in `content.js`. Each week contains:
- `title`: Week title
- `tabs`: Object with 6 tabs (overview, concepts, practice1, practice2, challenge, assessment)
- Each tab has `title` and `content` properties with HTML content

### Tools and Interactions
- Drawing tools: pencil, eraser, fill bucket
- Color palette system with predefined and custom colors
- Grid toggle and export functionality (PNG with scaling options)
- Touch support for tablet/mobile devices
- Responsive design for different screen sizes

## Key Technical Details

### Canvas Initialization
Canvas instances are created in `main.js:loadTab()` function based on exercise type:
```javascript
canvasInstance = new PixelCanvas(canvas, options);
canvasInstance = new LayeredCanvas(canvas, options);
// etc.
```

### State Persistence
- Current navigation state tracked in `state` object
- Canvas instances cached to preserve drawings when switching tabs
- Quiz answers tracked in `state.quizAnswered` Set

### Export Functionality
PNG export is implemented in each canvas class with scaling options (1x, 2x, 4x, 8x) and optional transparent backgrounds.

## Educational Context

This is university-level curriculum focusing on:
- Progressive skill building across 6 weeks
- Cultural sensitivity and inclusive design principles
- Professional game development workflows
- Unity integration best practices (Week 6)

The sub-tab structure eliminates scrolling fatigue and provides focused learning modules that can be completed individually or as complete weeks.

## Visual Example System

A comprehensive visual learning system has been implemented for Practice sections:

### File Structure for Examples
- `/images/examples/` - Directory for all practice example images
- SVG format for scalable, crisp pixel art examples
- Naming convention: `[section-name].svg` (e.g., `single-pixels.svg`, `checkerboard.svg`)

### HTML Structure Pattern
```html
<li>
    <strong>Task Name (time estimate):</strong>
    <div class="task-with-example">
        <div class="task-instructions">
            <ul>
                <li>Step-by-step instructions...</li>
                <li><em>Success goal: Clear completion criteria</em></li>
            </ul>
        </div>
        <div class="task-example">
            <img src="images/examples/example-name.svg" alt="Descriptive alt text" class="pixel-example"/>
            <p class="example-caption">Example: Brief description</p>
        </div>
    </div>
</li>
```

### CSS Classes
- `.task-with-example` - Flexbox container for side-by-side layout
- `.task-instructions` - Left column with instructions
- `.task-example` - Right column with visual example
- `.pixel-example` - Image styling with crisp pixel rendering
- `.example-caption` - Caption text styling

### SVG Creation Guidelines
- Use `viewBox` for proper scaling
- Apply `image-rendering: pixelated` for crisp pixels
- Include grid lines for educational clarity
- Use consistent color palette matching the application
- Keep examples simple and clearly demonstrate the task goal

### Implementation Process
1. Create SVG examples in `/images/examples/`
2. Update HTML content in `content.js` with the pattern above
3. CSS styling is already implemented and reusable

This system has been successfully implemented in Week 1 Practice 1 (`js/content.js:140-228`) and can be replicated in other practice sections.
