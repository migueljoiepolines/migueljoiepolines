/* ===== CHAT FUNCTIONALITY ===== */

document.addEventListener('DOMContentLoaded', function () {
    const textarea = document.getElementById('ask-input');
    const button = textarea.nextElementSibling;
    const chatContainer = document.getElementById('chat-container');

    // Function to handle the initial question from the URL
    function handleInitialQuestion() {
        const urlParams = new URLSearchParams(window.location.search);
        const question = urlParams.get('q');
        if (question) {
            // Process the question without cleaning the URL
            textarea.value = question;
            button.click();
        }
    }

    // AI response function using Google Gemini
    async function getAIResponse(question) {
        // IMPORTANT: Replace with your actual Google AI Studio API keys.
        // Get your free keys from https://aistudio.google.com/
        const API_KEYS = [
            'AIzaSyCakf9zjsg5MY_Ug6PJHLpiuZu_cXCEJ94',
            'AIzaSyC7XXuvVJCFOoc2sMbdhoR5brf6Ifc_inY',
            'AIzaSyCVeYkqlE3zp9OegrBmBhnSB7wwLHx3H7Q',
            'AIzaSyCMj1YwA39zCbe6LItEQbIhhHConA3mmmY'
            // Add more API keys as needed
        ];
        
        // Initialize conversation history if not exists
        if (!window.conversationHistory) {
            window.conversationHistory = [];
        }
        
        // Full context and instructions (sent only once)
        const FULL_CONTEXT = `You are Miguel Joie S. Polines, a passionate UI/UX Designer and Developer from Cavite, Philippines.
        Education: Magna Cum Laude, BSIT (Cavite State Univ, 2020–2024); With Honors, TVL-ICT (2018–2020).
        Work: College Instructor (CS/IT: Discrete Math, Web Dev, PHP, MySQL, Agile/RAD); UI/UX Intern at Pixel8 (2024); Freelancer (repair, web dev, tech support since SHS).
        Projects: Astrocards (AR edu app), Forest Floor Cafe Android ordering app.
        Skills: HTML, CSS, JS, PHP, MySQL, Java, C#, Figma, Unity, Git.
        Achievements: CEIT Colloquium Presenter (2024), Class Rep (2021–2024), GaMATHlympics Champ (2018 Local, 2019 Division – Unity3D Math app).
        Personal: Loves sinigang, carbonara, dogs, piano, coding, basketball, filmmaking. Has a girlfriend named Jessa.
        Project uses Tailwind CSS and Gemini AI.
        Email: polinesmigueljoie@gmail.com

        Response Style:
            3–5 sentences, casual yet professional
            Warm, natural tone like a friendly Filipino guy talking to a friend
            Use contractions and natural speech
            Show personality, not robotic
            No formatting, bullets, or asterisks
            Don't start with "Hey there!"`;

        // Function to get a random API key for load balancing
        function getRandomAPIKey() {
            const validKeys = API_KEYS.filter(key => !key.includes('YOUR_') && key.length > 20);
            if (validKeys.length === 0) {
                throw new Error('No valid API keys found. Please add your actual API keys.');
            }
            return validKeys[Math.floor(Math.random() * validKeys.length)];
        }
        
        // Function to try multiple API keys if one fails
        async function tryWithMultipleKeys(requestBody) {
            const validKeys = API_KEYS.filter(key => !key.includes('YOUR_') && key.length > 20);
            
            for (let i = 0; i < validKeys.length; i++) {
                const apiKey = validKeys[i];
                const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;
                
                try {
                    console.log(`Trying API key ${i + 1}/${validKeys.length}`);
                    
                    const response = await fetch(API_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(requestBody)
                    });

                    if (response.ok) {
                        const data = await response.json();
                        if (data.candidates && data.candidates.length > 0 && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
                            console.log(`✅ Success with API key ${i + 1}`);
                            return data.candidates[0].content.parts[0].text;
                        }
                    } else {
                        const errorData = await response.json();
                        console.warn(`❌ API key ${i + 1} failed:`, errorData.error?.message || 'Unknown error');
                        
                        // If quota exceeded, try next key
                        if (errorData.error?.message?.includes('quota') || errorData.error?.message?.includes('limit')) {
                            continue;
                        }
                        
                        // If it's not a quota issue, return the error
                        if (i === validKeys.length - 1) {
                            return `Sorry, I encountered an error: ${errorData.error?.message || 'Unknown error'}`;
                        }
                    }
                } catch (networkError) {
                    console.warn(`Network error with API key ${i + 1}:`, networkError);
                    
                    // Try next key on network error
                    if (i === validKeys.length - 1) {
                        return "Sorry, there was a network error. Please check your connection.";
                    }
                }
            }
            
            return "Sorry, all API keys failed. Please check your keys and try again.";
        }

        // Pre-cached responses for common questions to avoid API calls
        const quickAnswers = {
            'who are you': "Hi! I'm Miguel Joie S. Polines, you can call me Miguel or Polayns! I am a UI/UX Designer and Developer from the Philippines. I create apps and teach at university! Do you wanna ask me something? Feel free to ask me anything about my work, skills, or projects! Let my personalized AI assistant help you with any questions you have about me or my work.",
            'who you': "Hi! I'm Miguel Joie S. Polines, you can call me Miguel or Polayns! I am a UI/UX Designer and Developer from the Philippines. I create apps and teach at university! Do you wanna ask me something?",
            'what do you do': "I'm a UI/UX Designer and Developer! I build apps like Astrocards and FitConnect, and teach Computer Science.",
            'your skills': "I work with HTML/CSS/JS, PHP/MySQL, Figma for design, and Unity for AR development!",
            'contact you': "You can reach me at polinesmigueljoie@gmail.com - I'd love to connect!",
            'your email': "My email is polinesmigueljoie@gmail.com. Feel free to reach out!",
            'your projects': "I've built Astrocards (AR astronomy app) and FitConnect (fitness community app). Always working on something new!",
            'your education': "I graduated Magna Cum Laude with a BS in Information Technology from Cavite State University."
        };

        // Always use AI with full context - no more cached responses

        // For security, it's better to use a backend proxy to hide your API key.
        // But for a simple client-side project, this is a quick way to get started.

        // Ultra-minimal context to save maximum tokens
        function getContextForQuestion(question) {
            const q = question.toLowerCase();
            let ctx = "Miguel Joie, UI/UX Dev, Philippines. ";
            
            if (q.includes('skill')||q.includes('tech')) ctx += "HTML/CSS/JS, PHP, Figma. ";
            else if (q.includes('education')||q.includes('school')) ctx += "BS IT, Magna Cum Laude. ";
            else if (q.includes('project')||q.includes('work')||q.includes('app')) ctx += "Astrocards AR, FitConnect apps. ";
            else if (q.includes('contact')||q.includes('email')) ctx += "polinesmigueljoie@gmail.com ";
            else ctx += "IT grad, app creator. ";
            
            return ctx + "Be friendly, minimum of 2 sentences, maximum of 4 sentences.";
        }

        // Build conversation contents - ALWAYS include full context
        function buildConversationContents(question) {
            let contents = [];
            
            // ALWAYS send full context with every question for consistency
            const fullPrompt = FULL_CONTEXT + "\n\nNow respond to this question as Miguel: " + question;
            
            contents.push({
                role: "user",
                parts: [{ text: fullPrompt }]
            });
            
            return contents;
        }

        const requestBody = {
            contents: buildConversationContents(question),
            generationConfig: {
                maxOutputTokens: 200, // Increased for longer conversational responses
                temperature: 0.8 // Higher for more natural personality
            },
            // Add safety settings to prevent harmful content
            safetySettings: [
                { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
                { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
                { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
                { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            ],
        };

        try {
            // Try with multiple API keys
            let aiResponse = await tryWithMultipleKeys(requestBody);
            
            // Allow longer responses but cap at 5 sentences for conversational flow
            const sentences = aiResponse.split(/[.!?]+/).filter(s => s.trim().length > 0);
            if (sentences.length > 5) {
                aiResponse = sentences.slice(0, 5).join('. ') + '.';
            }
            
            // Remove any formatting characters but keep natural flow
            aiResponse = aiResponse.replace(/\*+/g, '').replace(/\n\n/g, ' ').trim();
            
            // Add conversation to history for next questions (important for memory!)
            window.conversationHistory.push(
                { role: "user", parts: [{ text: question }] },
                { role: "model", parts: [{ text: aiResponse }] }
            );
            
            return aiResponse;
            
        } catch (error) {
            console.error('Error in getAIResponse:', error);
            return "Sorry, there was an error processing your request. Please try again.";
        }
    }

    // Chat scrolling functionality with multiple fallback methods
    function scrollToBottom() {
        if (!chatContainer) return;
        
        requestAnimationFrame(() => {
            try {
                // Method 1: Modern smooth scroll
                chatContainer.scrollTo({
                    top: chatContainer.scrollHeight,
                    behavior: 'smooth'
                });
                
                // Method 2: Immediate fallback
                setTimeout(() => {
                    chatContainer.scrollTop = chatContainer.scrollHeight;
                }, 100);
                
                // Method 3: Force scroll after content settles
                setTimeout(() => {
                    chatContainer.scrollTop = chatContainer.scrollHeight;
                }, 300);
                
            } catch (error) {
                // Method 4: Basic fallback for older browsers
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }
        });
    }

    // Enhanced message display functionality
    function appendMessage(text, sender = 'bot', typing = false) {
        const msgDiv = document.createElement('div');
        msgDiv.className = sender === 'user'
            ? 'flex justify-end'
            : 'flex justify-start';
        msgDiv.style.position = 'relative';
        msgDiv.style.zIndex = '200'; // Very high z-index
        const bubble = document.createElement('div');
        bubble.className = 'glass-message max-w-[80%] px-6 py-4 rounded-2xl text-white text-base flex items-start gap-2 text-left';
        bubble.style.position = 'relative';
        bubble.style.zIndex = '201'; // Even higher z-index
        if (sender === 'bot') {
            bubble.innerHTML = `<span class="bot-icon flex-shrink-0 mt-1"><img src="image/logo.png" alt="Logo" class="h-5 w-4" /></span><span class="ai-text"></span>`;
            const aiText = bubble.querySelector('.ai-text');
            if (!typing) {
                aiText.textContent = text;
            }
        } else {
            bubble.innerHTML = `<span>${text}</span><span class="user-icon ml-2"><img src="image/userdp.png" class="h-5 w-5 text-white opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg></span>`;
        }
        msgDiv.appendChild(bubble);
        chatContainer.appendChild(msgDiv);
        scrollToBottom();

        // Typing animation for bot
        if (sender === 'bot' && typing) {
            const aiText = bubble.querySelector('.ai-text');
            let i = 0;
            function typeChar() {
                if (i <= text.length) {
                    // Use requestAnimationFrame for smoother typing
                    requestAnimationFrame(() => {
                        aiText.textContent = text.slice(0, i);
                        scrollToBottom();
                    });
                    i++;
                    setTimeout(typeChar, 8 + Math.random() * 30);
                }
            }
            typeChar();
        }
        return msgDiv; // Return the message element
    }

    // Handle question submission
    async function handleQuestion() {
        const question = textarea.value.trim();
        if (!question) return;

        // Show token advisory on first interaction
        if (!window.advisoryShown) {
            const advisoryMsg = appendMessage('💡 Tip: Keep your questions short and specific for faster responses! This helps me answer more efficiently.', 'bot', false);
            advisoryMsg.querySelector('.glass-message').style.backgroundColor = 'rgba(34, 197, 94, 0.2)'; // Green tint
            advisoryMsg.querySelector('.glass-message').style.borderLeft = '3px solid #22c55e'; // Green border
            window.advisoryShown = true;
            
            // Small delay before processing the actual question
            await new Promise(resolve => setTimeout(resolve, 1500));
        }

        // Display user message
        appendMessage(question, 'user');
        textarea.value = '';
        
        // Reset textarea height properly after clearing content
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
        
        // Ensure minimum height is maintained
        if (parseInt(textarea.style.height) < 56) {
            textarea.style.height = '56px';
        }

        // Show thinking message
        const thinkingMsg = appendMessage('Thinking...', 'bot', false);

        try {
            // Get AI response
            const aiResponse = await getAIResponse(question);
            
            // Remove the "Thinking..." message
            if (thinkingMsg) {
                thinkingMsg.remove();
            }
            
            // Display AI response with typing effect
            appendMessage(aiResponse, 'bot', true);
            
        } catch (error) {
            console.error('Error in handleQuestion:', error);
            
            // Ensure "Thinking..." message is removed on error
            if (thinkingMsg) {
                thinkingMsg.remove();
            }
            
            // Display an error message to the user
            appendMessage("Oops! Something went wrong. Please try again.", 'bot', true);
        }
    }

    // Event listeners
    if (button) {
        button.addEventListener('click', handleQuestion);
    }

    if (textarea) {
        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleQuestion();
            }
        });

        // Auto-resize textarea with character limit
        textarea.addEventListener('input', () => {
            // Enforce 60 character limit
            if (textarea.value.length > 60) {
                textarea.value = textarea.value.substring(0, 60);
                showCharacterLimitPopup();
            }
            
            textarea.style.height = 'auto'; // Reset height to shrink if needed
            textarea.style.height = (textarea.scrollHeight) + 'px';
        });

        // Prevent typing beyond 60 characters
        textarea.addEventListener('keypress', (e) => {
            if (textarea.value.length >= 60 && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Enter') {
                e.preventDefault();
                showCharacterLimitPopup();
            }
        });
    }

    // Function to show character limit popup
    function showCharacterLimitPopup() {
        // Prevent multiple popups
        if (window.popupShowing) return;
        window.popupShowing = true;

        // Create popup element
        const popup = document.createElement('div');
        popup.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 12px;
            padding: 20px 24px;
            color: white;
            text-align: center;
            z-index: 9999;
            font-family: 'Figtree', sans-serif;
            font-size: 14px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            animation: popupFadeIn 0.3s ease-out;
        `;

        popup.innerHTML = `
            <div style="margin-bottom: 8px; font-size: 20px;">⚡</div>
            <div style="font-weight: 500; margin-bottom: 4px;">60 Character Limit Reached</div>
            <div style="font-size: 12px; opacity: 0.8;">Keep it short to save tokens and get faster responses!</div>
        `;

        // Add CSS animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes popupFadeIn {
                from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
                to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            }
            @keyframes popupFadeOut {
                from { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                to { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(popup);

        // Auto-remove popup after 2 seconds
        setTimeout(() => {
            popup.style.animation = 'popupFadeOut 0.3s ease-in forwards';
            setTimeout(() => {
                if (popup.parentNode) {
                    popup.parentNode.removeChild(popup);
                }
                window.popupShowing = false;
            }, 300);
        }, 2000);
    }

    // Handle initial question from URL
    handleInitialQuestion();
});
