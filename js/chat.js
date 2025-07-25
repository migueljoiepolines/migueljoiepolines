/* ===== CHAT FUNCTIONALITY ===== */

import { getAnswer } from './answers.js';

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
        
        // Simulate AI thinking delay
        await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
        
        // Get response from static answers
        const response = getAnswer(question);
        return response;
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
        const bubble = document.createElement('div');
        bubble.className = 'glass-message max-w-[80%] px-6 py-4 rounded-2xl text-white text-base flex items-start gap-2 text-left';
        if (sender === 'bot') {
            bubble.innerHTML = `<span class="bot-icon flex-shrink-0 mt-1"><img src="image/logo.png" alt="Logo" class="h-5 w-4" /></span><span class="ai-text"></span>`;
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
                    aiText.textContent = text.slice(0, i);
                    scrollToBottom();
                    i++;
                    setTimeout(typeChar, 8 + Math.random() * 30);
                }
            }
            typeChar();
        }
    }

    // Handle question submission
    async function handleQuestion() {
        const question = textarea.value.trim();
        if (!question) return;

        // Display user message
        appendMessage(question, 'user');
        textarea.value = '';

        // Show thinking message
        appendMessage('Thinking...', 'bot', false);

        try {
            // Get AI response (tries backend first, falls back to local)
            const aiResponse = await getAIResponse(question);
            
            // Remove the "Thinking..." message
            const lastMessage = chatContainer.lastElementChild;
            if (lastMessage) lastMessage.remove();
            
            // Display AI response with typing effect
            appendMessage(aiResponse, 'bot', true);
            
        } catch (error) {
            console.error('Error getting AI response:', error);
            
            // Remove the "Thinking..." message
            const lastMessage = chatContainer.lastElementChild;
            if (lastMessage) lastMessage.remove();
            
            // Fallback to static answers
            appendMessage(getAnswer(question), 'bot', true);
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
    }

    // Handle initial question from URL
    handleInitialQuestion();
});
