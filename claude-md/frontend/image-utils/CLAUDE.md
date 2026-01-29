# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Install Dependencies
```bash
npm install
```

### Running Core Services
```bash
# Image compression (various quality levels)
npm run compress           # Medium compression
npm run compress:high      # High compression  
npm run compress:extreme   # Maximum compression
npm run compress:webp      # Convert to WebP format
npm run compress:png       # PNG-optimized compression

# Image splitting
npm run split             # Split images horizontally

# PDF conversion
npm run split:pdf         # Convert PDF pages to images

# MCP server
npm run mcp:server        # Start MCP server for AI integration
npm run mcp:test          # Test MCP server functionality
```

### Web Application (Unified System)

The web application now uses a **unified build and serve system**:

```bash
# Production: Build React app and serve (recommended)
npm start                 # Automatically builds React app, then starts server

# Alternative production command
npm run web               # Same as npm start

# Development: Run both API and UI servers in parallel  
npm run dev               # Runs web server + Vite dev server concurrently

# Manual build (if needed)
npm run build             # Builds React app to app/dist/

# React-only development
npm run app:dev           # Start only React dev server (localhost:5173)
npm run app:build         # Build only React app
npm run app:preview       # Preview built React app
```

#### How It Works

1. **Production** (`npm start`): 
   - Automatically builds React app to `app/dist/`
   - Serves built React app via Express server on port 3000
   - Single unified process

2. **Development** (`npm run dev`):
   - Runs web server (localhost:3000) for API 
   - Runs Vite dev server (localhost:5173) for React app
   - Both run concurrently with hot reload

3. **Build Process**:
   - React app builds to `app/dist/`
   - Express server automatically detects and serves built React app
   - Falls back to `public/index.html` if React app not built

### Global CLI Installation
```bash
npm run global:install    # Install CLI tools globally
npm run global:uninstall  # Remove global installation
npm run global:update     # Update global installation
```

### Global CLI Commands (after installation)
```bash
image-compress [file/directory] [options]    # Compress images
image-split [file/directory] [options]       # Split images
pdf-split [file/directory] [options]         # Convert PDFs
image-utils-mcp                              # Start MCP server
```

## Project Architecture

### Core Modules
- **`src/compressor.js`** - Multi-pass image compression with Sharp, supports JPEG/PNG/WebP optimization
- **`src/splitter.js`** - Horizontal image splitting for screenshots and long images
- **`src/pdf_splitter.js`** - PDF-to-image conversion using Poppler
- **`src/mcp-server.js`** - Model Context Protocol server providing AI tool integration

### CLI Binaries
- **`bin/compress.js`** - CLI wrapper for image compression
- **`bin/split.js`** - CLI wrapper for image splitting
- **`bin/pdf-split.js`** - CLI wrapper for PDF processing

### Input/Output Structure
Traditional workflow uses these directories:
- **Input**: `input/compress/`, `input/split/`, `input/pdf/`
- **Output**: `output/compress/`, `output/split/`, `output/pdf/`

Modern CLI supports flexible file/directory paths with `--output` option for custom destinations.

### Key Dependencies
- **Sharp** - High-performance image processing
- **node-poppler** - PDF conversion (requires system Poppler installation)
- **@modelcontextprotocol/sdk** - MCP server implementation

## Technical Details

### Compression Algorithm
The compressor uses a two-pass optimization strategy:
1. **First pass**: Resize, format-specific compression, metadata removal
2. **Second pass**: Additional optimization, format conversion if requested
3. **Quality control**: Only saves result if compression reduces file size

### Compression Levels
- **medium**: 60% JPEG quality, 1024px max width, 256 PNG colors
- **high**: 40% JPEG quality, 800px max width, 128 PNG colors  
- **extreme**: 20% JPEG quality, 600px max width, 64 PNG colors
- **png-optimized**: Specialized PNG compression with quality controls

### MCP Integration
The project includes a full MCP server that exposes all functionality as AI tools:
- Single image compression with quality/format options
- Batch directory processing
- Image splitting with customizable parameters
- PDF conversion with format/DPI controls
- Image metadata analysis
- Format compatibility listing

## Development Notes

### File Processing Patterns
- **In-place processing**: When source and output directories match, files get suffixes (`-compressed`, `_part1`) to avoid overwrites
- **Separate output**: When using `--output`, maintains original filenames in destination
- **Recursive processing**: Automatically processes subdirectories while avoiding output folder loops

### Error Handling
- Skips unsupported formats gracefully
- Prevents infinite recursion in nested directories  
- Only compresses when result is smaller than original
- Comprehensive validation in MCP server endpoints

### System Requirements
- Node.js 14.x or higher
- Poppler binaries in PATH for PDF processing (macOS: `brew install poppler`)
- Sufficient disk space for temporary files during multi-pass compression

## Testing MCP Server
```bash
# Start server for manual testing
node src/mcp-server.js

# Run comprehensive test suite  
node test-mcp-full.js
```

## Configuration Files
- **`MCP_CONFIG.md`** - Complete MCP server setup instructions
- **`claude_desktop_config.json`** - Example Claude Desktop integration
- **`.env`** - Environment variable configuration (optional)