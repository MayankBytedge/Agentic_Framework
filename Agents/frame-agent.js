/**
 * FrameEdge AI - Conversational Agent Interface
 * Specialized Chassis and Structural Engineering Assistant
 */

// Configuration
const AGENT_CONFIG = {
    name: 'FrameEdge AI',
    domain: 'frame',
    avatar: '🏗️',
    apiEndpoint: '/api/chat/frame',
    systemPrompt: `You are FrameEdge AI, a specialized conversational assistant for chassis and structural engineering.

Your expertise includes:
- Vehicle chassis design and architecture optimization
- Structural FEA and stress analysis methodologies
- Material selection and properties engineering
- Crash safety and impact analysis systems
- Weight reduction and stiffness optimization
- Manufacturing processes and assembly methods
- Body-on-frame vs unibody construction analysis
- Suspension mounting and integration design
- Torsional rigidity and structural dynamics
- Regulatory compliance and safety standards

Always provide:
- Structural engineering principles and calculations
- Material properties and specifications
- Safety factor analysis and recommendations
- Manufacturing feasibility considerations
- Cost-benefit analysis for design decisions
- Regulatory compliance information (FMVSS, ECE, etc.)
- Testing methodologies and validation procedures

Respond with engineering rigor while making complex structural concepts accessible for practical application.`
};

// Global variables
let conversationHistory = [];
let isProcessing = false;
let messageCount = 0;

// DOM elements
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const typingIndicator = document.getElementById('typingIndicator');
const characterCount = document.querySelector('.character-count');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    showWelcomeAnimation();
});

function initializeApp() {
    autoResizeTextarea(messageInput);
    updateCharacterCount();
    messageInput.focus();
    console.log(`${AGENT_CONFIG.name} initialized successfully`);
}

function setupEventListeners() {
    messageInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    messageInput.addEventListener('input', function() {
        updateCharacterCount();
        autoResizeTextarea(this);
    });

    sendButton.addEventListener('click', sendMessage);
}

function updateCharacterCount() {
    const count = messageInput.value.length;
    const maxLength = parseInt(messageInput.getAttribute('maxlength')) || 2000;
    characterCount.textContent = `${count}/${maxLength}`;

    if (count > maxLength * 0.9) {
        characterCount.style.color = 'var(--status-warning)';
    } else if (count > maxLength * 0.95) {
        characterCount.style.color = 'var(--status-error)';
    } else {
        characterCount.style.color = 'var(--text-tertiary)';
    }
}

function autoResizeTextarea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
}

function showWelcomeAnimation() {
    const welcomeMessage = document.querySelector('.welcome-message');
    if (welcomeMessage) {
        welcomeMessage.classList.add('slide-up');
    }
}

async function sendMessage() {
    const message = messageInput.value.trim();

    if (!message || isProcessing) {
        return;
    }

    setProcessingState(true);
    addMessage(message, 'user');

    messageInput.value = '';
    updateCharacterCount();
    autoResizeTextarea(messageInput);

    showTypingIndicator();

    try {
        const response = await sendToAPI(message);
        hideTypingIndicator();

        if (response.success) {
            addMessage(response.message, 'agent');
            conversationHistory.push({
                user: message,
                agent: response.message,
                timestamp: new Date().toISOString()
            });
        } else {
            addMessage(
                "I apologize, but I encountered an error processing your request. Please try again or rephrase your question.",
                'agent',
                true
            );
        }

    } catch (error) {
        hideTypingIndicator();
        console.error('Error sending message:', error);
        addMessage(
            "I'm having trouble connecting right now. Please check your connection and try again.",
            'agent',
            true
        );
    } finally {
        setProcessingState(false);
        scrollToBottom();
    }
}

async function sendToAPI(message) {
    return new Promise((resolve) => {
        setTimeout(() => {
            let response = generateContextualResponse(message);
            resolve({
                success: true,
                message: response,
                timestamp: new Date().toISOString()
            });
        }, 1500 + Math.random() * 1000);
    });
}

function generateContextualResponse(message) {
    const msg = message.toLowerCase();

    if (msg.includes('unibody') && msg.includes('body-on-frame')) {
        return `**Unibody vs Body-on-Frame Construction**:

**Unibody (Monocoque) Construction**:
✅ **Advantages**:
• **Weight efficiency**: 10-15% lighter than BOF
• **Lower center of gravity**: Better handling dynamics
• **Improved crash energy absorption**: Distributed load paths
• **Better NVH**: More rigid structure reduces vibration
• **Cost effective**: Fewer parts, simplified assembly

❌ **Disadvantages**:
• **Repair complexity**: Structural damage affects multiple systems
• **Limited modularity**: Difficult to modify or vary wheelbase
• **Towing capacity**: Lower payload limits vs BOF

**Body-on-Frame (BOF) Construction**:
✅ **Advantages**:
• **Modularity**: Multiple body styles on same chassis
• **Durability**: Better for heavy-duty applications
• **Repairability**: Frame and body can be serviced separately
• **Towing capacity**: Higher payload and trailer ratings
• **Off-road capability**: Better structural integrity for harsh use

❌ **Disadvantages**:
• **Weight penalty**: Heavier due to dual structure
• **Height**: Higher floor, raised center of gravity
• **Crash performance**: More complex load path management
• **Cost**: More complex assembly process

**Engineering Trade-offs**:

**Torsional Rigidity**:
• Unibody: 15,000-25,000 Nm/deg
• BOF: 8,000-15,000 Nm/deg
• Affects handling precision and body control

**Weight Distribution**:
• Unibody: Better front/rear balance
• BOF: More rear-heavy due to frame mass

**Modern Applications**:
• **Unibody**: Passenger cars, crossovers, light trucks
• **BOF**: Full-size trucks, SUVs, commercial vehicles

**Hybrid Approaches**: Some manufacturers use reinforced unibody designs with integrated ladder frame sections for improved capability.

What's your specific application - passenger vehicle or commercial/heavy-duty?`;
    }

    if (msg.includes('stiffness') && msg.includes('weight')) {
        return `**Optimizing Chassis Stiffness vs Weight**:

**Key Principles**:

**1. Material Selection**:
• **High-Strength Steel (HSS)**: 550-980 MPa yield strength
• **Ultra High-Strength Steel**: 980+ MPa, thinner sections
• **Aluminum alloys**: 30% weight reduction, requires thickness compensation
• **Carbon fiber**: Ultimate stiffness-to-weight but cost prohibitive

**2. Structural Optimization**:

**Cross-Section Design**:
• **Moment of inertia**: I = ∫y²dA (bending stiffness)
• **Closed sections**: 5-10x more torsionally rigid than open
• **Variable thickness**: Thick where stressed, thin elsewhere
• **Hydroformed tubes**: Complex shapes, optimized material distribution

**Load Path Engineering**:
• **Direct load paths**: Minimize bending, maximize tension/compression
• **Triangulated structures**: Inherently stable geometry
• **Node reinforcement**: Strengthen connection points
• **Continuous members**: Avoid joints in high-stress areas

**3. Advanced Techniques**:

**Topology Optimization**:
• FEA-driven material removal
• Natural frequency optimization
• Multi-objective: stiffness + weight + cost
• Additive manufacturing possibilities

**Sandwich Structures**:
• Honeycomb/foam cores with thin face sheets
• High bending stiffness with minimal weight
• Applications: floor panels, roof structures

**4. Design Targets**:

**Torsional Stiffness**: 20,000+ Nm/deg
• Formula: K = GJ/L (shear modulus × polar moment / length)
• Target: 15-25% increase over previous generation

**Bending Stiffness**: 15,000+ N/mm
• Critical for body control and handling
• Measured at suspension pickup points

**Weight Targets**:
• **Steel unibody**: 300-400 kg
• **Mixed materials**: 250-350 kg
• **Aluminum space frame**: 200-300 kg

**5. Manufacturing Considerations**:
• **Stamping limitations**: Complex shapes require multiple operations
• **Welding accessibility**: Joint design for robotic assembly
• **Tolerance stack-up**: Dimensional control in multi-piece structures
• **Corrosion protection**: Galvanizing, painting process compatibility

**Optimization Process**:
1. Define load cases (crash, NVH, handling)
2. FEA baseline analysis
3. Material/thickness optimization
4. Topology optimization
5. Manufacturing feasibility check
6. Cost/weight trade-off analysis

Current industry benchmark: 20% weight reduction with 15% stiffness increase vs previous generation.

What's your primary constraint - cost, manufacturing, or performance targets?`;
    }

    if (msg.includes('crash') && (msg.includes('safety') || msg.includes('energy'))) {
        return `**Crash Energy Absorption in Vehicle Structures**:

**Energy Management Principles**:

**1. Kinetic Energy Calculation**:
• **KE = ½mv²**: Energy increases with velocity squared
• **50 mph crash**: ~40-50 kJ energy to absorb per occupant
• **Multiple load cases**: Frontal, side, rear, rollover, pole

**2. Deformation Zones**:

**Front Structure (Primary)**:
• **Crush zones**: 600-800mm progressive collapse
• **Energy absorption**: 60-70% of total crash energy  
• **Load limiting**: Prevent excessive occupant deceleration

**Components**:
• **Rails**: Main longitudinal load-bearing members
• **Cross members**: Load distribution and structural stability
• **Radiator support**: Initial energy absorption
• **Firewall**: Transition zone to passenger compartment

**3. Material Behavior**:

**Energy Absorption Mechanisms**:
• **Plastic deformation**: Permanent material yield
• **Buckling**: Controlled structural failure modes
• **Tearing**: Material separation under extreme loads
• **Friction**: Sliding between deforming components

**Material Properties**:
• **Yield strength**: Initial deformation resistance
• **Ultimate strength**: Maximum load capacity
• **Elongation**: Ductility for energy absorption
• **Strain rate sensitivity**: Dynamic vs static behavior

**4. Design Strategies**:

**Progressive Collapse**:
• **Accordion folding**: Predictable failure pattern
• **Trigger mechanisms**: Initiate collapse at designed locations
• **Load path management**: Direct forces away from occupants

**Force Limiting**:
• **Target deceleration**: <50g average, <100g peak
• **Pulse shaping**: Gradual force increase, sustained plateau
• **Multi-stage absorption**: Sequential component activation

**5. Advanced Technologies**:

**Adaptive Structures**:
• **Pre-crash systems**: Adjust structure based on crash severity
• **Active materials**: Shape memory alloys, phase change
• **Variable stiffness**: Adapt to different crash scenarios

**Simulation & Testing**:
• **FEA crash simulation**: LS-DYNA, RADIOSS
• **Physical testing**: IIHS, NHTSA protocols
• **Correlation**: Model validation against test data

**6. Safety Standards**:

**FMVSS Requirements**:
• **208**: Occupant crash protection (35 mph barrier)
• **214**: Side impact protection (38.5 mph)
• **216**: Roof crush resistance (3x vehicle weight)

**IIHS Testing**:
• **Moderate overlap**: 40% width, 40 mph
• **Small overlap**: 25% width, 40 mph
• **Side impact**: 31 mph, 3,300 lb barrier

**Design Targets**:
• **Peak deceleration**: <60g (50ms average)
• **Intrusion limits**: <150mm at occupant locations
• **Door opening**: Maintain egress capability post-crash

Modern vehicles achieve 5-star safety ratings through sophisticated energy management combining multiple materials, advanced geometries, and predictive failure modes.

Are you working on a specific crash scenario or structural component?`;
    }

    if (msg.includes('aluminum') && msg.includes('steel')) {
        return `**Aluminum vs Steel for Chassis Materials**:

**Material Properties Comparison**:

**Steel (High-Strength)**:
• **Density**: 7.8 g/cm³
• **Young's Modulus**: 200 GPa
• **Yield Strength**: 350-980+ MPa (grade dependent)
• **Ultimate Strength**: 500-1400+ MPa
• **Specific Strength**: 45-125 kN⋅m/kg

**Aluminum (6xxx series)**:
• **Density**: 2.7 g/cm³ (65% lighter)
• **Young's Modulus**: 70 GPa (35% of steel)
• **Yield Strength**: 200-350 MPa
• **Ultimate Strength**: 250-400 MPa  
• **Specific Strength**: 75-130 kN⋅m/kg

**Design Implications**:

**Stiffness Considerations**:
• **Bending stiffness**: EI (E×moment of inertia)
• Aluminum requires **40% thicker sections** for equal stiffness
• **Weight penalty partially offset** by thickness increase
• **Net weight saving**: 20-30% vs steel equivalent

**Strength Design**:
• Steel's higher yield strength enables thinner sections
• Aluminum requires **larger cross-sections** for equivalent load capacity
• **Fatigue performance**: Aluminum superior in high-cycle applications
• **Corrosion resistance**: Aluminum naturally protective oxide layer

**Manufacturing Considerations**:

**Steel Advantages**:
• **Welding**: Established resistance spot welding
• **Forming**: Deep drawing, complex stamping
• **Tooling**: Lower cost, longer life
• **Repair**: Standard body shop equipment

**Aluminum Challenges**:
• **Welding**: Requires specialized equipment (TIG, friction stir)
• **Thermal expansion**: 2x steel coefficient
• **Galvanic corrosion**: Isolation required from steel components
• **Tooling wear**: Abrasive to forming tools

**Cost Analysis** (relative to steel baseline):
• **Material cost**: Aluminum 2-3x higher
• **Manufacturing**: 10-30% higher processing costs
• **Tooling**: 50-100% higher investment
• **Total system**: 15-25% cost premium

**Application Strategies**:

**Steel Applications**:
• **High-stress areas**: A-pillars, door frames
• **Cost-sensitive structures**: Lower body, floor pan
• **Crash-critical zones**: Energy absorption members

**Aluminum Applications**:
• **Large panels**: Hoods, doors, deck lids
• **Space frame**: Audi A8, BMW i8 approach
• **Suspension components**: Control arms, knuckles

**Hybrid Approaches**:
• **Multi-material design**: Right material, right location
• **Steel frame + aluminum panels**: Ford F-150 strategy
• **Joining technologies**: Structural adhesives, mechanical fasteners

**Performance Targets**:
• **Weight reduction**: 20-40% with aluminum intensive design
• **Stiffness maintenance**: Equal or improved NVH performance
• **Cost target**: <20% premium over steel equivalent

**Future Trends**:
• **Advanced high-strength steels**: Closing performance gap
• **Aluminum alloy development**: Higher strength grades
• **Joining innovation**: Simplified multi-material assembly

Which aspect is most critical for your application - weight, cost, or performance?`;
    }

    if (msg.includes('fea') || msg.includes('finite element')) {
        return `**FEA in Chassis Design Validation**:

**Finite Element Analysis Applications**:

**1. Static Structural Analysis**:
• **Linear static**: Small deformations, elastic behavior
• **Nonlinear static**: Large deformations, material plasticity
• **Contact analysis**: Joint behavior, bolt preloads
• **Buckling analysis**: Critical load determination

**Load Cases for Chassis**:
• **Vertical loads**: 2-4g bump, pothole impacts
• **Longitudinal**: Braking 1.5g, acceleration 0.8g
• **Lateral**: Cornering 1.2g, side impact
• **Torsional**: Single wheel bump, twist beam loading

**2. Dynamic Analysis**:

**Modal Analysis**:
• **Natural frequencies**: Avoid resonance with engine/road
• **Mode shapes**: Identify critical vibration patterns
• **Target range**: First bending >25 Hz, first torsion >15 Hz

**Frequency Response**:
• **Road input simulation**: PSD analysis
• **Engine mount isolation**: Vibration transmission
• **Steering wheel shake**: 5-25 Hz critical range

**3. Crash Simulation**:
• **Explicit dynamics**: High-speed deformation
• **Material models**: Johnson-Cook, Cowper-Symonds
• **Contact algorithms**: Self-contact, barrier interaction
• **Energy balance**: Kinetic to internal energy conversion

**FEA Software Tools**:

**Preprocessing**:
• **ANSA**: Industry-standard mesh generation
• **HyperMesh**: Altair's comprehensive preprocessor
• **CATIA**: Integrated CAD-FEA environment

**Solvers**:
• **NASTRAN**: Linear analysis, established accuracy
• **ABAQUS**: Advanced nonlinear capabilities
• **LS-DYNA**: Explicit crash simulation
• **RADIOSS**: Multi-physics simulation

**Postprocessing**:
• **HyperView**: Advanced visualization
• **FEMFAT**: Fatigue life prediction
• **EnSight**: Multi-physics results analysis

**4. Model Development**:

**Mesh Quality Criteria**:
• **Aspect ratio**: <5:1 for shells, <10:1 for solids
• **Warpage**: <15° for shell elements
• **Skewness**: <60° maximum angle deviation
• **Element size**: 5-10mm for global models

**Boundary Conditions**:
• **Suspension mounts**: Multi-point constraints (MPC)
• **Engine mounts**: Bushing stiffness representation
• **Body joints**: Weld/bond connection modeling

**Material Modeling**:
• **Linear elastic**: Initial design iteration
• **Plasticity**: Yield and ultimate strength
• **Strain rate effects**: Dynamic material properties
• **Failure criteria**: Maximum stress, von Mises

**5. Validation Process**:

**Correlation Studies**:
• **Physical testing**: Component and full vehicle
• **Digital image correlation**: Strain field validation
• **Accelerometer data**: Modal test correlation
• **Load cell measurements**: Force path verification

**Model Updating**:
• **Parameter identification**: Material property tuning
• **Joint stiffness**: Connection modeling refinement
• **Boundary condition adjustment**: Support condition optimization

**6. Design Optimization**:

**Topology Optimization**:
• **Objective function**: Minimize weight, maximize stiffness
• **Constraints**: Stress limits, frequency targets
• **Manufacturing**: Consider production feasibility

**Parametric Studies**:
• **Thickness optimization**: Shell thickness variation
• **Shape optimization**: Cross-section geometry
• **Material substitution**: Multi-material analysis

**Validation Targets**:
• **Correlation quality**: <5% frequency difference
• **Stress prediction**: <10% von Mises stress accuracy
• **Displacement**: <15% deflection prediction error

**Computational Requirements**:
• **Model size**: 500K-2M elements typical
• **Solve time**: 2-8 hours for static, 12-48 hours for crash
• **Hardware**: 16-64 core workstations, 64-256GB RAM

Modern FEA enables virtual validation reducing physical prototypes by 60-80% while improving design confidence through comprehensive load case evaluation.

What's your specific FEA challenge - setup, solving, or correlation?`;
    }

    // General fallback responses
    const fallbacks = [
        `That's an excellent structural engineering question! As FrameEdge AI, I can help you navigate the complex world of chassis design, from material selection to crash safety optimization.

Could you provide more details about:
• The specific vehicle type or application you're working with
• Your design constraints (weight, cost, performance targets)
• Particular structural challenges or requirements you're facing

This will help me provide the most relevant engineering guidance for your chassis design needs.`,

        `I'd be happy to help with your chassis engineering question! Vehicle structures involve sophisticated trade-offs between stiffness, weight, safety, and manufacturability.

To give you the most accurate information, could you tell me more about:
• Your application (passenger car, truck, SUV, commercial vehicle)
• Specific structural analysis or design challenges
• Material considerations or manufacturing constraints

Let's work through the structural engineering together!`,

        `Fascinating question about vehicle structures! Chassis engineering combines multiple disciplines - materials science, structural mechanics, crash safety, and manufacturing engineering.

I can help you with detailed analysis of:
• Structural design principles and calculations
• Material selection and optimization strategies
• FEA modeling and validation techniques
• Crash safety and energy absorption design

What specific structural aspect would you like to explore first?`
    ];

    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

function addMessage(text, sender, isError = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message ${isError ? 'error-message' : ''}`;

    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    avatarDiv.textContent = sender === 'user' ? '👤' : AGENT_CONFIG.avatar;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';

    const textDiv = document.createElement('div');
    textDiv.className = 'message-text';

    const formattedText = formatMessage(text);
    textDiv.innerHTML = formattedText;

    const timeDiv = document.createElement('div');
    timeDiv.className = 'message-time';
    timeDiv.textContent = getCurrentTime();
    timeDiv.dataset.timestamp = Date.now();

    contentDiv.appendChild(textDiv);
    contentDiv.appendChild(timeDiv);
    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);

    chatMessages.appendChild(messageDiv);
    messageDiv.classList.add('fade-in');

    messageCount++;
    scrollToBottom();
}

function formatMessage(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/^[•▸]\s/gm, '<span class="bullet">•</span> ')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\n/g, '<br>');
}

function showTypingIndicator() {
    typingIndicator.style.display = 'flex';
    typingIndicator.classList.add('fade-in');
    scrollToBottom();
}

function hideTypingIndicator() {
    typingIndicator.style.display = 'none';
}

function setProcessingState(processing) {
    isProcessing = processing;
    messageInput.disabled = processing;
    sendButton.disabled = processing;

    if (!processing) {
        messageInput.focus();
    }
}

function scrollToBottom() {
    setTimeout(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 100);
}

function getCurrentTime() {
    return new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

function askQuestion(question) {
    messageInput.value = question;
    updateCharacterCount();
    autoResizeTextarea(messageInput);
    messageInput.focus();
}

function clearChat() {
    if (confirm('Are you sure you want to clear the chat history?')) {
        const messages = chatMessages.querySelectorAll('.message:not(.welcome-message)');
        messages.forEach(msg => {
            msg.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => msg.remove(), 300);
        });

        conversationHistory = [];
        messageCount = 0;

        messageInput.value = '';
        updateCharacterCount();
        messageInput.focus();
    }
}

// Add CSS for styling
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-10px); }
    }

    .error-message .message-text {
        background: rgba(244, 67, 54, 0.1) !important;
        border-color: rgba(244, 67, 54, 0.3) !important;
        color: #ffcdd2 !important;
    }

    .message-text code {
        background: rgba(255, 255, 255, 0.1);
        padding: 2px 6px;
        border-radius: 4px;
        font-family: var(--font-mono);
        font-size: 0.9em;
    }

    .message-text .bullet {
        color: var(--theme-primary);
        font-weight: bold;
        margin-right: 0.5rem;
    }
`;
document.head.appendChild(style);

window.FrameEdge = {
    sendMessage,
    clearChat,
    askQuestion,
    getConversationHistory: () => conversationHistory
};

console.log('FrameEdge AI loaded successfully! 🚗🏗️');