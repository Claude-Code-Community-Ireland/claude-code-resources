# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static HTML/CSS/JavaScript academic portfolio website for Pedram Jahangiry, Professional Practice Associate Professor at Utah State University. The site is hosted on GitHub Pages and showcases research, teaching, interactive tools, and professional background.

## Development Commands

### Local Development Server
Since this is a static site, serve it locally using one of these methods:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (if available)
npx serve .
```

Then visit `http://localhost:8000` in your browser.

### No Build Process
This is a pure static site with no build tools, package managers, or compilation steps. All files are served directly as written.

## Site Architecture

### Multi-Page Structure
- `index.html` - Homepage with hero section, about, and highlights
- `visualizations.html` - Interactive tools and data visualizations  
- `teaching.html` - Course information and teaching materials
- `projects.html` - Research projects and Analytics Solutions Center work
- `contact.html` - Contact information and social links
- `Interactive_tools/` - Directory containing standalone HTML visualizations

### Shared Components
All pages follow a consistent structure:
- Fixed navigation bar with responsive hamburger menu
- Shared footer with social links and copyright
- Common styling from `styles.css`
- Shared JavaScript functionality from `script.js`

### Navigation System
The navigation is implemented in `script.js` with:
- Mobile-responsive hamburger menu
- Active page highlighting
- Smooth scrolling for anchor links
- Scroll-based navbar styling changes
- Click-outside-to-close functionality

## Technical Implementation

### CSS Architecture
- Mobile-first responsive design
- CSS Grid and Flexbox for layouts
- Custom CSS properties for consistency
- Breakpoints: 480px (mobile), 768px (tablet), 1024px+ (desktop)
- Inter font family from Google Fonts
- Font Awesome icons via CDN

### JavaScript Functionality
Key functions in `script.js`:
- `initializeNavigation()` - Handles mobile menu and scroll effects
- `initializeAnimations()` - Intersection Observer for fade-in effects and hover interactions
- `initializeContactForm()` - Social card hover effects
- `handleResponsiveGrid()` - Dynamic grid adjustments

### External Dependencies (CDN)
- Google Fonts (Inter font family)
- Font Awesome 6.0.0 for icons
- D3.js v7 for data visualizations (visualizations.html only)
- Plotly.js v2.27.0 for exponential smoothing visualizations (m3_ets directory)

### Image Assets
- `images/pedram.jpg` - Profile photo used on homepage
- All images should be optimized for web use

## Interactive Features

### Visualizations Page
Uses D3.js for interactive data visualizations. The page loads D3.js from CDN and implements custom visualizations for educational purposes.

### Animation System
- Intersection Observer API for scroll-triggered animations
- CSS transitions for smooth hover effects
- Card hover animations with transform effects
- Page load animation system

### Responsive Behavior
- Grid layouts automatically adjust based on screen size
- Navigation switches to hamburger menu on mobile
- Typography scales appropriately across devices
- Touch-friendly interface elements

## Interactive Visualizations Management

### Interactive_tools Directory Structure
The `Interactive_tools/` folder contains standalone HTML files for interactive educational visualizations:

```
Interactive_tools/
├── random-walk-teaching-tool.html      # Random walk visualizer with CLT demonstration
├── stationarity-visualizer.html        # Time series stationarity teaching tool
├── m3_ets/                             # Exponential smoothing methods directory
│   ├── ses/
│   │   ├── ses_interactive_visualization.html    # Simple Exponential Smoothing
│   │   └── ses_explain.txt                       # Teaching notes and parameter guide
│   ├── holt_linear_trend/
│   │   ├── holt_linear_trend_visualization.html  # Holt's Linear Trend Method
│   │   └── holt_linear_explanation.txt           # Teaching notes and parameter guide
│   └── holt_winter/
│       ├── holt_winters_visualization.html       # Holt-Winters Seasonal Method
│       └── holt_winter_explain.txt               # Teaching notes and parameter guide
├── m4_arima/                           # ARIMA models directory
│   ├── ar-ma-visualization.html                  # AR(1) & MA(1) Models Interactive Visualization
│   └── sarima-visualization.html                 # SARIMA Model with Airline Passenger Data
├── m5_ml/                              # Machine Learning models directory
│   ├── dt-regression-visualization.html          # Decision Tree Regression for Time Series
├── m6_dl/                              # Deep Learning models directory
│   └── dnn-timeseries-visualization.html         # DNN Time Series Forecasting
├── m7_rnn/                             # Recurrent Neural Networks directory
│   └── rnn-vs-dnn-timeseries-visualization.html  # RNN vs DNN Comparison for Time Series
└── [original].tsx                      # Original TSX files (kept for reference)
```

### Standalone HTML Approach
**Design Philosophy**: All interactive tools are implemented as standalone HTML files to:
- Maintain static site architecture (no build process required)
- Ensure long-term reliability and independence from external services
- Provide professional presentation integrated with the academic portfolio
- Enable full customization and branding consistency

### Visualization Features
Each standalone visualization includes:
- **D3.js integration** for interactive charts with hover tooltips
- **Professional styling** matching the main site design
- **Responsive design** for all device types
- **Educational controls** for parameter adjustment
- **Academic branding** with author attribution and site links
- **Independent tooltip systems** for multi-chart interfaces

### Converting Claude Artifacts to Standalone HTML
When migrating visualizations from Claude artifacts:

1. **Extract core functionality** from TSX/React components
2. **Convert to vanilla JavaScript** using D3.js for charts
3. **Implement standalone styling** using CSS (avoid framework dependencies)
4. **Add interactive tooltips** with chart-specific positioning
5. **Integrate branding** (header links, attribution, styling consistency)
6. **Test responsiveness** across devices and screen sizes
7. **Update visualizations.html** links to point to local files

### Tooltip Implementation Details
Interactive charts use D3.js with:
- **Chart-specific tooltips** (`#tooltip-{chartType}`) to avoid cross-chart interference
- **Hover lines and circles** for precise data point identification
- **Real-time positioning** calculated relative to each chart container
- **Multi-series support** showing all series values at the current time point
- **Smooth show/hide animations** for professional user experience

## Exponential Smoothing Teaching Suite (m3_ets)

### Overview
The `m3_ets/` directory contains a comprehensive suite of three interactive visualizations for teaching exponential smoothing methods progressively:

1. **Simple Exponential Smoothing (SES)** - Level-only smoothing
2. **Holt's Linear Trend Method** - Level + Trend components  
3. **Holt-Winters Seasonal Method** - Level + Trend + Seasonal components

### Educational Design Philosophy
- **Progressive Complexity**: Students learn SES → Holt → Holt-Winters to understand how each method builds upon the previous
- **Parameter Focus**: Each visualization emphasizes understanding α, β*, and γ parameters through interactive controls
- **Mathematical Transparency**: Step-by-step calculations shown during animation to demystify the algorithms
- **Real Data**: Uses classic airline passenger dataset to demonstrate model limitations and appropriate applications

### Technical Implementation

#### Visualization Technology
- **Plotly.js v2.27.0** for interactive charts with professional quality
- **Vanilla JavaScript** for educational controls and step-by-step animation
- **Consistent Styling** across all three methods for seamless learning progression
- **Responsive Design** ensuring accessibility across all devices

#### Key Features Per Visualization

**Simple Exponential Smoothing (SES)**:
- Interactive α parameter control (0.01 to 0.99)
- Real-time level evolution chart starting from ℓ₀ at time 0
- Step-by-step animation showing forecast equation: ŷ_{t+h|t} = ℓ_t
- Educational insights on when α approaches 1.0 (model inadequacy signal)
- Parameter guide explaining stability vs responsiveness trade-offs

**Holt's Linear Trend Method**:
- Dual parameter controls: α (level) and β* (trend)
- Multi-chart display: main forecast + level evolution + trend evolution
- Demonstrates forecast equation: ŷ_{t+h|t} = ℓ_t + h·b_t
- Shows component independence and initialization effects
- Parameter combinations guide (high α + low β*, etc.)

**Holt-Winters Seasonal Method**:
- Triple parameter controls: α (level), β* (trend), γ (seasonal)
- Four-chart interface: main forecast + level + trend + seasonal factors
- Complete forecast equation: ŷ_{t+h|t} = ℓ_t + h·b_t + s_{t+h-m(k+1)}
- Deseasonalization process visualization
- Seasonal pattern evolution and adaptation controls

#### Consistent Header Branding
All visualizations include standardized academic branding:
- **Attribution**: "Created by Dr. Pedram Jahangiry | Enhanced with Claude"
- **Navigation Links**: Website, YouTube Channel, GitHub Profile with hover effects
- **Professional Styling**: Gradient backgrounds, consistent color schemes
- **Academic Integration**: Links back to main portfolio site

#### Interactive Parameter Guides
Each visualization includes comprehensive parameter education sections:
- **Color-coded explanations** for different parameter ranges
- **Mathematical intuition** behind exponential weighting
- **Practical implications** of parameter choices
- **Warning signals** for inappropriate model selection
- **Visual examples** of parameter effects on forecasting behavior

### Educational Impact
- **Hands-on Learning**: Students manipulate parameters and immediately see effects
- **Mathematical Understanding**: Equations come alive through step-by-step animation
- **Model Selection Skills**: Clear demonstration of when each method is appropriate
- **Parameter Tuning Intuition**: Understanding trade-offs between stability and responsiveness
- **Professional Presentation**: Publication-quality visualizations suitable for academic use

### File Organization
Each method maintains consistent structure:
- **HTML Visualization**: Complete standalone educational tool
- **Text Guide**: Detailed teaching notes and parameter explanations
- **Consistent Naming**: Clear file naming for easy navigation and maintenance

## ARIMA Models Suite (m4_arima)

### Overview
The `m4_arima/` directory contains interactive visualizations for teaching ARIMA (AutoRegressive Integrated Moving Average) models, the foundation of modern time series forecasting:

1. **AR(1) & MA(1) Models** - Building blocks of ARIMA
2. **SARIMA Model** - Seasonal ARIMA with airline passenger data

### Educational Design Philosophy
- **Progressive Learning**: Students learn AR and MA components before SARIMA
- **Parameter Focus**: Interactive controls for all ARIMA parameters (p,d,q) and seasonal parameters (P,D,Q,m)
- **Real Data Examples**: Classic datasets demonstrating appropriate model applications
- **Mathematical Transparency**: Clear equations and forecasting logic

### Technical Implementation

#### Visualization Technology
- **Plotly.js v2.27.0** for professional interactive charts
- **Vanilla JavaScript** with educational approximations of SARIMA forecasting
- **Custom Canvas rendering** for AR/MA visualizations
- **Responsive Design** ensuring accessibility across all devices

#### Key Features Per Visualization

**AR(1) & MA(1) Models Visualization**:
- Interactive parameter controls for φ (phi) and θ (theta)
- Dual-model comparison showing AR uses past values vs MA uses past errors
- Real-time forecast generation with adjustable horizon
- Educational insights on stationarity and invertibility conditions
- Visual demonstration of how forecasts decay to mean differently

**SARIMA Model Visualization (Airline Passengers)**:
- Classic airline passenger dataset (1949-1960, 144 monthly observations)
- Full SARIMA parameter controls: (p,d,q)(P,D,Q)ₘ
- Default to optimal model: **SARIMA(1,1,0)(0,1,0)₁₂**
- Interactive demonstration of:
  - **d**: Regular differencing for trend removal
  - **D**: Seasonal differencing for seasonality removal
  - **p**: AR(1) short-term autocorrelation
  - **P, Q**: Seasonal AR/MA effects
- Forecast horizon adjustable from 12-60 months
- Real-time model notation display

#### Educational Parameter Effects
The SARIMA visualization demonstrates:
- **d=0**: Flat forecast (no trend projection)
- **d=1**: Linear trend continuation (optimal)
- **d=2**: Smoother trend
- **D=0**: Seasonal pattern decays over time
- **D=1**: Seasonal growth continues (optimal)
- **P>0**: Amplifies seasonal peaks/troughs
- **Q>0**: Smooths seasonal fluctuations
- **p>0**: Adds short-term AR "momentum"
- **q>0**: Overall forecast smoothing

#### Optimal Model Explanation
**SARIMA(1,1,0)(0,1,0)₁₂** is optimal for airline data because:
- **Parsimonious**: Uses minimal parameters (principle of parsimony)
- **d=1**: First differencing removes upward trend
- **D=1**: Seasonal differencing removes 12-month cycles
- **p=1**: Captures short-term autocorrelation
- **P=0, Q=0**: Seasonal differencing alone handles seasonality efficiently

### Consistent Header Branding
All ARIMA visualizations include standardized academic branding:
- **Attribution**: "Created by Dr. Pedram Jahangiry | Enhanced with Claude"
- **Navigation Links**: Website, YouTube Channel, GitHub Profile with hover effects
- **Professional Styling**: Purple gradient backgrounds, consistent color schemes
- **Academic Integration**: Links back to main portfolio site

## Machine Learning Models Suite (m5_ml)

### Overview
The `m5_ml/` directory contains interactive visualizations for teaching machine learning models applied to time series forecasting:

1. **Decision Tree Regression** - Understanding how tree-based models partition feature space for forecasting

### Educational Design Philosophy
- **Visual Understanding**: Interactive tree structure visualization showing decision nodes and leaf predictions
- **Feature Space Exploration**: 2D scatter plot with decision boundaries to visualize how trees partition data
- **Multi-step Forecasting**: Demonstrates recursive forecasting and its limitations with tree-based models
- **Parameter Sensitivity**: Interactive controls for tree depth and forecast horizon

### Technical Implementation

#### Visualization Technology
- **Plotly.js v2.27.0** for interactive scatter plots and time series charts
- **SVG rendering** for custom tree structure visualization
- **Vanilla JavaScript** with custom Decision Tree implementation from scratch
- **Responsive Design** with dynamic tree sizing based on depth

#### Key Features

**Decision Tree Regression Visualization**:
- **Interactive tree depth control** (1-10 levels) to explore model complexity
- **Forecast horizon control** (1-36 months) for multi-step ahead predictions
- **Tree structure visualization** with interactive hover tooltips showing:
  - Decision nodes: Split conditions and feature descriptions
  - Leaf nodes: Final predictions with detailed explanations
  - Visual feedback on hover (brightening and border highlighting)
- **Feature space plot** showing Lag_1 vs Lag_2 with decision boundaries:
  - Red dashed lines for Lag_1 splits (vertical boundaries)
  - Blue dashed lines for Lag_2 splits (horizontal boundaries)
  - Color-coded scatter points by passenger count
- **Time series forecast plot** displaying:
  - Actual historical data (blue solid line)
  - In-sample predictions (pink dashed line)
  - Future forecasts (red dotted line)
- **Dynamic tree sizing**: Automatically adjusts node size, spacing, and font for deeper trees

#### Educational Insights
The visualization demonstrates key limitations of Decision Trees for time series:
- **Constant leaf predictions**: Each region outputs a single average value
- **No trend extrapolation**: Cannot predict beyond training data range
- **Flat long-term forecasts**: Recursive predictions converge to constant values
- **Feature engineering needs**: Requires careful lag selection and data transformation

#### Interactive Tooltip System
- **Fixed positioning** tooltips that follow mouse cursor
- **Node-specific information**:
  - Decision nodes: Split threshold, feature description, branch directions
  - Leaf nodes: Prediction value with explanation of averaging process
- **Visual feedback**: Nodes brighten on hover with thicker borders
- **High z-index** (10000) ensures tooltips always visible

### Consistent Header Branding
All ML visualizations include standardized academic branding:
- **Attribution**: "Created by Dr. Pedram Jahangiry | Enhanced with Claude"
- **Navigation Links**: SVG icons with gradient buttons for Website (purple), YouTube (red), GitHub (black)
- **Professional Styling**: Purple gradient backgrounds, consistent color schemes
- **Academic Integration**: Links back to main portfolio site

## Deep Learning Models Suite (m6_dl)

### Overview
The `m6_dl/` directory contains interactive visualizations for teaching deep neural networks (DNNs) applied to time series forecasting:

1. **DNN Time Series Forecasting** - Understanding how deep neural networks learn complex nonlinear patterns in sequential data

### Educational Design Philosophy
- **Architecture Exploration**: Interactive controls to configure network depth, width, and activation functions
- **Visual Network Representation**: Beautiful SVG-based neural network diagrams showing nodes and connections
- **Comparative Analysis**: Side-by-side comparison of DNN vs Linear Regression benchmark performance
- **Feature Importance**: Understanding which lagged features matter most through weight analysis
- **Training Transparency**: Live loss curve visualization showing model convergence in real-time

### Technical Implementation

#### Visualization Technology
- **TensorFlow.js v4.11.0** for building and training neural networks entirely in the browser
- **Plotly.js v2.27.0** for interactive loss curves and time series charts
- **Custom SVG rendering** for neural network architecture visualization
- **Vanilla JavaScript** with custom Linear Regression implementation for benchmarking
- **Fully client-side**: No backend required, all training happens in the browser

#### Key Features

**DNN Time Series Visualization**:
- **Comprehensive Parameter Controls**:
  - Number of lags (1-12): Controls input feature dimensionality
  - Forecast horizon (1-36 months): Multi-step ahead predictions
  - Number of hidden layers (1-4): Network depth configuration
  - Neurons per layer (4-128): Individual sliders for each layer width
  - Hidden layer activation: ReLU, Tanh, or Linear
  - Output layer activation: Linear or ReLU
  - Training epochs (50-500): User-controllable training duration
  - Optimizer: Adam (fixed) with MSE loss

- **Four Interactive Visualizations**:
  1. **Training Loss Curve**:
     - Shows training and validation loss over epochs
     - Live updates during training (every 10th epoch or proportionally)
     - Logarithmic scale for better visibility
     - Demonstrates convergence behavior

  2. **Neural Network Architecture Diagram**:
     - Beautiful SVG visualization with colored nodes by layer type
     - Green nodes for input layer, purple for hidden layers, red for output
     - Semi-transparent connection lines between all layers
     - Interactive hover effects (nodes enlarge on mouseover)
     - Smart rendering for large networks (shows up to 10 nodes per layer with ellipsis for larger)
     - Layer labels and neuron counts displayed below each column
     - Intelligent connection sampling for visual clarity with many neurons

  3. **Feature Importance (First Layer Weights)**:
     - Bar chart showing average absolute weights for each lag feature
     - Identifies which historical time steps are most influential
     - Helps understand temporal dependencies learned by the model

  4. **Time Series Predictions**:
     - Comprehensive multi-series plot showing:
       - Actual training data (blue solid line)
       - Actual test data (black solid line)
       - DNN training predictions (purple dashed line)
       - DNN test predictions (red dashed line)
       - Linear Regression training predictions (gray dotted line)
       - Linear Regression test predictions (darker gray dotted line)
       - Future forecasts beyond test set (green dotted line)
     - Clear visual comparison of DNN vs benchmark performance

- **Performance Metrics Display**:
  - **Training Set Metrics**: MSE, RMSE, MAE for both DNN and Linear Regression
  - **Test Set Metrics**: MSE, RMSE, MAE for both DNN and Linear Regression
  - **Color-coded highlighting**: Better performing model shown in green
  - **Real-time updates**: Metrics computed and displayed after each training run

#### Data Configuration
- **Dataset**: Classic airline passenger data (1949-1960, 144 months total)
- **Training Set**: First 120 months (1949-1958)
- **Test Set**: Last 24 months (1959-1960)
- **Validation Split**: 10% of training data used for validation during training
- **All data embedded in JavaScript**: No external dependencies or API calls required

#### Neural Network Architecture Details
- **Sequential model** with configurable depth (1-4 hidden layers)
- **Dense layers** with user-selectable activation functions
- **Adam optimizer** with default learning rate
- **Mean Squared Error (MSE)** loss function
- **Batch size**: 16 samples
- **Early convergence monitoring** through validation loss tracking

#### Educational Insights
The visualization demonstrates critical concepts for DNNs in time series:
- **When DNNs outperform linear models**: Nonlinear patterns, feature interactions
- **Architecture trade-offs**: Depth vs width, complexity vs interpretability
- **Activation function impact**: ReLU (piecewise linear), Tanh (smooth nonlinear), Linear (no transformation)
- **Overfitting detection**: Comparing training vs validation loss curves
- **Training duration effects**: How more epochs improve learning but may overfit
- **Feature engineering importance**: Impact of lag selection on model performance
- **Recursive forecasting behavior**: How multi-step predictions propagate errors

#### User Workflow
1. User adjusts network architecture parameters (layers, neurons, activations)
2. User sets number of lags and training epochs
3. User clicks "Train Model" button
4. Model trains with live loss updates (~2-10 seconds depending on epochs)
5. All four visualizations update automatically
6. User compares DNN vs Linear Regression metrics
7. User iterates to explore different configurations

### Consistent Header Branding
All deep learning visualizations include standardized academic branding:
- **Attribution**: "Created by Dr. Pedram Jahangiry | Enhanced with Claude"
- **Navigation Links**: SVG icons with gradient buttons for Website (purple), YouTube (red), GitHub (black)
- **Professional Styling**: Purple gradient backgrounds, consistent color schemes
- **Academic Integration**: Links back to main portfolio site

### File Organization
```
m6_dl/
└── dnn-timeseries-visualization.html    # Complete standalone DNN visualization
```

## Recurrent Neural Networks Suite (m7_rnn)

### Overview
The `m7_rnn/` directory contains interactive visualizations comparing Recurrent Neural Networks (RNNs) and Dense Neural Networks (DNNs) for time series forecasting:

1. **RNN vs DNN Comparison** - Understanding how data preprocessing requirements differ between architectures

### Educational Design Philosophy
- **Comparative Learning**: Side-by-side training and evaluation of RNN vs DNN architectures
- **Preprocessing Awareness**: Interactive toggle demonstrating the critical impact of data preprocessing on RNN performance
- **Architecture Understanding**: Visual comparison showing when DNNs excel vs when RNNs shine
- **Real-time Training**: Live loss curves and metrics to observe model convergence behavior

### Technical Implementation

#### Visualization Technology
- **TensorFlow.js v4.11.0** for building and training both RNN and DNN models in the browser
- **Plotly.js v2.27.0** for interactive loss curves and time series forecast charts
- **Vanilla JavaScript** with custom preprocessing functions (log transformation + differencing)
- **Fully client-side**: No backend required, all training and comparison happens in the browser

#### Key Features

**RNN vs DNN Comparison Visualization**:
- **Detailed Educational Explanation**: "What's Going On? Is RNN Failing?" section explaining:
  - DNNs and Feature Representation (independent features, pattern mapping, no temporal dynamics)
  - RNNs and Sequential Data (sequential processing, need for stationarity)
  - Conclusion on model choice and preprocessing dependencies

- **Separated Configuration Controls**:
  - **Shared Configuration**: Data preprocessing toggle (raw vs log + differencing), training epochs (50-300)
  - **DNN Configuration** (blue section):
    - Number of lags / Input features (3-24): Treats lags as independent features
    - Hidden Layer 1 units (8-64)
    - Hidden Layer 2 units (8-64)
  - **RNN Configuration** (orange section):
    - Sequence length / Memory window (3-24): How far back RNN looks
    - RNN units / Memory depth (8-64): Capacity of hidden state memory

- **Four Interactive Visualizations**:
  1. **Model Architecture Summary Tables**:
     - Side-by-side DNN and RNN architecture displays
     - Shows each layer type, output shape, and parameter count
     - Total trainable parameters highlighted
     - Helps understand model complexity differences

  2. **Training Loss Curves**:
     - DNN training and validation loss (blue solid/dashed lines)
     - RNN training and validation loss (orange solid/dashed lines)
     - Logarithmic scale for better visibility
     - Side-by-side convergence comparison

  3. **Time Series Predictions Comparison**:
     - Training data (gray solid line)
     - Actual test data (black solid line)
     - DNN predictions (blue solid line)
     - RNN predictions (orange solid line)
     - Clean, readable solid lines for clarity

  4. **Performance Metrics Cards**:
     - DNN metrics: MAPE, RMSE, training time
     - RNN metrics: MAPE, RMSE, training time
     - Winner card: Highlights best-performing model
     - Color-coded highlighting (green for better values)

#### Data Configuration
- **Dataset**: Classic airline passenger data (1949-1960, 144 months total)
- **Training Set**: First 120 months (dynamically adjusted based on lags)
- **Test Set**: Last 12 months for out-of-sample evaluation
- **Preprocessing Pipeline**:
  - Log transformation: `log(x)` to stabilize variance
  - First-order differencing: `x[t] - x[t-1]` to remove trend
  - Inverse transformation: Automatically reverts predictions to original scale

#### Model Architecture Details
- **DNN Architecture**:
  - Input layer: Accepts numLags features (flattened sequence)
  - Hidden layer 1: User-configurable units (8-64) with ReLU activation
  - Hidden layer 2: User-configurable units (8-64) with ReLU activation
  - Output layer: Single linear unit
  - Optimizer: Adam with MSE loss

- **RNN Architecture**:
  - SimpleRNN layer: User-configurable units (8-64), returnSequences=false
  - Input shape: [numLags, 1] (sequence of univariate values)
  - Output layer: Single linear unit
  - Optimizer: Adam with MSE loss

#### Educational Insights
The visualization demonstrates critical concepts for comparing RNN vs DNN:
- **DNN architecture treats lags as independent features**: Uses 12 separate input features (lags), learning patterns from absolute values without sequential understanding
- **RNN architecture processes sequences temporally**: Uses sequence length of 12 timesteps with memory units that maintain hidden state across the sequence
- **Memory window vs memory depth**: Sequence length controls how far back to look; RNN units control the capacity of the temporal memory
- **Preprocessing transforms RNN performance**: Log + differencing makes data stationary, enabling RNN to excel at capturing temporal patterns
- **Model summaries reveal complexity**: Parameter count comparisons show how different architectures scale with configuration changes
- **Architecture choice vs preprocessing**: Sometimes proper preprocessing matters more than architecture complexity
- **Trade-offs**: DNNs are simpler and work out-of-the-box, RNNs require more careful preparation but capture sequential nature
- **Real-world lesson**: Understanding your data and model requirements is crucial for success

#### Key Learning Outcome
**The visualization's main educational message**:
- With **raw data**: DNN typically outperforms RNN (DNNs handle levels well)
- With **stationary data** (log + differencing): RNN matches or exceeds DNN (RNNs capture temporal patterns effectively)
- **Conclusion**: Architecture selection must consider data characteristics and preprocessing requirements

#### User Workflow
1. User starts with default settings (raw data, both models use 12 lags/sequence length, 100 epochs)
2. User reviews the educational explanation about DNN vs RNN differences
3. User clicks "Train Both Models" to train DNN and RNN simultaneously
4. **Observe model summaries** showing architecture details and parameter counts
5. Observe DNN outperforming RNN on raw data (via metrics and plots)
6. User toggles preprocessing to "Log + Differencing"
7. User clicks "Train Both Models" again
8. Observe RNN performance dramatically improving, often matching/exceeding DNN
9. User experiments with different configurations:
   - Adjust DNN lags (input features) independently
   - Adjust RNN sequence length (memory window) independently
   - Modify hidden layer sizes and RNN units
   - Compare training times and parameter counts
10. User compares loss curves, predictions, and metrics to understand convergence behavior and model trade-offs

### Consistent Header Branding
All RNN visualizations include standardized academic branding:
- **Attribution**: "Created by Dr. Pedram Jahangiry | Enhanced with Claude"
- **Navigation Links**: SVG icons with gradient buttons for Website (purple), YouTube (red), GitHub (black)
- **Professional Styling**: Purple gradient backgrounds, consistent color schemes
- **Academic Integration**: Links back to main portfolio site

### File Organization
```
m7_rnn/
└── rnn-vs-dnn-timeseries-visualization.html    # Complete standalone RNN vs DNN comparison
```

## Content Management

### Adding New Pages
When creating new pages:
1. Copy the HTML structure from an existing page
2. Update the `<title>` and page-specific content
3. Ensure navigation links are updated in all pages
4. Add appropriate active class to current page nav link

### Updating Styles
- Global styles are in `styles.css`
- Use existing CSS custom properties for consistency
- Follow the established naming conventions
- Test responsive behavior across breakpoints

### Interactive Tools
When adding new interactive visualizations:
- Create standalone HTML files in the `Interactive_tools/` directory or appropriate subdirectory
- Use D3.js or Plotly.js from established CDNs based on visualization complexity
  - **D3.js v7**: For custom interactive charts with advanced tooltip systems
  - **Plotly.js v2.27.0**: For professional statistical visualizations with multiple chart types
- Follow the existing styling patterns and responsive design principles
- Implement consistent header branding with attribution and navigation links
- Include comprehensive parameter guides with educational content
- Add proper error handling and educational controls
- Update `visualizations.html` to link to the new local file with appropriate descriptions
- Test interactive features and responsiveness across different devices
- For educational visualizations, include step-by-step animations and mathematical transparency
- Organize complex visualization suites in subdirectories (e.g., `m3_ets/` for exponential smoothing)

## GitHub Pages Deployment

The site auto-deploys from the main branch to GitHub Pages. No special deployment process is needed - changes pushed to main are automatically live.

### URL Structure
- Primary domain: `https://pjalgotrader.github.io`
- All pages accessible via direct URLs (e.g., `/teaching.html`)
- Interactive tools accessible at `/Interactive_tools/[filename].html`
- Static assets served from root directory
- Links in `visualizations.html` point to local Interactive_tools files for reliability