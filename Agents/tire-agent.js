/**
 * TireEdge AI - Conversational Agent Interface
 * Specialized Tire Dynamics and Performance Assistant
 */

// Configuration
const AGENT_CONFIG = {
    name: 'TireEdge AI',
    domain: 'tire',
    avatar: '🛞',
    apiEndpoint: '/api/chat/tire',
    systemPrompt: `You are TireEdge AI, a specialized conversational assistant for tire dynamics and performance engineering.

Your expertise includes:
- Tire mechanics and construction design principles
- Contact patch analysis and pressure distribution
- Traction optimization and grip modeling systems
- Rolling resistance and energy efficiency analysis
- Tire-road interaction physics and modeling
- Tire compounds and rubber chemistry engineering
- Pneumatic trail and self-aligning torque analysis
- Temperature and pressure effects on performance
- Tire wear patterns and life prediction models
- Vehicle dynamics integration and optimization

Always provide:
- Physics-based explanations and calculations
- Performance characteristics and data analysis
- Material science insights and properties
- Dynamic analysis results and interpretations
- Optimization recommendations and strategies
- Safety considerations and standards compliance
- Testing procedures and validation methodologies

Respond with technical accuracy while making complex tire dynamics concepts accessible for practical engineering application.`
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

    if (msg.includes('compound') && (msg.includes('grip') || msg.includes('wear'))) {
        return `**Tire Compound Effects on Grip and Wear**:

**Compound Chemistry**:

**Natural Rubber (NR)**:
• **Properties**: High elasticity, good tear resistance
• **Temperature range**: Best performance 60-80°C
• **Applications**: High-performance tires, racing compounds
• **Grip characteristics**: Excellent dry traction, temperature-sensitive

**Synthetic Rubbers**:
• **SBR (Styrene-Butadiene)**: Good wear resistance, moderate grip
• **BR (Butadiene)**: Low rolling resistance, cold weather performance  
• **EPDM**: Weather resistance, limited grip applications
• **Silica compounds**: Enhanced wet grip, reduced rolling resistance

**Performance Trade-offs**:

**Soft Compounds** (Shore A 50-60):
✅ **Advantages**:
• Superior grip and traction
• Better conformability to road surface
• Enhanced braking performance
• Improved cornering stability

❌ **Disadvantages**:
• Faster wear rates (50-75% of hard compound life)
• Higher rolling resistance
• Temperature sensitivity
• Reduced fuel efficiency

**Hard Compounds** (Shore A 65-75):
✅ **Advantages**:
• Extended tread life (40,000-80,000 miles)
• Lower rolling resistance (improved MPG)
• Better high-speed stability
• Cost-effective for fleet applications

❌ **Disadvantages**:
• Reduced grip, especially in cold/wet conditions
• Longer braking distances
• Less responsive handling
• Poor low-temperature flexibility

**Engineering Factors**:

**Friction Coefficient (μ)**:
• **Soft compound**: μ = 0.9-1.2 (dry), 0.7-0.9 (wet)
• **Medium compound**: μ = 0.8-1.0 (dry), 0.6-0.8 (wet)
• **Hard compound**: μ = 0.7-0.9 (dry), 0.5-0.7 (wet)

**Wear Rate Formula**:
Wear ∝ (Load × Slip × Speed) / (Compound Hardness × Temperature Factor)

**Multi-Compound Design**:
• **Center tread**: Hard compound for longevity
• **Shoulder blocks**: Soft compound for cornering
• **Intermediate zones**: Graduated hardness transition

**Advanced Compounds**:
• **Silica-enhanced**: 15-20% better wet grip, 10% lower RR
• **Carbon black optimization**: Improved wear resistance
• **Polymer modification**: Temperature stability enhancement

**Application Guidelines**:
• **Performance driving**: Soft compounds (200-400 treadwear)
• **Daily driving**: Medium compounds (400-600 treadwear)
• **Commercial/fleet**: Hard compounds (600+ treadwear)

Modern tire development uses computer modeling to predict compound behavior across temperature and load ranges.

What's your priority - maximum grip, longevity, or fuel efficiency?`;
    }

    if (msg.includes('contact') && (msg.includes('patch') || msg.includes('traction'))) {
        return `**Contact Patch and Traction Relationship**:

**Contact Patch Fundamentals**:

**Basic Physics**:
• **Contact area**: A = Load / Pressure
• **Typical passenger car**: 15-25 cm² per tire
• **Racing slick**: 200+ cm² (wider, softer compound)
• **Elliptical shape**: Length/width ratio ~1.2-1.5

**Pressure Distribution**:
• **Center-loaded**: Higher pressure in middle (overinflated)
• **Edge-loaded**: Higher pressure at shoulders (underinflated)
• **Uniform**: Optimal pressure distribution across width

**Traction Generation Mechanisms**:

**1. Adhesion Component**:
• **Molecular bonds**: Rubber-to-asphalt adhesion
• **Surface energy interaction**: Van der Waals forces
• **Temperature dependent**: Optimum ~80-120°C tread temp
• **Clean, dry conditions**: Primary traction mechanism

**2. Deformation Component**:
• **Mechanical interlocking**: Rubber flows into surface texture
• **Hysteresis losses**: Energy dissipation in rubber
• **Micro-slip**: Local deformation under shear forces
• **Wet conditions**: Dominant traction mechanism

**Load vs Traction Relationship**:

**Friction Circle Theory**:
• **Maximum traction**: Limited by tire-road friction coefficient
• **Combined loading**: √(Fx² + Fy²) ≤ μ × Fz
• **Load transfer effects**: Inner tire unloading in turns

**Non-Linear Behavior**:
• **Light loads**: Traction increases with load
• **Optimal load**: Peak friction coefficient
• **Heavy loads**: Diminishing returns, increased wear

**Contact Patch Optimization**:

**Tire Construction**:
• **Carcass stiffness**: Controls patch shape
• **Belt angle**: Affects longitudinal vs lateral stiffness
• **Sidewall stiffness**: Influences load distribution
• **Tread pattern**: Groove arrangement and siping

**Vehicle Setup**:
• **Camber angle**: Maximize patch area in turns
• **Toe alignment**: Minimize scrub and wear
• **Pressure optimization**: Achieve uniform wear pattern
• **Load distribution**: Front/rear balance for handling

**Performance Metrics**:

**Contact Patch Length**:
• **Formula**: L ≈ √(8 × R × δ)
• R = tire radius, δ = deflection
• **Braking/acceleration**: Longer patch = more traction

**Contact Patch Width**:
• **Cornering performance**: Wider = better lateral grip
• **Rolling resistance**: Wider = potentially higher RR
• **Aquaplaning resistance**: Width affects water evacuation

**Temperature Effects**:
• **Cold tires**: Reduced contact patch, poor grip
• **Optimal temperature**: Maximum contact area and adhesion
• **Overheating**: Reduced grip, accelerated wear

**Advanced Analysis**:

**Pressure Mapping**:
• **Sensor mats**: Real-time pressure distribution
• **Finite element modeling**: Predicted contact behavior
• **Optimization**: Tread compound and construction tuning

**Dynamic Loading**:
• **Transient response**: Contact patch change during maneuvers
• **Frequency effects**: Resonance and vibration impacts
• **Load history**: Previous loading affects current grip

**Design Targets**:
• **Uniform pressure**: ±10% across contact patch
• **Maximum area**: Given load and inflation constraints
• **Shape optimization**: Match vehicle dynamics requirements

Modern tire development uses sophisticated contact patch analysis to optimize the critical interface between vehicle and road.

Are you looking to optimize for straight-line traction, cornering grip, or overall performance balance?`;
    }

    if (msg.includes('rolling') && msg.includes('resistance')) {
        return `**Rolling Resistance in Tires**:

**Physical Mechanisms**:

**1. Hysteresis Losses**:
• **Primary contributor**: 85-90% of rolling resistance
• **Rubber deformation**: Energy loss during compression/expansion cycles
• **Viscoelastic behavior**: Phase lag between stress and strain
• **Temperature dependent**: Higher temp = lower hysteresis

**2. Aerodynamic Drag**:
• **Tire/wheel assembly**: 5-10% of total rolling resistance
• **Speed dependent**: Drag ∝ velocity²
• **Wheel design**: Spokes vs solid, aerodynamic optimization
• **Tire sidewall**: Smooth vs textured surface effects

**3. Slippage Losses**:
• **Tread deformation**: Micro-slip at contact patch
• **Belt edge effects**: Non-uniform deformation
• **Tread pattern**: Block edges create additional losses
• **Typically**: 2-5% of total resistance

**Rolling Resistance Coefficient (Crr)**:

**Definition**: Crr = Rolling Force / Normal Load

**Typical Values**:
• **Low rolling resistance**: Crr = 0.006-0.008
• **Standard passenger**: Crr = 0.008-0.012  
• **High performance**: Crr = 0.010-0.015
• **Off-road/aggressive**: Crr = 0.015-0.025

**Factors Affecting Rolling Resistance**:

**Tire Construction**:
• **Carcass design**: Radial vs bias-ply construction
• **Belt materials**: Steel vs textile, angle optimization
• **Sidewall stiffness**: Lower deflection = lower hysteresis
• **Bead construction**: Minimize internal friction

**Compound Engineering**:
• **Silica compounds**: 15-20% RR reduction vs carbon black
• **Low hysteresis polymers**: Specialized rubber formulations
• **Filler optimization**: Carbon black particle size and structure
• **Plasticizers**: Reduce internal friction

**Operating Conditions**:

**Inflation Pressure**:
• **Underinflation**: Major RR increase (20% low = 10% RR increase)
• **Optimal pressure**: Manufacturer specification ±2 PSI
• **Overinflation**: Diminishing returns, ride quality impact

**Load Effects**:
• **Higher loads**: Increased deflection and hysteresis
• **Load index**: Stay within tire rating for optimal RR
• **Distribution**: Even loading across tread width

**Temperature Impact**:
• **Cold tires**: Higher RR due to stiff compound
• **Operating temperature**: 50-80°C optimal range
• **Excessive heat**: Compound degradation, increased losses

**Speed Dependency**:
• **Low speed**: Hysteresis dominant
• **High speed**: Aerodynamic effects increase
• **Typical formula**: Crr = Crr₀ + k × V²

**Design Optimization**:

**Tread Pattern**:
• **Solid ribs**: Lower RR than independent blocks
• **Groove depth**: Deeper = higher RR but better wet performance  
• **Sipe density**: More siping = higher RR but better traction
• **Void ratio**: 20-25% optimal for most applications

**Belt Package**:
• **Steel belt angle**: 18-22° for optimal stiffness/RR balance
• **Belt width**: Full tread coverage vs weight optimization
• **Cap ply**: High-angle overlay for high-speed stability

**Sidewall Design**:
• **Aspect ratio**: Lower profile = potentially lower RR
• **Sidewall thickness**: Minimize flexing losses
• **Construction**: Optimize cord angle and density

**Performance Trade-offs**:

**RR vs Wet Grip**:
• **Silica compounds**: Good compromise
• **Tread depth**: Safety vs efficiency balance
• **Pattern design**: Water evacuation vs smooth rolling

**RR vs Durability**:
• **Soft compounds**: Lower RR but faster wear
• **Construction**: Lighter vs more durable materials
• **Operating margins**: Performance vs longevity

**Measurement Standards**:
• **ISO 28580**: Standardized RR testing procedure
• **SAE J1269**: Alternative test methodology
• **EU tire labeling**: A-G rating system (A = lowest RR)

**Fuel Economy Impact**:
• **Rolling resistance**: ~15-20% of total vehicle energy at highway speeds
• **10% RR reduction**: ~1-2% fuel economy improvement
• **Cumulative effect**: Significant over vehicle lifetime

Modern low rolling resistance tires achieve 30-40% lower RR than conventional designs through advanced materials and optimized construction.

What's your target application - maximum fuel efficiency, balanced performance, or specific operating conditions?`;
    }

    if (msg.includes('temperature') && msg.includes('pressure')) {
        return `**Temperature and Pressure Effects on Tire Performance**:

**Temperature Effects**:

**Tread Compound Behavior**:
• **Glass transition temperature**: Critical performance threshold
• **Optimal range**: 80-120°C for maximum grip
• **Cold performance**: <10°C significant grip loss
• **Overheating**: >150°C rapid compound degradation

**Performance vs Temperature**:

**Grip Coefficient Changes**:
• **Summer compound**: Peak μ at 80-100°C
• **All-season**: Broader temperature range, lower peak
• **Winter compound**: Peak μ at 0-40°C
• **Racing slicks**: Very narrow optimal window (90-110°C)

**Temperature Generation**:
• **Hysteresis heating**: Primary heat source during operation
• **Friction heating**: Braking and acceleration
• **Ambient absorption**: Hot pavement, direct sunlight
• **Aerodynamic heating**: High-speed operation

**Pressure Effects**:

**Inflation Pressure Impact**:

**Contact Patch Shape**:
• **Underinflation**: Larger, edge-loaded contact patch
• **Proper inflation**: Uniform pressure distribution
• **Overinflation**: Smaller, center-loaded contact patch

**Performance Characteristics**:

**Underinflation (-20% pressure)**:
❌ **Negative Effects**:
• 15-20% reduced fuel economy
• 25% shorter tire life
• Poor handling response
• Increased heat generation
• Higher risk of sidewall failure

✅ **Potential Benefits**:
• Larger contact patch (more grip in some conditions)
• Better ride comfort
• Enhanced low-speed traction

**Overinflation (+20% pressure)**:
❌ **Negative Effects**:
• Reduced contact patch area
• Poor wet weather traction
• Harsh ride quality
• Increased wear in center of tread
• Higher risk of impact damage

✅ **Potential Benefits**:
• Lower rolling resistance
• Better steering response
• Reduced sidewall flexing

**Temperature-Pressure Relationship**:

**Gay-Lussac's Law**: P₁/T₁ = P₂/T₂

**Practical Application**:
• **10°C temperature rise**: ~1-2 PSI pressure increase
• **Cold inflation**: Set pressure when tires are cold
• **Operating pressure**: Can be 4-8 PSI higher than cold setting
• **Seasonal adjustment**: Required for temperature changes

**Combined Effects**:

**Hot Weather Performance**:
• **Increased pressure**: From temperature rise
• **Compound softening**: Better initial grip
• **Overheating risk**: Performance degradation above optimal
• **Blowout risk**: Excessive pressure + heat + load

**Cold Weather Performance**:
• **Decreased pressure**: Requires inflation adjustment
• **Compound hardening**: Significant grip loss
• **Increased rolling resistance**: Stiffer compound
• **Reduced flexibility**: Poor road conformance

**Monitoring and Management**:

**TPMS (Tire Pressure Monitoring)**:
• **Direct systems**: Pressure sensors in each wheel
• **Indirect systems**: ABS wheel speed comparison
• **Warning thresholds**: Typically 25% below recommended
• **Temperature compensation**: Advanced systems account for thermal effects

**Pressure Optimization**:

**Load-Based Adjustment**:
• **Light loads**: Can reduce pressure 2-4 PSI
• **Heavy loads**: May require pressure increase
• **Manufacturer guidelines**: Load/inflation tables
• **Maximum pressure**: Never exceed sidewall rating

**Performance Tuning**:
• **Track applications**: Pressure adjustment for grip vs wear
• **Cold pressure settings**: Account for operating temperature rise
• **Stagger**: Different pressures front/rear for handling balance

**Advanced Considerations**:

**Nitrogen Inflation**:
• **Benefits**: Less pressure variation with temperature
• **Moisture elimination**: Prevents internal corrosion
• **Molecular size**: Slower pressure loss over time
• **Cost vs benefit**: Marginal improvement for most applications

**Real-Time Monitoring**:
• **Racing applications**: Telemetry pressure/temperature data
• **Commercial fleets**: Continuous monitoring systems
• **Consumer systems**: Smartphone-connected sensors

**Optimal Operating Windows**:
• **Pressure range**: ±2 PSI of manufacturer specification
• **Temperature range**: Tread temp 60-120°C
• **Load limits**: Stay within tire load index rating
• **Speed rating**: Don't exceed tire speed capability

**Maintenance Best Practices**:
• **Monthly pressure checks**: When tires are cold
• **Seasonal adjustments**: Account for temperature changes
• **Visual inspections**: Check for uneven wear patterns
• **Professional inspection**: Annual tire health assessment

Proper pressure and temperature management can improve tire life by 25-40% while maintaining optimal performance and safety.

What's your specific concern - performance optimization, longevity, or safety compliance?`;
    }

    if (msg.includes('summer') && msg.includes('winter')) {
        return `**Summer vs Winter Tire Construction Differences**:

**Compound Chemistry**:

**Summer Tire Compounds**:
• **Harder compound**: Shore A 60-70 hardness
• **Polymer blend**: High styrene content for heat resistance
• **Silica/carbon black**: Optimized for dry/wet grip at higher temps
• **Operating range**: 7°C to 50°C+ optimal performance
• **Glass transition**: Lower Tg for flexibility at operating temps

**Winter Tire Compounds**:
• **Softer compound**: Shore A 45-55 hardness  
• **Specialized polymers**: High cis-polybutadiene content
• **Silica-enhanced**: Better wet grip and lower RR
• **Operating range**: -40°C to 7°C optimal performance
• **Plasticizers**: Maintain flexibility at sub-zero temperatures

**Tread Pattern Design**:

**Summer Tire Patterns**:
• **Continuous ribs**: Lower rolling resistance, highway stability
• **Wide grooves**: Efficient water evacuation
• **Solid shoulder blocks**: Maximum dry grip and cornering stability
• **Minimal siping**: Reduced block movement, better steering response
• **Asymmetric designs**: Optimized inside/outside performance zones

**Winter Tire Patterns**:
• **Deep, aggressive lugs**: Snow traction and self-cleaning
• **High sipe density**: 1500-2000+ sipes per tire
• **Narrow grooves**: Better snow retention and traction
• **Directional patterns**: V-shaped for snow evacuation  
• **Biting edges**: Maximize ice grip through edge contact

**Structural Construction**:

**Summer Tire Construction**:
• **Stiffer sidewalls**: Better handling precision
• **Lower aspect ratios**: Common in 40-series and below
• **High-speed rated**: Often W (168 mph) or Y (186 mph)
• **Belt construction**: Optimized for straight-line stability
• **Bead construction**: Emphasis on precise steering response

**Winter Tire Construction**:
• **Flexible sidewalls**: Better impact resistance in cold
• **Higher aspect ratios**: 60-70 series common for comfort
• **Speed ratings**: Typically H (130 mph) or V (149 mph)
• **Belt design**: Compromise between grip and durability
• **Reinforced construction**: Cold weather impact resistance

**Performance Characteristics**:

**Temperature Performance**:

**Summer Tires**:
✅ **Above 7°C**:
• Superior dry grip and cornering
• Excellent high-speed stability
• Lower rolling resistance
• Precise steering response

❌ **Below 7°C**:
• Compound hardening, reduced grip
• Poor cold weather traction
• Increased braking distances
• Safety risk in snow/ice

**Winter Tires**:
✅ **Below 7°C**:
• Maintained compound flexibility
• Superior snow/ice traction
• Shorter braking distances on cold/wet roads
• Better cold weather handling

❌ **Above 7°C**:
• Faster tread wear (50-70% of summer tire life)
• Higher rolling resistance
• Reduced precision in dry conditions
• Increased road noise

**Specialized Features**:

**Summer Performance Enhancements**:
• **Run-flat technology**: Extended mobility systems
• **Noise reduction**: Foam inserts, optimized patterns
• **Low rolling resistance**: Fuel efficiency optimization
• **UHP construction**: Ultra-high performance designs

**Winter Technology Innovations**:
• **Studding capability**: Metal stud installation points
• **Severe snow rating**: Mountain/snowflake symbol (3PMSF)
• **Ice-specific compounds**: Specialized grip compounds
• **Self-cleaning lugs**: Aggressive pattern for snow ejection

**All-Season Compromise**:
• **Moderate compound**: Performance between summer/winter
• **Year-round usability**: Acceptable in most conditions
• **Trade-offs**: Not optimal in extreme conditions
• **M+S rating**: Mud and snow capability (not severe snow)

**Selection Guidelines**:

**Summer Tires Best For**:
• Warm climates (year-round >7°C)
• Performance/sports car applications
• Maximum dry/wet grip requirements
• Fuel efficiency priorities

**Winter Tires Best For**:
• Cold climates (regular <7°C temperatures)
• Snow/ice driving conditions
• Safety-critical applications
• Seasonal mounting/storage acceptable

**Regional Considerations**:
• **Northern regions**: Dedicated winter tires recommended
• **Moderate climates**: All-season may be adequate
• **Performance applications**: Consider tire swapping
• **Commercial use**: Evaluate total cost of ownership

**Storage and Maintenance**:
• **Seasonal storage**: Cool, dry, away from UV light
• **Mounting/balancing**: Professional service recommended
• **Pressure adjustment**: Account for temperature changes
• **Rotation**: Different patterns for directional tires

Modern tire technology continues to push the boundaries of seasonal performance while maintaining durability and safety standards.

What's your specific climate and performance requirements for tire selection?`;
    }

    // General fallback responses
    const fallbacks = [
        `That's an excellent tire engineering question! As TireEdge AI, I can help you explore the fascinating world of tire dynamics, from contact mechanics to performance optimization.

Could you provide more details about:
• The specific tire application or vehicle type you're working with
• Your performance priorities (grip, longevity, efficiency, comfort)
• Operating conditions or constraints you're considering

This will help me provide the most relevant technical guidance for your tire engineering needs.`,

        `I'd be happy to help with your tire dynamics question! Tire engineering involves complex interactions between materials science, vehicle dynamics, and road surface physics.

To give you the most accurate information, could you tell me more about:
• Your specific application (passenger, commercial, racing, off-road)
• Performance challenges or optimization goals
• Environmental or operating conditions you need to consider

Let's dive into the tire dynamics together!`,

        `Fascinating question about tire technology! Tire engineering combines rubber chemistry, mechanical design, and vehicle dynamics to optimize the critical vehicle-road interface.

I can help you with detailed analysis of:
• Tire construction and material selection
• Contact mechanics and traction optimization
• Performance testing and validation methods
• Trade-offs between different performance characteristics

What specific aspect of tire engineering would you like to explore first?`
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

window.TireEdge = {
    sendMessage,
    clearChat,
    askQuestion,
    getConversationHistory: () => conversationHistory
};

console.log('TireEdge AI loaded successfully! 🚗🛞');