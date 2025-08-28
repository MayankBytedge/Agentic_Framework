/**
 * ClutchEdge AI - Conversational Agent Interface
 * Specialized Clutch and Drivetrain Engineering Assistant
 */

// Configuration
const AGENT_CONFIG = {
    name: 'ClutchEdge AI',
    domain: 'clutch',
    avatar: '⚙️',
    apiEndpoint: '/api/chat/clutch',
    systemPrompt: `You are ClutchEdge AI, a specialized conversational assistant for clutch and drivetrain engineering. 

Your expertise includes:
- Clutch system design and mechanics
- Torque transmission and analysis  
- Friction material engineering and selection
- Dual-clutch and automated clutch systems
- CVT and transmission integration
- Drivetrain optimization and efficiency
- Clutch engagement dynamics and tuning
- Performance clutch applications
- Clutch wear analysis and maintenance
- Hydraulic and electronic actuation systems

Always provide:
- Technical accuracy with engineering principles
- Practical solutions and recommendations  
- Safety considerations and best practices
- Industry standards and regulations
- Material specifications and properties
- Performance metrics and calculations

Respond in a professional yet approachable manner, explaining complex concepts clearly while maintaining technical depth.`
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
    // Set up auto-resize for textarea
    autoResizeTextarea(messageInput);

    // Initialize character counter
    updateCharacterCount();

    // Focus on input
    messageInput.focus();

    console.log(`${AGENT_CONFIG.name} initialized successfully`);
}

function setupEventListeners() {
    // Send message on Enter (but allow Shift+Enter for new lines)
    messageInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Auto-resize textarea
    messageInput.addEventListener('input', function() {
        updateCharacterCount();
        autoResizeTextarea(this);
    });

    // Send button click
    sendButton.addEventListener('click', sendMessage);

    // Prevent form submission on Enter
    messageInput.closest('form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        sendMessage();
    });
}

function updateCharacterCount() {
    const count = messageInput.value.length;
    const maxLength = parseInt(messageInput.getAttribute('maxlength')) || 2000;
    characterCount.textContent = `${count}/${maxLength}`;

    // Change color when approaching limit
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

    // Disable input and show processing state
    setProcessingState(true);

    // Add user message to chat
    addMessage(message, 'user');

    // Clear input
    messageInput.value = '';
    updateCharacterCount();
    autoResizeTextarea(messageInput);

    // Show typing indicator
    showTypingIndicator();

    try {
        // Send to backend API
        const response = await sendToAPI(message);

        // Hide typing indicator
        hideTypingIndicator();

        if (response.success) {
            addMessage(response.message, 'agent');

            // Store conversation history
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
    // Simulate API call for now - replace with actual Gemini API integration
    return new Promise((resolve) => {
        setTimeout(() => {
            // Simulate different responses based on keywords
            let response = generateContextualResponse(message);

            resolve({
                success: true,
                message: response,
                timestamp: new Date().toISOString()
            });
        }, 1500 + Math.random() * 1000); // Simulate network delay
    });
}

function generateContextualResponse(message) {
    const msg = message.toLowerCase();

    // Clutch-specific responses
    if (msg.includes('dual') && msg.includes('clutch')) {
        return `Dual-clutch transmissions (DCT) use two separate clutches for odd and even gear sets. This allows for seamless gear changes without interrupting power delivery. Key advantages include:

• **Faster shifts**: Pre-selection of next gear eliminates shift gaps
• **Improved efficiency**: No torque converter losses like in automatics  
• **Enhanced performance**: Continuous power delivery during shifts
• **Fuel economy**: Better than traditional automatics, approaching manual efficiency

The system uses wet or dry clutches depending on torque requirements. Wet clutches (oil-cooled) handle higher torque but have slightly lower efficiency, while dry clutches are more efficient but limited to lower torque applications.

Would you like me to explain the control algorithms or specific design considerations?`;
    }

    if (msg.includes('torque') && (msg.includes('capacity') || msg.includes('calculation'))) {
        return `Clutch torque capacity is determined by several key factors:

**Primary Formula**: T = μ × N × F × R_mean

Where:
• μ = Coefficient of friction (material dependent)
• N = Number of friction surfaces
• F = Clamping force (from pressure plate/springs)
• R_mean = Mean effective radius of friction surfaces

**Key Design Factors**:
1. **Friction material**: Organic (μ≈0.35), Ceramic (μ≈0.4-0.5), Carbon (μ≈0.25-0.4)
2. **Surface area**: Larger diameter = higher capacity
3. **Clamping force**: Spring pressure or hydraulic actuation
4. **Operating temperature**: Friction coefficient varies with heat

**Safety margin**: Typically design for 20-30% above peak engine torque to account for engine modifications and dynamic loads.

What specific application or torque range are you working with?`;
    }

    if (msg.includes('friction') && msg.includes('material')) {
        return `Clutch friction material selection depends on application requirements:

**Organic Materials** (Paper-based):
• Smooth engagement, low noise
• Good modulation characteristics  
• Lower cost, easier on flywheel
• Best for: Street applications, daily driving
• μ ≈ 0.35, max temp ~450°F

**Ceramic Materials**:
• Higher friction coefficient (μ ≈ 0.4-0.5)
• Better heat resistance (~800°F)
• Longer wear life
• More aggressive engagement
• Best for: Performance/racing applications

**Carbon-Carbon Composites**:
• Consistent friction at high temps
• Lightweight, excellent heat dissipation
• Very long life but expensive
• Best for: Professional racing, extreme duty

**Selection Criteria**:
1. Torque requirements vs. material capacity
2. Operating temperature range
3. Engagement characteristics needed
4. Cost vs. performance requirements
5. Compatibility with flywheel material

What's your specific application - street, track, or racing?`;
    }

    if (msg.includes('engagement') || msg.includes('smooth')) {
        return `Optimizing clutch engagement smoothness involves several tuning parameters:

**Mechanical Factors**:
• **Spring pressure curve**: Progressive springs provide smoother initial engagement
• **Friction surface design**: Grooved or segmented surfaces aid initial bite
• **Flywheel weight**: Heavier flywheels smooth engagement but reduce response

**Material Considerations**:
• **Friction coefficient progression**: How μ changes with slip speed
• **Surface finish**: Rougher surfaces grab more aggressively
• **Material compliance**: Softer materials conform better, smoother engagement

**Tuning Parameters**:
1. **Pedal free play**: 1-2mm for proper disengagement
2. **Release bearing preload**: Affects pedal feel and engagement point
3. **Pressure plate geometry**: Lever ratio affects clamping force curve
4. **Hydraulic actuation**: Master/slave cylinder ratio affects pedal effort

**Electronic Control** (modern systems):
• Slip speed monitoring for optimal engagement timing
• Temperature compensation for consistent feel
• Learning algorithms for wear compensation

Are you looking to tune an existing system or designing a new clutch setup?`;
    }

    if (msg.includes('wet') && msg.includes('dry')) {
        return `**Wet vs Dry Clutch Comparison**:

**Wet Clutches** (Oil Bath):
✅ **Advantages**:
• Superior cooling and lubrication
• Smoother engagement, better modulation
• Longer life, especially under high-slip conditions
• Can handle higher torque loads
• Self-cleaning action removes wear particles

❌ **Disadvantages**:
• Viscous drag losses (2-3% efficiency loss)
• More complex sealing requirements
• Oil maintenance requirements
• Heavier, more expensive

**Dry Clutches**:
✅ **Advantages**:
• Higher efficiency (no viscous losses)
• Simpler construction, lower cost
• Lighter weight
• Direct mechanical feel
• No oil contamination issues

❌ **Disadvantages**:
• Higher operating temperatures
• More aggressive engagement
• Shorter life under high-slip conditions
• Dust and contamination sensitive

**Application Guidelines**:
• **Wet**: High-torque applications, frequent use, automated systems
• **Dry**: Efficiency-critical applications, manual systems, cost-sensitive designs

**Modern Trends**: Many manufacturers use dry clutches for efficiency but add electronic control for smooth engagement.

What's your primary concern - efficiency, durability, or cost?`;
    }

    // General fallback responses
    const fallbacks = [
        `That's an excellent question about clutch systems! As ClutchEdge AI, I can help you dive deep into clutch engineering principles, design considerations, and performance optimization. 

Could you provide more specific details about:
• The type of clutch system you're working with
• Your performance requirements or constraints  
• The specific aspect you'd like to explore further

This will help me give you the most relevant technical guidance.`,

        `I'd be happy to help with your clutch engineering question! Based on my expertise in drivetrain systems, I can provide detailed analysis on clutch design, performance tuning, and material selection.

To give you the most accurate information, could you tell me more about:
• Your application (automotive, industrial, racing, etc.)
• Current challenges you're facing
• Specific parameters or calculations needed

Let's work through this together!`,

        `Great question! Clutch systems involve fascinating engineering trade-offs between torque capacity, engagement characteristics, thermal management, and durability.

I can help you with detailed analysis of:
• Design calculations and material selection
• Performance optimization strategies
• Troubleshooting existing systems
• Comparative analysis of different clutch types

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

    // Convert markdown-like formatting to HTML
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
        // Bold text **text**
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // Bullet points
        .replace(/^[•▸]\s/gm, '<span class="bullet">•</span> ')
        // Code blocks (inline)
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        // Line breaks
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

// Quick action functions
function askQuestion(question) {
    messageInput.value = question;
    updateCharacterCount();
    autoResizeTextarea(messageInput);
    messageInput.focus();
}

function clearChat() {
    if (confirm('Are you sure you want to clear the chat history?')) {
        // Remove all messages except welcome
        const messages = chatMessages.querySelectorAll('.message:not(.welcome-message)');
        messages.forEach(msg => {
            msg.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => msg.remove(), 300);
        });

        conversationHistory = [];
        messageCount = 0;

        // Reset input
        messageInput.value = '';
        updateCharacterCount();
        messageInput.focus();
    }
}

// Add CSS for fadeOut animation
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

// Export for potential external use
window.ClutchEdge = {
    sendMessage,
    clearChat,
    askQuestion,
    getConversationHistory: () => conversationHistory
};

console.log('ClutchEdge AI loaded successfully! 🚗⚙️');