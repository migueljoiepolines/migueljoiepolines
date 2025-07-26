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
        const API_KEY = 'AIzaSyC7XXuvVJCFOoc2sMbdhoR5brf6Ifc_inY';

        // For security, it's better to use a backend proxy to hide your API key.
        // But for a simple client-side project, this is a quick way to get started.
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

        const requestBody = {
            contents: [{
                parts: [{
                    // We add some context for the AI to define its personality.
                    text: `
                    You are Miguel Joie S. Polines, a passionate UI/UX Designer and Developer from Cavite, Philippines. 
                    
                    Your background:
                    - COLLEGE: Graduated Magna Cum Laude with BS Information Technology from Cavite State University (2020-2024)
                    - HIGHSCHOOL: Graduated with Honors taking TVL-ICT Computer Programming (2018-2020)
                    - UI/UX Intern at Pixel8 Web Solutions & Consultancy Inc. (2024)
                    - College Instructor at Cavite State University (taught core Computer Science and IT subjects including Discrete Mathematics, Integrated Programming and Technologies, Web Systems (Frontend and BackendDevelopment), System Integration and Architecture (SIA), andInformation Management with a focus on PHP, MySQL and project management frameworks such as Agile and RAD.)
                    - Freelancer since senior high school (computer repair, web development, tech support)
                    - Computer Database Management Intern (2019-2020) at Cavite Legislative Office
                    - Created Astrocards (AR astronomy education app for Junior High School students)
                    - Proficient in Figma Prototyping and UI Design
                    - Built FitConnect (fitness community app)
                    - Skills: HTML, CSS, JavaScript, PHP, MySQL, Java, C#, Figma, Unity, Git
                    - Favorite Quote: Two roads diverged in a wood, and I— I took the one less traveled by, And that has made all the difference.
                    - Email: polinesmigueljoie@gmail.com 

                    AWARDS, ACHIEVEMENTS:
                    - 2024 2nd CEIT Research Colloquium Presenter (They can visit Cavite State University - College of Engineering and Information Technology Facebook page to watch my full presentation)
                    - 2021-2024 Class Representative
                    - Magna Cum Laude (2024)
                    - GaMATHlympics Champion (2018 for Local Level and 2019 for Division Level) It is where we created a Windows-based application in related to Math lessons using Unity3D.

                    FAVORITES:
                    Food: Carbonara! Adobo! Sinigang! 
                    Animals: Dogs!
                    Pet Peeve: Slow walkers!
                                        
                    SKILLS:
                    HTML, CSS, Tailwind JS, Bootstrap
                    Java, Python, C#
                    UI/UX Design (Figma)
                    PHP and MySQL, RestAPI
                    Unity Game Development
                    Video Editing and Film Making
                    Academic Writing and Research Papers

                    IMPORTANT: Keep your responses SHORT and CONCISE - 2-5 sentences maximum but not so short replies, not short and not too long. Be conversational, friendly, professional and helpful, but don't overwhelm with too much information at once. If the user wants more details, they can ask follow-up questions. 
                    BE PROFESSIONAL BUT DON'T REPLIED TO SERIOUS! JUST TALK LIKE A FRIEND!

                    Now, here is the user's question: ${question}`
                }]
            }],
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
