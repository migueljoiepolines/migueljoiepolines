import { getAnswer } from './answers.js';

document.addEventListener('DOMContentLoaded', function () {
    const textarea = document.getElementById('ask-input');
    const button = textarea.nextElementSibling;
    const chatContainer = document.getElementById('chat-container');

    // Real AI response function using Node.js backend
    async function getAIResponse(question) {
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: question
                })
            });

            if (!response.ok) {
                // Get error message from server and fall back
                const errorData = await response.json();
                console.error('Backend Error:', errorData.error);
                return await getLocalAIResponse(question);
            }
            
            const data = await response.json();
            return data.response;

        } catch (error) {
            console.error('Network error, falling back to local:', error);
            return await getLocalAIResponse(question);
        }
    }

    // Enhanced local AI-like response function
    async function getLocalAIResponse(question) {
        console.log("⚠️ Using static fallback response.");
        const q = question.toLowerCase();
        const currentTime = new Date().toLocaleTimeString();
        const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        
        // Time-based responses
        if (q.includes('time') || q.includes('what time')) {
            return `It's currently ${currentTime} on this ${currentDay}. Is there anything else about Miguel or his work you'd like to know?`;
        }
        
        // Greeting responses with more variety
        if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('good morning') || q.includes('good afternoon')) {
            const greetings = [
                "Hello! I'm Miguel's AI assistant. How can I help you learn about his work and experience?",
                "Hi there! I'm here to tell you all about Miguel Joie S. Polines. What would you like to know?",
                "Hey! Nice to meet you. I can share information about Miguel's projects, skills, and background. What interests you most?",
                "Greetings! I'm excited to chat about Miguel's amazing journey in tech and design. What aspect catches your attention?",
                "Hello and welcome! I've got tons of insights about Miguel's professional life. Where shall we start?",
                "Hi! It's great to meet you. Miguel has such an interesting background - from academics to development. What would you like to explore?"
            ];
            return greetings[Math.floor(Math.random() * greetings.length)];
        }
        
        // Enhanced responses with more variation
        if (q.includes('how are you') || q.includes('how do you feel')) {
            const responses = [
                "I'm doing great! I'm excited to share information about Miguel's amazing work. He's built some really impressive projects. Would you like to hear about them?",
                "Fantastic! I love talking about Miguel's journey from academic instructor to full-stack developer. It's quite inspiring!",
                "I'm wonderful, thanks for asking! Miguel's story always energizes me - from teaching IT to creating beautiful user experiences. What interests you most?",
                "Great! I'm always enthusiastic about Miguel's diverse skill set. He's done everything from Android development to video editing!"
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }
        
        // Enhanced skill-related responses
        if (q.includes('skill') || q.includes('technology') || q.includes('programming')) {
            const skillResponses = [
                "Miguel has an impressive tech stack! He's proficient in web development (HTML, CSS, JavaScript), UI/UX design, Android development, and even video editing. His academic background in IT really shows in his diverse capabilities!",
                "That's a great question! Miguel's skills span across multiple domains - from front-end technologies and mobile app development to design thinking and educational content creation. He's truly a versatile tech professional!",
                "Miguel's technical expertise is quite broad! He combines his strong foundation in Information Technology with practical experience in web development, mobile apps, and creative design. Plus, his teaching background gives him excellent communication skills!"
            ];
            return skillResponses[Math.floor(Math.random() * skillResponses.length)];
        }
        
        // Enhanced project responses
        if (q.includes('project') || q.includes('work') || q.includes('portfolio')) {
            const projectResponses = [
                "Miguel has worked on some fascinating projects! From web applications to mobile apps, and even academic systems. His projects showcase both his technical skills and design sensibility. Would you like specific details about any particular type?",
                "His portfolio is quite diverse! Miguel has experience with real-world client projects, academic applications, and personal creative works. Each project demonstrates his growth as both a developer and designer.",
                "Great question! Miguel's projects range from UI/UX design work to full-stack web applications. He's also contributed to educational technology during his time as an instructor. The variety really shows his adaptability!"
            ];
            return projectResponses[Math.floor(Math.random() * projectResponses.length)];
        }
        
        // Enhanced education responses
        if (q.includes('education') || q.includes('study') || q.includes('school') || q.includes('college') || q.includes('degree')) {
            const educationResponses = [
                "Miguel graduated Magna Cum Laude with a degree in Information Technology! His academic excellence really laid the foundation for his diverse tech career. He's also worked as a college instructor, sharing his knowledge with the next generation.",
                "His educational background is impressive - not only did he excel academically (Magna Cum Laude in IT), but he also taught at the college level. This combination of learning and teaching really shaped his comprehensive understanding of technology.",
                "Miguel's academic journey is noteworthy! His IT degree with Magna Cum Laude honors, combined with his experience as an instructor, shows both his technical mastery and ability to communicate complex concepts effectively."
            ];
            return educationResponses[Math.floor(Math.random() * educationResponses.length)];
        }
        
        // Use the original getAnswer function but enhance some responses
        const originalAnswer = getAnswer(question);
        
        // Add some AI-like personality to certain responses
        if (originalAnswer.includes("Sorry, I don't have an answer")) {
            const enhancedFallbacks = [
                "That's an interesting question! While I don't have a specific answer for that, I'd love to tell you about Miguel's expertise in UI/UX design and development. What aspect interests you most?",
                "Hmm, I don't have information about that particular topic, but I'm full of insights about Miguel's professional journey and projects. Want to explore those instead?",
                "Great question! Though I don't have that specific information, I can share lots about Miguel's skills, education, and creative work. What would you like to know?",
                "I wish I knew more about that! But I'm really knowledgeable about Miguel's background, achievements, and technical skills. Shall we dive into those?",
                "That's outside my current knowledge base, but I'd be happy to tell you about Miguel's fascinating career transition from academia to tech development. Interested?",
                "I don't have specific details about that, but Miguel's story of combining teaching, design, and development is quite compelling. Would you like to hear about that journey?"
            ];
            return enhancedFallbacks[Math.floor(Math.random() * enhancedFallbacks.length)];
        }
        
        // Add variety to existing answers by sometimes modifying them
        if (Math.random() > 0.7) { // 30% chance to enhance existing answers
            if (originalAnswer.includes("Miguel Joie")) {
                const enhancements = [
                    " It's really impressive how he's built such a diverse skill set!",
                    " His journey from academia to tech development is quite inspiring.",
                    " The combination of his technical skills and design eye makes him quite unique.",
                    " His passion for creating meaningful user experiences really shows in his work."
                ];
                return originalAnswer + enhancements[Math.floor(Math.random() * enhancements.length)];
            }
        }
        
        return originalAnswer;
    }

    function appendMessage(text, sender = 'bot', typing = false) {
        const msgDiv = document.createElement('div');
        msgDiv.className = sender === 'user'
            ? 'flex justify-end'
            : 'flex justify-start';
        const bubble = document.createElement('div');
        bubble.className = 'max-w-[80%] px-6 py-4 rounded-2xl shadow-lg bg-black/80 border border-white/10 text-white text-base flex items-center gap-2 text-left';
        if (sender === 'bot') {
            bubble.innerHTML = `<span class="bot-icon mr-2"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z" /></svg></span><span class="ai-text"></span>`;
        } else {
            bubble.innerHTML = `<span>${text}</span><span class="user-icon ml-2"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg></span>`;
        }
        msgDiv.appendChild(bubble);
        chatContainer.appendChild(msgDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;

        // Typing animation for bot
        if (sender === 'bot' && typing) {
            const aiText = bubble.querySelector('.ai-text');
            let i = 0;
            function typeChar() {
                if (i <= text.length) {
                    aiText.textContent = text.slice(0, i);
                    chatContainer.scrollTop = chatContainer.scrollHeight;
                    i++;
                    setTimeout(typeChar, 8 + Math.random() * 30);
                }
            }
            typeChar();
        }
    }

    button.addEventListener('click', async function () {
        const question = textarea.value.trim();
        if (question) {
            appendMessage(question, 'user');
            
            // Show loading message
            appendMessage('Thinking...', 'bot', false);
            const lastMessage = chatContainer.lastElementChild;
            
            try {
                // Get AI response
                const aiResponse = await getAIResponse(question);
                
                // Remove loading message
                chatContainer.removeChild(lastMessage);
                
                // Show AI response with typing animation
                setTimeout(() => {
                    appendMessage(aiResponse, 'bot', true);
                }, 200);
            } catch (error) {
                // Remove loading message and show fallback
                chatContainer.removeChild(lastMessage);
                setTimeout(() => {
                    appendMessage(getAnswer(question), 'bot', true);
                }, 200);
            }
            
            textarea.value = '';
            textarea.style.height = '76px';
        }
    });

    textarea.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            button.click();
        }
    });
});