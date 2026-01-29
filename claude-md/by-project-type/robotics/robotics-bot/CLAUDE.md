# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

daphbot-due is a robotics project built on the [basic_bot framework](https://github.com/littlebee/basic_bot). It's a security/monitoring robot with computer vision that detects people, cats, and dogs, then performs behaviors like tracking, recording video, and "dancing" to deter pets. The robot has pan/tilt servo controls and runs on a Raspberry Pi 5 with a 5" round display.

## Architecture

The system uses a microservices architecture managed by the basic_bot framework:

### Python Services (defined in basic_bot.yml)
- **central_hub**: Message hub for inter-service communication
- **web_server**: Serves the React webapp and handles HTTP requests
- **servo_control**: Controls pan/tilt servos via PCA9685 controller
- **vision**: Computer vision using TensorFlow Lite for object detection
- **system_stats**: System monitoring and statistics
- **daphbot**: Main behavior logic (src/daphbot_service.py) - handles pet detection, tracking, and responses
- **onboard_ui**: Pygame-based UI for the 5" display (src/onboard_ui_service.py)

### Frontend Components
- **webapp/**: React/TypeScript webapp for remote control and monitoring
- **src/onboard_ui/**: Pygame-based UI components for the physical display

### Key Modules
- **src/commons/**: Shared utilities for tracking, audio, messaging, and data processing
- **src/daphbot_service.py**: Main service that orchestrates pet detection and responses
- **src/onboard_ui_service.py**: Service managing the physical display interface

## Development Commands

### Building
```bash
# Build webapp and install dependencies
./build.sh
```

### Testing
```bash
# Run all tests (Python + webapp)
./test.sh

# Run Python tests only
python -m pytest -vv tests/

# Run webapp tests only
cd webapp && npm run test
```

### Webapp Development
```bash
cd webapp

# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint
```

### Python Environment Setup
```bash
# Create virtual environment
python -m venv bb_env
source bb_env/bin/activate

# Install dependencies
python -m pip install -r requirements.txt
```

### Running Services
Services are managed by the basic_bot framework using the configuration in `basic_bot.yml`. Individual services can be started using the framework's CLI.

## Code Organization

### State Management
The system uses a centralized state hub where services publish and subscribe to specific state keys:
- `recognition`: Object detection results from vision service (people, cats, dogs)
- `primary_target`: Current target being tracked (published by daphbot service)
- `servo_angles`: Current servo positions
- `daphbot_mode`: Operating mode (autonomous vs manual)

### Key Files
- `src/daphbot_service.py`: Core object detection and response logic (people, pets)
- `src/commons/track_target.py`: Servo tracking algorithms
- `src/commons/dance.py`: Pet deterrent behaviors
- `webapp/src/App.tsx`: Main React application
- `webapp/src/util/hubState.ts`: Frontend state management
- `basic_bot.yml`: Service configuration and orchestration

The codebase follows the basic_bot framework patterns for service communication via WebSocket messages and centralized state management.

## Code Guidelines (really more "suggestions" from the human)

1. when importing constants.py use `from commons import constants as c`. reason: I'm not a big fan of making person or AI type out `constants.` everywhere they need a constant.  I also don't see the value in forcing each individual const to be imported like `from common.constants import BB_WHATEVER`.  Import once as `c` and then just `c.BB_WHATEVER`.  This guidence may only apply to heavily used imports like constants.py
2. when importing basic_bot.commons.constants.py use `from commons import basic_bot_commons.constants as bbc`.
3. use `import basic_bot.commons.log` functions to write to the log files instead of Python's `logger`. Note that there is currently no `log.warning` - for now, use `log.error` or `log.info` to warn.


