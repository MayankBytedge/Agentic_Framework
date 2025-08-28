#!/usr/bin/env python3
"""
BytEdge AI Backend Server
Flask server with Google Gemini API integration for individual agent interfaces
Supports ClutchEdge, BatteryEdge, FrameEdge, and TireEdge agents
"""

import os
import json
import logging
from datetime import datetime
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import google.generativeai as genai
from typing import Dict, Any, List

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('byteedge_agents.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, origins="*")

# Configuration
class Config:
    """Application configuration"""
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', '')
    DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'
    HOST = os.getenv('HOST', '0.0.0.0')
    PORT = int(os.getenv('PORT', 5000))
    MAX_TOKENS = int(os.getenv('MAX_TOKENS', 2048))
    TEMPERATURE = float(os.getenv('TEMPERATURE', 0.7))

# Agent configurations with specialized system prompts
AGENT_CONFIGS = {
    'clutch': {
        'name': 'ClutchEdge AI',
        'avatar': '⚙️',
        'domain': 'Clutch and Drivetrain Systems',
        'system_prompt': """You are ClutchEdge AI, a world-class expert in clutch and drivetrain engineering with deep knowledge of:

CORE EXPERTISE:
• Clutch system design, mechanics, and optimization
• Torque transmission analysis and calculations
• Friction material engineering and selection (organic, ceramic, carbon)
• Dual-clutch systems and automated clutch technologies
• CVT integration and drivetrain optimization
• Clutch engagement dynamics and tuning
• Hydraulic and electronic actuation systems
• Performance clutch applications and racing systems
• Clutch wear analysis and maintenance protocols
• Manufacturing processes and quality control

RESPONSE GUIDELINES:
• Provide technically accurate information with engineering calculations
• Include specific material properties, torque specifications, and performance data
• Explain complex concepts clearly while maintaining technical depth
• Reference industry standards (SAE, ISO) and best practices
• Consider safety factors, reliability, and cost implications
• Suggest practical solutions and optimization strategies

Always approach questions with engineering rigor while being helpful and educational."""
    },

    'battery': {
        'name': 'BatteryEdge AI',
        'avatar': '🔋',
        'domain': 'EV Battery and Energy Systems',
        'system_prompt': """You are BatteryEdge AI, a leading expert in EV battery and energy systems engineering with comprehensive knowledge of:

CORE EXPERTISE:
• Battery management system (BMS) design and algorithms
• Electrochemical cell analysis (Li-ion, LFP, solid-state, emerging chemistries)
• Thermal management and cooling system design
• Charging protocols, fast charging, and safety systems
• Energy optimization and range analysis methodologies
• Battery pack design, integration, and manufacturing
• Safety systems, fault detection, and failure analysis
• Battery degradation mechanisms and life prediction models
• Grid integration, V2G technology, and energy storage
• Regulatory compliance and testing standards

RESPONSE GUIDELINES:
• Apply electrochemical engineering principles accurately
• Provide specific data on energy density, power density, and cycle life
• Include thermal management solutions and safety considerations
• Reference relevant standards (IEC, UL, SAE) and regulations
• Consider cost, scalability, and environmental factors
• Suggest optimization strategies for performance and longevity

Combine deep technical knowledge with practical application insights for real-world EV battery engineering challenges."""
    },

    'frame': {
        'name': 'FrameEdge AI',
        'avatar': '🏗️',
        'domain': 'Chassis and Structural Engineering',
        'system_prompt': """You are FrameEdge AI, a distinguished expert in chassis and structural engineering with extensive knowledge of:

CORE EXPERTISE:
• Vehicle chassis design and structural optimization
• Finite Element Analysis (FEA) and structural simulation
• Material selection and properties (steel, aluminum, carbon fiber, composites)
• Crash safety engineering and energy absorption design
• Weight reduction strategies while maintaining stiffness and strength
• Manufacturing processes (stamping, welding, bonding, assembly)
• Body-on-frame vs unibody construction analysis
• Suspension integration and mounting system design
• Torsional rigidity, NVH optimization, and structural dynamics
• Regulatory compliance (FMVSS, ECE, NCAP) and testing protocols

RESPONSE GUIDELINES:
• Apply structural mechanics and materials science principles
• Include specific calculations for stress, strain, and safety factors
• Reference material properties, yield strengths, and fatigue data
• Consider manufacturing constraints and cost implications
• Address safety standards and crash performance requirements
• Provide optimization strategies for weight, stiffness, and durability

Deliver engineering excellence with practical solutions for complex structural challenges in automotive design."""
    },

    'tire': {
        'name': 'TireEdge AI',
        'avatar': '🛞',
        'domain': 'Tire Dynamics and Performance Engineering',
        'system_prompt': """You are TireEdge AI, a premier expert in tire dynamics and performance engineering with deep understanding of:

CORE EXPERTISE:
• Tire mechanics, construction design, and materials engineering
• Contact patch analysis and pressure distribution optimization
• Traction generation, grip modeling, and vehicle dynamics integration
• Rolling resistance analysis and energy efficiency optimization
• Tire-road interaction physics and mathematical modeling
• Rubber chemistry, compound formulation, and material properties
• Temperature and pressure effects on tire performance
• Tire wear mechanisms, life prediction, and maintenance
• Performance testing, validation, and standards compliance
• Specialized applications (racing, commercial, off-road, winter/summer)

RESPONSE GUIDELINES:
• Apply tire mechanics and vehicle dynamics principles accurately
• Include specific performance data, coefficients, and measurements
• Explain complex physics concepts with practical applications
• Reference industry standards (ASTM, ISO, DOT) and testing methods
• Consider trade-offs between grip, durability, efficiency, and cost
• Provide optimization recommendations for specific applications

Combine advanced tire science with practical engineering insights for optimal tire-vehicle system performance."""
    }
}

class BytEdgeAI:
    """Main AI handler class for BytEdge automotive agents"""

    def __init__(self):
        self.model = None
        self.conversation_history = {}

    def initialize_model(self):
        """Initialize the Gemini model"""
        try:
            self.model = genai.GenerativeModel(
                'gemini-pro',
                generation_config=genai.types.GenerationConfig(
                    temperature=Config.TEMPERATURE,
                    max_output_tokens=Config.MAX_TOKENS,
                    top_p=0.8,
                    top_k=40
                )
            )
            logger.info("Gemini model initialized successfully")
            return True
        except Exception as e:
            logger.error(f"Failed to initialize Gemini model: {e}")
            return False

    def get_agent_response(self, message: str, agent_type: str, conversation_id: str = None) -> Dict[str, Any]:
        """Get response from specialized agent"""
        if not self.model:
            return {"success": False, "error": "AI model not initialized"}

        # Get agent configuration
        agent_config = AGENT_CONFIGS.get(agent_type)
        if not agent_config:
            return {"success": False, "error": f"Unknown agent type: {agent_type}"}

        try:
            # Build context with system prompt and conversation history
            context = agent_config['system_prompt']

            # Add conversation history for context
            if conversation_id and conversation_id in self.conversation_history:
                history = self.conversation_history[conversation_id]
                for entry in history[-6:]:  # Keep last 6 exchanges for context
                    context += f"\n\nPrevious User: {entry['user']}\nPrevious Assistant: {entry['assistant']}"

            # Add current message
            full_prompt = f"{context}\n\nCurrent User Question: {message}\n\nAssistant Response:"

            # Generate response
            response = self.model.generate_content(full_prompt)

            if response and response.text:
                # Store conversation history
                if not conversation_id:
                    conversation_id = f"{agent_type}_{datetime.now().timestamp()}"

                if conversation_id not in self.conversation_history:
                    self.conversation_history[conversation_id] = []

                self.conversation_history[conversation_id].append({
                    "user": message,
                    "assistant": response.text,
                    "timestamp": datetime.now().isoformat(),
                    "agent": agent_type
                })

                # Keep only recent history (last 50 exchanges)
                if len(self.conversation_history[conversation_id]) > 50:
                    self.conversation_history[conversation_id] = self.conversation_history[conversation_id][-50:]

                return {
                    "success": True,
                    "message": response.text,
                    "agent": agent_config['name'],
                    "conversation_id": conversation_id,
                    "timestamp": datetime.now().isoformat()
                }
            else:
                return {"success": False, "error": "No response generated"}

        except Exception as e:
            logger.error(f"Error generating response for {agent_type}: {e}")
            return {"success": False, "error": f"Failed to generate response: {str(e)}"}

# Initialize AI handler
ai_handler = BytEdgeAI()

def init_gemini():
    """Initialize Google Gemini AI with API key"""
    if not Config.GEMINI_API_KEY:
        logger.error("GEMINI_API_KEY environment variable not set!")
        logger.info("Please set your Gemini API key: export GEMINI_API_KEY='your_api_key_here'")
        return False

    try:
        genai.configure(api_key=Config.GEMINI_API_KEY)
        logger.info("Gemini AI configured successfully")
        return True
    except Exception as e:
        logger.error(f"Failed to configure Gemini AI: {e}")
        return False

# Initialize the home page HTML template
HOME_PAGE_HTML = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BytEdge AI Agents</title>
    <style>
        body {{
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, rgba(10,10,15,1) 0%, rgba(26,26,46,1) 50%, rgba(22,33,62,1) 100%);
            color: white;
            margin: 0;
            padding: 2rem;
            min-height: 100vh;
        }}
        .container {{
            max-width: 1200px;
            margin: 0 auto;
            text-align: center;
        }}
        .header {{
            margin-bottom: 3rem;
        }}
        .header h1 {{
            font-size: 3rem;
            font-weight: 700;
            background: linear-gradient(45deg, rgba(100,255,218,1), rgba(0,188,212,1), rgba(33,150,243,1));
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 1rem;
        }}
        .header p {{
            font-size: 1.2rem;
            color: rgba(184,193,236,1);
            opacity: 0.9;
        }}
        .agents-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 3rem;
        }}
        .agent-card {{
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 2rem;
            transition: all 0.3s ease;
            text-decoration: none;
            color: inherit;
            display: block;
        }}
        .agent-card:hover {{
            transform: translateY(-5px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            border-color: rgba(100, 255, 218, 0.3);
        }}
        .agent-avatar {{
            font-size: 3rem;
            margin-bottom: 1rem;
        }}
        .agent-name {{
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
        }}
        .agent-description {{
            color: rgba(184,193,236,1);
            line-height: 1.6;
        }}
        .status {{
            margin-top: 2rem;
            font-size: 0.9rem;
            opacity: 0.7;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>BytEdge AI Agents</h1>
            <p>Specialized Conversational AI for Automotive Engineering</p>
        </div>

        <div class="agents-grid">
            <a href="/clutch-edge.html" class="agent-card">
                <div class="agent-avatar">⚙️</div>
                <div class="agent-name">ClutchEdge AI</div>
                <div class="agent-description">Advanced clutch and drivetrain engineering assistant</div>
            </a>

            <a href="/battery-edge.html" class="agent-card">
                <div class="agent-avatar">🔋</div>
                <div class="agent-name">BatteryEdge AI</div>
                <div class="agent-description">EV battery and energy systems specialist</div>
            </a>

            <a href="/frame-edge.html" class="agent-card">
                <div class="agent-avatar">🏗️</div>
                <div class="agent-name">FrameEdge AI</div>
                <div class="agent-description">Chassis and structural engineering expert</div>
            </a>

            <a href="/tire-edge.html" class="agent-card">
                <div class="agent-avatar">🛞</div>
                <div class="agent-name">TireEdge AI</div>
                <div class="agent-description">Tire dynamics and performance specialist</div>
            </a>
        </div>

        <div class="status">
            <p>🚗 BytEdge Automotive AI - Powered by Google Gemini</p>
        </div>
    </div>
</body>
</html>"""

# Routes for serving static files
@app.route('/')
def index():
    """Serve agent selection page"""
    return HOME_PAGE_HTML

@app.route('/<path:filename>')
def static_files(filename):
    """Serve static files"""
    return send_from_directory('.', filename)

# API Routes
@app.route('/api/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "ai_initialized": ai_handler.model is not None,
        "available_agents": list(AGENT_CONFIGS.keys())
    })

@app.route('/api/agents')
def get_agents():
    """Get available agents information"""
    agents = {}
    for agent_type, config in AGENT_CONFIGS.items():
        agents[agent_type] = {
            "name": config["name"],
            "avatar": config["avatar"],
            "domain": config["domain"]
        }
    return jsonify(agents)

@app.route('/api/chat/<agent_type>', methods=['POST'])
def chat_with_agent(agent_type):
    """Chat with specific agent"""
    try:
        data = request.get_json()

        if not data or 'message' not in data:
            return jsonify({"success": False, "error": "Message is required"}), 400

        message = data['message'].strip()
        conversation_id = data.get('conversation_id')

        if not message:
            return jsonify({"success": False, "error": "Message cannot be empty"}), 400

        if agent_type not in AGENT_CONFIGS:
            return jsonify({"success": False, "error": f"Unknown agent type: {agent_type}"}), 400

        logger.info(f"Processing chat request - Agent: {agent_type}, Message length: {len(message)}")

        # Get response from AI
        result = ai_handler.get_agent_response(message, agent_type, conversation_id)

        if result["success"]:
            logger.info(f"Successfully generated response for {agent_type}")
            return jsonify(result)
        else:
            logger.error(f"Failed to generate response: {result.get('error', 'Unknown error')}")
            return jsonify(result), 500

    except Exception as e:
        logger.error(f"Error in chat endpoint: {e}")
        return jsonify({
            "success": False,
            "error": "Internal server error",
            "message": "Please try again later"
        }), 500

# Generic chat endpoint for backwards compatibility
@app.route('/api/chat', methods=['POST'])
def chat():
    """Generic chat endpoint that routes to specific agents"""
    try:
        data = request.get_json()
        agent_type = data.get('agent', 'clutch')  # Default to clutch agent
        return chat_with_agent(agent_type)
    except Exception as e:
        logger.error(f"Error in generic chat endpoint: {e}")
        return jsonify({
            "success": False,
            "error": "Internal server error"
        }), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    logger.error(f"Internal server error: {error}")
    return jsonify({"error": "Internal server error"}), 500

def main():
    """Main application entry point"""
    print("🚗 BytEdge AI Agent Backend Starting...")
    print("=" * 60)

    # Initialize Gemini AI
    if not init_gemini():
        print("❌ Failed to initialize Gemini AI. Please check your API key.")
        print("Set your API key with: export GEMINI_API_KEY='your_key_here'")
        return

    # Initialize AI model
    if not ai_handler.initialize_model():
        print("❌ Failed to initialize AI model.")
        return

    print(f"✅ Gemini AI initialized successfully")
    print(f"🌐 Server starting on http://{Config.HOST}:{Config.PORT}")
    print(f"📊 Debug mode: {Config.DEBUG}")
    print(f"🤖 Available agents: {', '.join(AGENT_CONFIGS.keys())}")
    print(f"📋 Agent endpoints:")
    for agent_type in AGENT_CONFIGS.keys():
        print(f"   • /{agent_type}-edge.html - {AGENT_CONFIGS[agent_type]['name']}")
    print("=" * 60)

    # Start the Flask app
    try:
        app.run(
            host=Config.HOST,
            port=Config.PORT,
            debug=Config.DEBUG,
            threaded=True
        )
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except Exception as e:
        print(f"❌ Server error: {e}")

if __name__ == '__main__':
    main()
