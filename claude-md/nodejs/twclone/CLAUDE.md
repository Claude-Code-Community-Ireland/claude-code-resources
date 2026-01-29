# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TradeWars Clone is a real-time multiplayer space trading game inspired by the classic TradeWars 2002. Built with TypeScript, Express.js, and Socket.io, it features real-time trading, sector-based navigation, energy management, and ship progression.

## Development Commands

**Build & Run:**
- `npm run build` - Compile TypeScript to JavaScript in `dist/`
- `npm start` - Run production server from compiled JavaScript
- `npm run dev` - Development mode with TypeScript hot reload using ts-node

**Testing & Playtesting:**
- When playtesting with puppeteer/browser automation, run server in background: `npm run dev &`
- The `&` is critical - without it, the bash command will timeout waiting for the server to exit
- Server runs on http://localhost:3000
- Use `ps aux | grep ts-node` to check if server is running
- Use `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000` to test server response

**Note:** Railway deployment automatically runs `npm run build` via the postinstall hook.

## Architecture Overview

### Core Game Systems

**Type System (`src/types.ts`):**
All game entities use strongly-typed enums instead of magic strings:
- `TradingPostType` (MINING_STATION, AGRICULTURAL_PORT, INDUSTRIAL_COMPLEX, COMMERCIAL_HUB, STARPORT)
- `ShipType` (SCOUT, TRADER, FREIGHTER) 
- `Action` (MOVE, TRADE, SCAN) for energy consumption
- Socket event interfaces for type-safe client-server communication

**Game State Architecture:**
- **Universe**: Grid-based universe with adjacent sector connections (see `universeConfig` in `game-config.ts`)
- **Trading Posts**: Distributed across universe with diminishing efficiency mechanics (see `tradeConfig`)
- **Players**: Persistent state including credits, energy, ship type, cargo upgrades, and current location
- **Energy System**: Regenerating resource consumed by movement and trading (see `energyConfig`)

### Server Architecture

**Core Modules:**
- `server.ts`: Express/Socket.io server handling client connections
- `universe-generator.ts`: Creates 50x50 grid universe with trading posts
- `energy-system.ts`: Manages player energy regeneration and consumption
- `game-config.ts`: Central configuration for all game constants
- `player-factory.ts`: Creates new player instances with starting resources

**Socket Events:**
- `playerJoined`: Initialize new player with Scout Ship and 1,000 credits
- `moveTo`: Handle sector navigation with pathfinding support
- `executeTrade`: Single-action trading with efficiency decay
- `purchaseShip`/`purchaseCargoUpgrade`: Ship and cargo progression
- `scanForTradingPosts`: Long-range scanning within 10-sector radius

### Client Architecture (`public/index.html`)

**Game State Management:**
- Maintains local `gameState` object synchronized with server
- Real-time UI updates for energy, credits, and player position
- Visual energy bar with color coding (green/orange/red based on remaining energy)
- Local scanner shows 7x7 grid centered on player position

**UI Components:**
- Local Scanner: 7x7 sector grid with trading post indicators
- Trading Interface: Single "Execute Trade" button with efficiency display
- Ship Upgrade Panel: Purchase ships at StarPorts (5k/15k credits)
- Cargo Upgrade Panel: Buy cargo holds at StarPorts/Commercial Hubs
- Direct Navigation: Enter sector number to auto-navigate
- Long Range Scanner: Find trading posts within 10 sectors

### Energy & Ship System

**Ship Configuration:**
All ship types, their characteristics, and upgrade limits are defined in `shipTypes` within `game-config.ts`.

**Cargo Hold Upgrades:**
Upgrade mechanics and costs are configured in `cargoUpgradeConfig` within `game-config.ts`.

**Energy System:**
Energy costs, regeneration rates, and maximum energy are configured in `energyConfig` within `game-config.ts`.

### Trading System

**Simplified Information Brokerage:**
- Single "Execute Trade" action at all trading posts
- Trading posts sell market intelligence/data rather than physical goods
- No inventory management - pure credit-based transactions

**Trading Post Configuration:**
All trading post types, base profits, and descriptions are defined in `tradingPosts` within `game-config.ts`.

**Efficiency & Regeneration:**
Trading efficiency decay and regeneration mechanics are configured in `tradeConfig` within `game-config.ts`.
- Profit calculation: Base × Efficiency × ShipMultiplier × (1 + CargoBonus)

## Coding Standards

**File Size Limit:**
- Keep all files under 250 lines of code
- Files over 300 lines should be refactored to separate concerns
- Split large files by logical boundaries (game logic, networking, data structures)

**Error Handling Philosophy:**
- Avoid defensive null checks everywhere
- Let code fail fast rather than masking issues with null guards
- Only handle exceptions for scenarios truly outside our control (network failures, user input)
- Fix root causes rather than patching symptoms with defensive code

## CRITICAL: Multiplayer Systems Analysis (MANDATORY)

**Before implementing ANY multiplayer mechanic, you MUST complete this analysis:**

### 1. Resource Contention Analysis
- **Question**: "What happens when 10+ players compete for this shared resource?"
- **Requirement**: Model worst-case depletion scenarios
- **Example**: If trading posts take 24 hours to regenerate and efficiency is shared, most players will log in to find everything depleted by earlier players

### 2. Asynchronous Play Patterns
- **Question**: "Map player experiences across different login times"
- **Requirement**: Verify that Player #10 logging in at hour 23 still has engaging gameplay
- **Red Flag**: If only players who log in at specific times get good experiences

### 4. Multiplayer Systems Validation Checklist
Before implementing ANY shared system:
- [ ] Modeled resource depletion under realistic player load
- [ ] Ensured shared resources regenerate appropriately for player count

**FAILURE TO COMPLETE THIS ANALYSIS WILL RESULT IN FUNDAMENTAL DESIGN FLAWS REQUIRING MAJOR REWORK**

## CRITICAL: Constraint Validation Protocol (MANDATORY)

**Before proposing ANY solution to a problem, you MUST challenge all constraints:**

### 1. Identify All Numerical Parameters
- **Question**: "What numerical values or limits exist in the current system?"
- **Requirement**: List all hardcoded numbers, sizing parameters, and limits
- **Example**: `gridSize = 5`, `gridHeight = 4`, regeneration timers, resource caps

### 2. Classify Constraints vs. Arbitrary Choices
- **Question**: "Is this number a technical requirement or an arbitrary starting value?"
- **Requirement**: Distinguish between real constraints (technical limits, UI bounds) and implementation choices
- **Red Flag**: Treating initial development values as immutable constraints

### 3. Scale Testing
- **Question**: "What happens if I change this parameter by 2x, 5x, 10x?"
- **Requirement**: Before proposing complex solutions, test if simple parameter scaling solves the problem
- **Example**: If resource scarcity is the issue, can we just add more resources?

### 4. Constraint Challenge Checklist
Before implementing ANY solution:
- [ ] Identified all numerical parameters affecting the problem
- [ ] Verified which are real constraints vs. arbitrary choices  
- [ ] Tested if scaling parameters solves the problem more simply
- [ ] Confirmed proposed solution is simpler than parameter adjustment
- [ ] Documented why parameter scaling was rejected (if applicable)

**FAILURE TO CHALLENGE CONSTRAINTS WILL RESULT IN OVER-ENGINEERING SOLUTIONS TO ARTIFICIAL PROBLEMS**

### 5. Extended Constraint Types to Challenge
**Beyond numerical parameters, also question:**
- **Technology choices**: Is the current tech stack required or just what was initially chosen?
- **Architecture decisions**: Is client-server required or could P2P/other patterns work?
- **File organization**: Is current structure required or just how someone organized it?
- **UI/UX patterns**: Is current interface design required or just one implementation?
- **Feature scope**: Are current game boundaries fixed or expandable?

### 6. Root Cause Validation
- **Always ask**: "Why does this problem exist in the first place?"
- **Before complex solutions**: "Can we eliminate the root cause instead of treating symptoms?"
- **Example**: Instead of "fix resource scarcity with complex algorithms," ask "why is there scarcity?"

## Bot Testing Requirements (CRITICAL)

**Bots Must Only Use Real Player Capabilities:**
- Bots can only see 7x7 local grid (3 sectors in each direction) like real players
- Bots can only move to adjacent sectors OR use auto-navigation within local view
- Bots cannot access universe-wide data or perform impossible navigation
- Bots should simulate realistic player decision-making (profit thresholds, energy management, migration patterns)
- **Before implementing any bot behavior, verify a real player can perform the same action through the web interface**

**Smart Bot Behaviors (Realistic):**
- Migrate away from crowded spawn areas when no trading posts found
- Use auto-navigation for sectors within local view (like clicking on sector in UI)
- Stop trading when efficiency drops below profitable thresholds
- Explore systematically rather than randomly when looking for opportunities

## Key Implementation Details

**Game Configuration:**
All game balance values (energy costs, ship stats, trading post profits, universe size, etc.) are centralized in `src/game-config.ts`. When modifying game mechanics, update the configuration file rather than hardcoding values.

**Type Safety:**
Ensure all string literals use the appropriate enums from `types.ts`. New features should follow the existing pattern of type-safe enums and comprehensive interfaces for client-server communication.

**Frontend Updates:**
The frontend automatically updates energy display every 10 seconds and synchronizes with server state changes. Trading post generation occurs once at server startup.

**Code Organization:**
When adding new features, consider file size limits and split concerns into separate modules when approaching the 250-line threshold.