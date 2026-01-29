# SignGen - Parametric Sign Generator for 3D Printing

## Project Status: v1.0.4 - COMPLETE & DEPLOYED ✅

**GitHub Repository**: https://github.com/maxwhitby/signgen
**Current Version**: 1.0.4
**Last Updated**: September 28, 2024

## Project Overview
A fully-functional desktop application for creating customizable two-color signs/labels for 3D printing, optimized for Bambu Lab P1S printers. The signs use a stencil-cut technique where text is cut out from the top layer, revealing the contrasting bottom layer color.

## Completed Features ✅

### Core Architecture (v1.0.0)
- **Modular Design**: Complete refactor with separated concerns
  - `src/sign_generator.py` - Core generation engine with CadQuery
  - `src/validators.py` - Comprehensive input validation and prediction
  - `src/config_manager.py` - Settings and preset management
  - `src/exceptions.py` - Custom exception hierarchy
  - `src/logger.py` - Centralized logging system
  - `src/gui.py` - Consolidated GUI with all features
  - `src/cli.py` - Full-featured command-line interface

### GUI Application (v1.0.2)
- **Real-time 2D Preview**: Updates instantly on ALL parameter changes (enhanced in v1.0.2)
- **Text Controls**:
  - Multi-line text input with live preview
  - Font selection (16 platform-specific sans-serif fonts)
  - Manual or automatic font sizing
  - Font size spinbox with immediate updates (fixed in v1.0.1)
- **Text Weight/Heaviness**:
  - 0-100 slider control
  - Preset buttons (Light/Regular/Bold/Extra Bold)
  - Simplified generation for reliability (improved in v1.0.2)
  - Consistent thickness between preview and generation (fixed in v1.0.1, refined in v1.0.2)
- **Dimension Controls**:
  - Width: 10-500mm
  - Height: 5-200mm
  - Bottom layer thickness: 0.2-5.0mm
  - Top layer thickness: 0.2-5.0mm
- **Advanced Features**:
  - Preset management (save/load/delete/rename)
  - Validation with warnings and error prevention
  - Configuration persistence
  - Debug mode toggle
  - Menu system (File, Edit, View, Help)
  - User guide and troubleshooting built-in

### Command-Line Interface
```bash
python -m src.cli "TEXT" [options]
  --width WIDTH             Sign width in mm (default: 100)
  --height HEIGHT           Sign height in mm (default: 25)
  --font FONT              Font family (default: Arial)
  --font-size SIZE         Font size in mm (auto if not specified)
  --heaviness WEIGHT       Text weight 0-100 (default: 50)
  --bottom-thickness MM    Bottom layer thickness (default: 1.0)
  --top-thickness MM       Top layer thickness (default: 1.0)
  --output-dir DIR         Output directory (default: output)
  --debug                  Enable debug logging
```

## Recent Fixes (v1.0.4)

1. **Fixed Preview vs. Generation Text Thickness Discrepancy**:
   - Root Cause: CadQuery's `text()` method supports font `kind` parameter ('regular', 'bold') that wasn't being utilized
   - Solution: Generator now uses `kind='bold'` for heaviness > 50 to match preview's bold font rendering
   - Adjusted size multipliers to account for bold font's natural thickness increase:
     - Light (0-25): 0.95x with regular font
     - Regular (26-50): 1.05x with regular font
     - Bold (51-75): 1.00x with bold font (reduced from 1.15x)
     - Extra Bold (76-100): 1.10x with bold font (reduced from 1.30x)
   - Preview updated to match generator's exact parameters
   - Result: Consistent text thickness between preview and generated STL files

## Previous Fixes (v1.0.3)

1. **Complete GUI Controls Responsiveness**:
   - All spinboxes now have command callbacks and KeyRelease bindings
   - Font dropdown properly bound with ComboboxSelected event
   - Every control triggers immediate preview updates
2. **Preview Panel Layout Fix**:
   - Fixed cropping issue with 25px right padding
   - Window width increased to 1400px
   - Canvas reduced to 400x400px for better fit
   - Symmetrical padding for professional appearance
3. **Preview Text Rendering Improvements**:
   - Better weight representation using bold font for heaviness > 50
   - Subtle overlays only for extra heavy text (>80)
   - Consistent with generator's size-based approach
4. **Preset Buttons Fixed**:
   - Radio buttons now properly control the slider
   - Correct lambda passing for text names
5. **Slider Sensitivity Refined**:
   - Reduced fine-tuning from 0.05 to 0.02
   - Smoother, more gradual transitions

## Previous Fixes (v1.0.2)

1. **Enhanced Real-Time Updates**: ALL controls now trigger instant preview updates
   - Added variable tracing for width, height, font, thickness controls
   - Improved text widget synchronization with StringVar
2. **Text Generation Stability**:
   - Switched to single-cut approach for all text weights
   - Eliminated geometry errors from multi-cut patterns
   - All weight levels generate successfully
3. **Refined Text Weight System** (Updated in v1.0.4):
   - Light: 0.95x with regular font
   - Regular: 1.05x with regular font
   - Bold: 1.00x with bold font
   - Extra Bold: 1.10x with bold font

## Previous Fixes (v1.0.1)

1. **Live Preview Updates**: Text preview now updates in real-time when typing
2. **Font Size Control**: Spinbox changes trigger immediate preview updates
3. **GUI Stability**: Fixed all method reference errors that caused startup failures

## Project Structure
```
signgen/
├── src/
│   ├── __init__.py          # Package init (v1.0.1)
│   ├── sign_generator.py    # Core generation engine
│   ├── gui.py              # Consolidated GUI application
│   ├── cli.py              # Command-line interface
│   ├── validators.py       # Input validation system
│   ├── config_manager.py   # Settings management
│   ├── exceptions.py       # Custom exceptions
│   └── logger.py           # Logging configuration
├── tests/
│   ├── test_validators.py  # Validator unit tests
│   └── test_config.py      # Config manager tests
├── legacy/                 # Old versions (archived)
├── output/                 # Generated STL files
├── example_output/         # Sample STL files
├── requirements.txt        # Python dependencies
├── setup.py               # Package setup
├── LICENSE                # MIT License
├── README.md              # Main documentation
├── CHANGELOG.md           # Version history
└── .gitignore            # Git ignore rules
```

## Technical Implementation

### Text Weight/Heaviness System
The heaviness parameter (0-100) controls text boldness through:

1. **Light (0-25)**:
   - Size multiplier: 0.95x
   - No offset patterns
   - Preview: Gray tinted text

2. **Regular (26-50)**:
   - Size multiplier: 1.05x (increased in v1.0.1)
   - No offset patterns (simplified in v1.0.1)
   - Preview: Black text

3. **Bold (51-75)**:
   - Size multiplier: 1.12x
   - 5-point offset pattern for thickness
   - Preview: Bold font with overlays

4. **Extra Bold (76-100)**:
   - Size multiplier: 1.25x
   - 9-point grid offset pattern
   - Preview: Bold font with maximum overlays

### Validation System
Pre-generation validation prevents failures by checking:
- Text not empty and reasonable length
- Dimensions within acceptable ranges
- Font size appropriate for sign size
- Prediction of text cutting through layers
- Aspect ratio sanity checks
- Layer thickness validation

### Key Algorithms

#### Auto Font Sizing
```python
# Font-specific width factors
font_widths = {
    'Impact': 0.45,
    'Arial': 0.55,
    'Arial Black': 0.65,
    # ... etc
}
width_factor = font_widths.get(font_family, 0.55)
width_factor += (heaviness / 100) * 0.15  # Adjust for heaviness

# Calculate based on constraints
max_text_width = width * 0.75  # Leave 25% margin
font_size_width = max_text_width / (len(text) * width_factor)
font_size_height = height * 0.6  # Leave 40% margin
font_size = min(font_size_width, font_size_height)
```

#### Cut-Through Prediction
The validator predicts if text will cut completely through the top layer using:
- Coverage ratio (cut area / sign area)
- Heaviness factor
- Font size relative to sign height
- Top layer thickness
- Returns: (will_cut_through: bool, confidence: 0-100%)

## Known Issues & Solutions

### Issue: Top layer STL not generated
**Cause**: Text has cut completely through the layer
**Solution**: Reduce font size, reduce heaviness, or increase top layer thickness

### Issue: Preview appearance vs generated model (Fixed in v1.0.1)
**Previous**: Preview showed thicker text than generated
**Solution**: Adjusted Regular weight to use 1.05x size multiplier

## Testing & Quality

### Automated Tests
- Unit tests for validators
- Unit tests for config manager
- Test framework ready for expansion

### Manual Testing Checklist
- [x] GUI launches without errors
- [x] Text preview updates on typing
- [x] Font size changes update preview
- [x] All fonts render correctly
- [x] Heaviness slider works smoothly
- [x] STL files generate successfully
- [x] Generated thickness matches preview
- [x] Validation prevents bad inputs
- [x] Presets save and load correctly
- [x] CLI generates files correctly

## Deployment

### Installation
```bash
# From GitHub
git clone https://github.com/maxwhitby/signgen.git
cd signgen
pip install -r requirements.txt

# Run GUI
python -m src.gui

# Run CLI
python -m src.cli "YOUR TEXT"
```

### Requirements
- Python 3.7+
- CadQuery 2.0+
- NumPy
- Trimesh
- Tkinter (included with Python)

## Future Enhancements (Potential)

1. **3D Preview**: Add matplotlib 3D view
2. **Web Interface**: Flask/FastAPI backend
3. **Batch Processing**: CSV import for multiple signs
4. **Advanced Text Effects**: Beveled edges, outlines
5. **Icon Support**: Pre-defined icon library
6. **Export Formats**: Support for 3MF, STEP
7. **Cloud Storage**: Save presets to cloud
8. **Bambu Studio Plugin**: Direct integration

## Context for Future Sessions

### Key Design Decisions
1. **Tkinter over PyQt**: Chosen for zero additional dependencies
2. **CadQuery for Generation**: Robust CAD kernel for accurate geometry
3. **Modular Architecture**: Easy to extend and maintain
4. **Text Widget vs StringVar**: Direct reading from Text widget for real-time updates
5. **Multi-cut Patterns**: Physical thickness through offset cuts

### Important Code Sections

#### Text Preview Update (src/gui.py:677-681)
```python
# Get text from Text widget if it exists, otherwise from StringVar
if hasattr(self, 'text_input'):
    text = self.text_input.get('1.0', 'end-1c').strip()
else:
    text = self.text_var.get()
```

#### Font Size Event Binding (src/gui.py:329-333)
```python
self.font_size_spinbox = ttk.Spinbox(
    ...
    command=lambda: self.on_parameter_changed()
)
# Also bind keyboard events for direct typing
self.font_size_spinbox.bind('<KeyRelease>', lambda e: self.on_parameter_changed())
```

### Files to Review for Context
1. `src/sign_generator.py` - Core generation logic
2. `src/gui.py` - GUI implementation
3. `src/validators.py` - Validation logic
4. `CHANGELOG.md` - Recent changes
5. `README.md` - User documentation

## Contact & Support
- **Repository**: https://github.com/maxwhitby/signgen
- **Issues**: https://github.com/maxwhitby/signgen/issues
- **Target Printer**: Bambu Lab P1S
- **Primary Use**: Workshop/equipment labeling

---
*Project successfully refactored, tested, and deployed. Ready for production use and future enhancements.*