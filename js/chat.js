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
        // IMPORTANT: Replace with your actual Google AI Studio API key.
        // Get your free key from https://aistudio.google.com/
        const API_KEY = 'AIzaSyCakf9zjsg5MY_Ug6PJHLpiuZu_cXCEJ94';

        // Pre-cached responses for common questions to avoid API calls
        const quickAnswers = {
            'who are you': "Hi! I'm Miguel Joie, a UI/UX Designer and Developer from the Philippines. I create apps and teach at university!",
            'what do you do': "I'm a UI/UX Designer and Developer! I build apps like Astrocards and FitConnect, and teach Computer Science.",
            'your skills': "I work with HTML/CSS/JS, PHP/MySQL, Figma for design, and Unity for AR development!",
            'contact you': "You can reach me at polinesmigueljoie@gmail.com - I'd love to connect!",
            'your email': "My email is polinesmigueljoie@gmail.com",
            'your projects': "I've built Astrocards (AR astronomy app) and FitConnect (fitness community app). Always working on something new!",
            'your education': "I graduated Magna Cum Laude with a BS in Information Technology from Cavite State University."
        };

        // Check for quick answers first
        const lowerQ = question.toLowerCase().trim();
        for (const [key, answer] of Object.entries(quickAnswers)) {
            if (lowerQ.includes(key) || lowerQ === key) {
                return answer;
            }
        }

        // For security, it's better to use a backend proxy to hide your API key.
        // But for a simple client-side project, this is a quick way to get started.
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

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

        const requestBody = {
            contents: [{
                parts: [{
                    text: `${getContextForQuestion(question)}\n\nQ: ${question}`
                }]
            }],
            generationConfig: {
                maxOutputTokens: 100, // Limit response length
                temperature: 0.7
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
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error:', errorData.error.message);
                return `Sorry, I encountered an error: ${errorData.error.message}`;
            }

            const data = await response.json();

            if (data.candidates && data.candidates.length > 0 && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
                return data.candidates[0].content.parts[0].text;
            } else {
                // This can happen if the response is blocked for safety reasons.
                console.warn('AI response was empty or blocked.', data);
                return "I'm sorry, I can't answer that question. It might be against my safety policy. Please ask something else.";
            }

        } catch (error) {
            console.error('Network error:', error);
            return "Sorry, there was a network error. Please check your connection and make sure you have replaced 'YOUR_API_KEY' with your actual Gemini API key in the `js/chat.js` file.";
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

        // Display user message
        appendMessage(question, 'user');
        textarea.value = '';
        textarea.style.height = '56px'; // Reset height

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

        // Auto-resize textarea
        textarea.addEventListener('input', () => {
            textarea.style.height = 'auto'; // Reset height to shrink if needed
            textarea.style.height = (textarea.scrollHeight) + 'px';
        });
    }

    // Handle initial question from URL
    handleInitialQuestion();
});
