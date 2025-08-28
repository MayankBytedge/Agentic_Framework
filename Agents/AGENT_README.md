# BytEdge AI Individual Agent System

## 🚗 Professional Conversational AI Agents

This system provides four specialized automotive engineering agents, each with their own dedicated interface and domain expertise:

- **ClutchEdge AI** ⚙️ - Clutch and drivetrain systems specialist
- **BatteryEdge AI** 🔋 - EV battery and energy systems expert  
- **FrameEdge AI** 🏗️ - Chassis and structural engineering assistant
- **TireEdge AI** 🛞 - Tire dynamics and performance specialist

## 🛠️ Setup Instructions

### 1. Prerequisites
- Python 3.8 or higher
- Google Gemini API key (free at makersuite.google.com)
- Modern web browser

### 2. Get Your Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key for configuration

### 3. Installation

#### Step 1: Install Dependencies
```bash
pip install -r agent-requirements.txt
```

#### Step 2: Configure API Key
```bash
# Option 1: Environment Variable
export GEMINI_API_KEY="your_api_key_here"

# Option 2: Create .env file
echo "GEMINI_API_KEY=your_api_key_here" > .env
```

#### Step 3: Run the Server
```bash
python agent-server.py
```

### 4. Access the Agents
- **Home Page**: http://localhost:5000
- **ClutchEdge**: http://localhost:5000/clutch-edge.html
- **BatteryEdge**: http://localhost:5000/battery-edge.html
- **FrameEdge**: http://localhost:5000/frame-edge.html
- **TireEdge**: http://localhost:5000/tire-edge.html

## 🎨 Features

### Individual Agent Interfaces
Each agent has a dedicated, professionally designed interface with:
- **Specialized branding** and color themes
- **Domain-specific quick topics** for easy exploration
- **Real-time conversational** AI powered by Google Gemini
- **Technical expertise** tailored to each automotive domain

### Advanced Capabilities
- **Context-aware conversations** with memory
- **Professional engineering responses** with calculations and specifications
- **Industry standards** and best practices integration
- **Responsive design** for all screen sizes
- **Real-time typing indicators** and smooth animations

## 🤖 Agent Specializations

### ClutchEdge AI ⚙️
**Expertise**:
- Clutch system design and optimization
- Torque transmission analysis
- Friction material selection (organic, ceramic, carbon)
- Dual-clutch and automated systems
- Drivetrain integration and performance

**Sample Questions**:
- "How does a dual-clutch transmission work?"
- "What factors affect clutch torque capacity?"
- "Compare wet vs dry clutch systems"

### BatteryEdge AI 🔋
**Expertise**:
- Battery management system design
- Thermal modeling and management
- Cell chemistry analysis (Li-ion, LFP, solid-state)
- Charging protocols and safety systems
- Energy optimization and range analysis

**Sample Questions**:
- "How does battery thermal management work in EVs?"
- "What are the differences between Li-ion and LFP batteries?"
- "Explain fast charging protocols and safety"

### FrameEdge AI 🏗️
**Expertise**:
- Vehicle chassis design and optimization
- Structural FEA and stress analysis
- Material selection (steel, aluminum, carbon fiber)
- Crash safety and energy absorption
- Weight reduction while maintaining stiffness

**Sample Questions**:
- "What are the key differences between unibody and body-on-frame construction?"
- "How do you optimize chassis stiffness while reducing weight?"
- "Compare aluminum vs steel for chassis materials"

### TireEdge AI 🛞
**Expertise**:
- Tire mechanics and construction design
- Contact patch and pressure analysis
- Traction optimization and grip modeling  
- Rolling resistance and efficiency
- Temperature and pressure effects on performance

**Sample Questions**:
- "How does tire compound affect grip and wear?"
- "Explain the relationship between contact patch and traction"
- "What factors influence rolling resistance in tires?"

## 🔧 Technical Architecture

### Frontend Components
- **Individual HTML pages** for each agent with specialized layouts
- **Professional CSS styling** with agent-specific themes and animations
- **JavaScript functionality** for real-time chat and user interaction
- **Responsive design** optimized for desktop and mobile

### Backend Infrastructure
- **Flask web server** with RESTful API endpoints
- **Google Gemini AI integration** with specialized agent prompts
- **Conversation history management** with context retention
- **Error handling** and health monitoring

### API Endpoints
- `GET /` - Home page with agent selection
- `GET /api/health` - System health check
- `GET /api/agents` - Available agents information
- `POST /api/chat/<agent_type>` - Chat with specific agent
- `POST /api/chat` - Generic chat endpoint

## 📁 File Structure
```
byteedge-agents/
├── clutch-edge.html        # ClutchEdge AI interface
├── battery-edge.html       # BatteryEdge AI interface  
├── frame-edge.html         # FrameEdge AI interface
├── tire-edge.html          # TireEdge AI interface
├── agent-styles.css        # Shared styling for all agents
├── clutch-agent.js         # ClutchEdge functionality
├── battery-agent.js        # BatteryEdge functionality
├── frame-agent.js          # FrameEdge functionality
├── tire-agent.js           # TireEdge functionality
├── agent-server.py         # Flask backend with Gemini integration
├── agent-requirements.txt  # Python dependencies
└── README.md              # This setup guide
```

## 🚀 Usage Examples

### Getting Started
1. **Start the server** using the installation steps above
2. **Open your browser** and navigate to http://localhost:5000
3. **Select an agent** from the home page based on your engineering domain
4. **Start chatting** with your specialized AI assistant

### Example Conversations

**ClutchEdge AI**:
```
User: "How do I calculate the torque capacity of a clutch?"
ClutchEdge: "Clutch torque capacity is determined by the formula: 
T = μ × N × F × R_mean, where μ is the coefficient of friction, 
N is the number of friction surfaces, F is the clamping force, 
and R_mean is the mean effective radius..."
```

**BatteryEdge AI**:
```
User: "What causes battery degradation in EVs?"
BatteryEdge: "Battery degradation occurs through several mechanisms:
1. Calendar aging from SEI layer growth
2. Cycle aging from electrode expansion/contraction
3. Temperature effects on chemical reactions..."
```

## 🔒 Security & Configuration

### Environment Variables
- `GEMINI_API_KEY` - Your Google Gemini API key (required)
- `DEBUG` - Enable debug mode (default: False)
- `HOST` - Server host address (default: 0.0.0.0)
- `PORT` - Server port (default: 5000)

### Production Deployment
For production use:
```bash
# Set production environment
export DEBUG=False
export HOST=0.0.0.0
export PORT=80

# Use production WSGI server
gunicorn -w 4 -b 0.0.0.0:80 agent-server:app
```

## 🔍 Troubleshooting

### Common Issues
1. **"GEMINI_API_KEY not set"** - Ensure your API key is properly configured
2. **"Failed to initialize Gemini AI"** - Check your internet connection and API key validity
3. **Agent not responding** - Check browser console for JavaScript errors

### Logs
- Application logs are saved to `byteedge_agents.log`
- Check console output for real-time debugging information

## 🎯 Next Steps

1. **Customize agent prompts** in `agent-server.py` for your specific use cases
2. **Add new domains** by creating additional agent configurations
3. **Deploy to cloud** platforms (Heroku, AWS, Google Cloud)
4. **Integrate with databases** for persistent conversation history
5. **Add authentication** for multi-user environments

---

**BytEdge AI Agents** - Professional automotive engineering assistance powered by Google Gemini! 🚗🤖
