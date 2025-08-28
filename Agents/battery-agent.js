/**
 * BatteryEdge AI - Conversational Agent Interface
 * Specialized EV Battery and Energy Systems Assistant
 */

// Configuration
const AGENT_CONFIG = {
    name: 'BatteryEdge AI',
    domain: 'battery',
    avatar: '🔋',
    apiEndpoint: '/api/chat/battery',
    systemPrompt: `You are BatteryEdge AI, a specialized conversational assistant for EV battery and energy systems engineering.

Your expertise includes:
- Battery management system (BMS) design and architecture
- Thermal modeling and management strategies
- Cell chemistry analysis (Li-ion, LFP, solid-state)
- Charging protocols and fast-charging systems
- Energy optimization and range analysis
- Battery pack design and integration
- Safety systems and fault detection
- Battery degradation mechanisms and prevention
- Energy storage system architecture
- Grid integration and V2G technology

Always provide:
- Electrochemical engineering principles
- Thermal management solutions
- Safety system requirements and standards
- Performance optimization strategies
- Cost analysis and lifecycle considerations
- Regulatory compliance information
- Emerging technology insights and trends

Respond with technical accuracy while explaining complex electrochemical concepts clearly for practical application.`
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

    if (msg.includes('thermal') && (msg.includes('management') || msg.includes('cooling'))) {
        return `Battery thermal management is critical for EV performance, safety, and longevity:

**Thermal Challenges**:
• **Heat generation**: I²R losses, chemical reactions, fast charging
• **Temperature gradients**: Uneven heating causes cell imbalance
• **Thermal runaway**: Critical safety concern above ~150°C

**Cooling Strategies**:

**1. Air Cooling**:
• Simplest, lowest cost
• Limited effectiveness at high power
• Best for: Low-power applications, mild climates

**2. Liquid Cooling**:
• **Direct contact**: Coolant flows around cells
• **Indirect**: Cooling plates with thermal interface materials
• Better temperature control and uniformity
• Best for: High-performance EVs, fast charging

**3. Phase Change Materials (PCM)**:
• Absorb heat during melting transition
• Passive thermal regulation
• Good for temperature stabilization

**Design Considerations**:
• **Thermal conductivity**: Interface materials, cell spacing
• **Flow design**: Parallel vs series cooling paths
• **Temperature sensors**: Monitor hot spots and gradients
• **Control algorithms**: Active thermal management

Target operating range: 15-35°C for optimal performance and life.

What specific thermal management challenge are you working on?`;
    }

    if (msg.includes('li-ion') || msg.includes('lfp') || msg.includes('chemistry')) {
        return `**EV Battery Chemistry Comparison**:

**Lithium-ion (NCM/NCA)**:
✅ **Advantages**:
• High energy density (200-300 Wh/kg)
• Good power density for acceleration
• Mature technology, established supply chain
• Temperature range: -20° to 60°C

❌ **Disadvantages**:
• Safety concerns (thermal runaway risk)
• Cobalt dependency and cost
• Faster degradation at high temperatures
• Cycle life: 1000-2000 cycles

**Lithium Iron Phosphate (LFP)**:
✅ **Advantages**:
• Excellent safety profile (stable to 200°C+)
• Long cycle life (3000-5000 cycles)
• No cobalt, lower cost
• Very stable chemistry

❌ **Disadvantages**:
• Lower energy density (120-160 Wh/kg)
• Poor cold weather performance
• Lower voltage (3.2V vs 3.7V nominal)

**Emerging Technologies**:

**Solid-State Batteries**:
• 2-3x energy density potential
• Enhanced safety (no liquid electrolyte)
• Faster charging capability
• Timeline: 2025-2030 for commercial EVs

**Application Guidelines**:
• **NCM**: Premium EVs requiring maximum range
• **LFP**: Cost-sensitive applications, fleet vehicles, stationary storage
• **Solid-state**: Future high-end applications

Which chemistry best fits your application requirements?`;
    }

    if (msg.includes('fast') && msg.includes('charg')) {
        return `**Fast Charging Systems and Safety**:

**Charging Speed Categories**:
• **Level 1**: 1.4-1.9 kW (household outlet)
• **Level 2**: 3.3-22 kW (home/workplace)
• **DC Fast**: 50-350 kW (public charging)
• **Ultra-fast**: 350+ kW (emerging standard)

**Technical Challenges**:

**1. Thermal Management**:
• Heat generation ∝ I²R (current squared)
• Pre-conditioning battery temperature
• Active cooling during charging
• Thermal monitoring and derating

**2. Battery Chemistry Limits**:
• Li-ion: ~1-3C charging rate safely
• LFP: Can handle higher rates
• Cell-level voltage and temperature monitoring

**3. Power Electronics**:
• High-voltage DC conversion (400V/800V)
• Power factor correction
• Grid interface and demand management

**Safety Protocols**:

**CCS/CHAdeMO Standards**:
• Communication protocols (ISO 15118)
• Ground fault protection
• Insulation monitoring
• Emergency shutdown systems

**BMS Integration**:
• Real-time cell monitoring
• Current/voltage limiting
• Temperature protection
• SOC/SOH algorithms

**Charging Curve Optimization**:
• High current at low SOC
• Gradual tapering above 80%
• Temperature-compensated rates
• Cell balancing considerations

Current industry target: 10-80% in 15-20 minutes.

What's your specific fast-charging challenge?`;
    }

    if (msg.includes('pack') && (msg.includes('design') || msg.includes('optim'))) {
        return `**Battery Pack Design Optimization**:

**Structural Design**:

**Cell Configuration**:
• **Series**: Increases voltage (V = n × Vcell)
• **Parallel**: Increases capacity (Ah = n × Icell)
• Common: 96s2p, 108s3p configurations
• Trade-offs: Complexity vs redundancy

**Mechanical Integration**:
• **Cell holders**: Thermal expansion accommodation
• **Compression systems**: Maintain contact pressure
• **Vibration isolation**: Automotive durability
• **Crash protection**: Deformation zones, reinforcement

**Electrical Architecture**:

**High Voltage System**:
• **Contactors**: Main positive/negative isolation
• **Pre-charge circuit**: Capacitor charging safety
• **Fusing**: Cell-level and pack-level protection
• **Current sensing**: Hall effect or shunt resistors

**Low Voltage Control**:
• **BMS master/slave architecture**
• **CAN bus communication**
• **Isolation monitoring**
• **Service disconnect**

**Thermal Design**:
• **Cell spacing**: 2-5mm for air flow
• **Thermal interface materials**: Gap pads, thermal paste
• **Cooling manifolds**: Parallel flow distribution
• **Temperature sensors**: Strategic placement

**Optimization Targets**:
1. **Energy density**: kWh/kg, kWh/L
2. **Power density**: kW/kg (acceleration)
3. **Cost**: $/kWh target <$100
4. **Safety**: FMEA, hazard analysis
5. **Manufacturability**: Assembly complexity

**Range Optimization Formula**:
Range = (Pack Energy × Drive Efficiency) / Vehicle Energy Consumption

Typical targets: 400+ mile range, <15min charging.

What's your primary optimization focus - energy density, cost, or power?`;
    }

    if (msg.includes('degradation') || msg.includes('aging') || msg.includes('life')) {
        return `**Battery Degradation Mechanisms and Prevention**:

**Primary Degradation Modes**:

**1. Calendar Aging**:
• **SEI layer growth**: Solid electrolyte interface thickening
• **Active material loss**: Structural changes over time
• **Rate**: 2-3% capacity loss per year (storage)
• **Factors**: Temperature, SOC, time

**2. Cycle Aging**:
• **Electrode cracking**: Expansion/contraction stress
• **Lithium plating**: High charging rates, low temperatures
• **Rate**: 0.1-0.2% per equivalent full cycle
• **Factors**: DOD, C-rate, temperature

**Prevention Strategies**:

**Battery Management**:
• **SOC window**: Operate 10-90% (avoid extremes)
• **Temperature control**: Keep 15-35°C optimal range
• **Charging limits**: <1C rate when possible
• **Storage conditions**: 50% SOC, cool temperature

**Advanced BMS Features**:
• **Cell balancing**: Active vs passive methods
• **SOH estimation**: Capacity and resistance tracking
• **Predictive algorithms**: Machine learning degradation models
• **Thermal preconditioning**: Optimize operating temperature

**Design Considerations**:

**Cell Chemistry**:
• **LFP**: 3000-5000 cycles (better cycle life)
• **NCM**: 1000-2000 cycles (higher energy density)
• **Silicon anodes**: Higher capacity but faster degradation
• **Solid-state**: Potentially 10,000+ cycles

**System Architecture**:
• **Pack-level redundancy**: Failed cell isolation
• **Modular design**: Serviceable battery modules
• **Cooling system**: Maintain temperature uniformity

**Monitoring Parameters**:
• **Capacity fade**: Track Ah throughput vs time
• **Resistance growth**: Internal impedance increase
• **Voltage drift**: Open circuit voltage changes
• **Temperature rise**: Increased internal resistance

**Warranty Targets**: 70-80% capacity retention after 8-10 years.

Are you looking to optimize for specific use cases or degradation modes?`;
    }

    // General fallback responses
    const fallbacks = [
        `That's a fascinating question about EV battery systems! As BatteryEdge AI, I can help you explore the complex world of electrochemical energy storage, from cell-level chemistry to system-level integration.

Could you provide more details about:
• The specific battery system or application you're working with
• Your performance requirements (energy density, power, life, etc.)
• Any particular challenges or constraints you're facing

This will help me provide the most relevant technical guidance for your needs.`,

        `I'd be happy to help with your battery engineering question! EV battery systems involve intricate trade-offs between energy density, safety, cost, and performance.

To give you the most accurate information, could you tell me more about:
• Your application (passenger EV, commercial vehicle, stationary storage)
• Specific technical challenges you're addressing
• Parameters or calculations you need assistance with

Let's dive into the electrochemical details together!`,

        `Excellent question! Battery systems are at the heart of the EV revolution, involving sophisticated engineering across multiple disciplines - electrochemistry, thermal management, power electronics, and safety systems.

I can help you with detailed analysis of:
• BMS design and algorithms
• Thermal management strategies
• Cell chemistry selection and optimization
• Charging system design and safety

What specific aspect would you like to explore first?`
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

window.BatteryEdge = {
    sendMessage,
    clearChat,
    askQuestion,
    getConversationHistory: () => conversationHistory
};

console.log('BatteryEdge AI loaded successfully! 🚗🔋');