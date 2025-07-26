export function getAnswer(question) {
    const q = question.toLowerCase();

    const defaultAnswers = [
        "Hmm, that one's a bit tricky. Try rephrasing or asking something else about me!",
        "Oops! I didn't quite catch that. Could you ask it differently?",
        "I'm still learning! Maybe try a different question about Miguel Joie?",
        "I wish I had an answer for that — mind asking something else?",
        "Yikes, I don't know how to respond to that yet. Try asking about my skills or experience!",
        "That's outside my memory banks! Ask something related to Miguel Joie S. Polines.",
        "I'm scratching my digital head... try a simpler or more specific question?",
        "That flew right over my circuits. Ask me something else I might know!",
        "Uh-oh, I couldn't understand that one. Want to ask about my education or work?",
        "I don't know how to answer that, but I'm great with questions about my projects or background!",
        "Sorry, I didn't get that. Maybe reword your question?",
        "I might not know everything — but I do know Miguel! Ask me about him!",
        "You got me there! Try asking something related to my career, skills, or portfolio.",
        "Hmm, my knowledge stops right there. Could you give it another shot?",
        "That doesn't ring a bell. How about something about my work or hobbies?",
        "I'm confused... but curious! Try asking something about my experience or achievements.",
        "Not sure how to respond to that! If it's about Miguel, I might have an answer.",
        "That went over my virtual head! Rephrase it or ask about something like programming or design?",
        "Miguel didn't teach me how to respond to that one. Try something else!",
        "That's a mystery to me. But ask about my projects, studies, or creative work — I love those topics!"
    ];

    const whoAmIAnswers = [
        "I'm Miguel Joie S. Polines — a UI/UX Designer and Developer based in Cavite, Philippines. I graduated Magna Cum Laude with a degree in Information Technology, and I have experience working on web, mobile, and academic projects. I'm passionate about creating intuitive and visually engaging user experiences. Feel free to ask about my background, skills, or the things I've built!",
        "Hey there! I'm Miguel Joie S. Polines, a creative tech enthusiast who loves combining design and development. I specialize in UI/UX, web technologies, and Android development, and I've also worked as a college instructor. If you're curious about my journey, skills, or the projects I've worked on, just ask away!",
        "Nice to meet you! I'm Miguel, a Filipino designer and developer with a love for clean interfaces and purposeful technology. I've built apps, designed systems, taught IT subjects, and collaborated with teams on real-world projects. I'm always eager to learn and grow — let me know what you'd like to know about me.",
        "I'm Miguel Joie S. Polines, and I bring together creativity, logic, and passion in everything I build. Whether it's designing interfaces, coding applications, or mentoring students, I enjoy turning ideas into functional solutions. I'm currently exploring new ways to grow as a developer and designer. Ask me anything about my work, background, or future goals!",
        "I'm Miguel — a detail-oriented designer and developer with a background in both academics and freelance work. I've handled everything from UI/UX design to full-stack development and even video editing. I believe in continuous learning and creating tech that actually helps people. Want to know more about what I do or how I got here?"
    ];

    function random(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    if (q.includes('who') && q.includes('miguel')) {
        return (whoAmIAnswers[Math.floor(Math.random() * whoAmIAnswers.length)]);
    }
    if (q.includes('who') && q.includes('are') && q.includes('you')) {
        return (whoAmIAnswers[Math.floor(Math.random() * whoAmIAnswers.length)]);
    }
    if (q.includes('jessa') || q.includes('girlfriend') || q.includes('partner')) {
        return "Do you mean Jessa? She's my girlfriend, currently studying Bachelor of Science In Education Major in English. She's a wonderful person and a great support in my life! Now, you wanna ask something about me, as a professional?";
    }
    if (q.includes('project') || q.includes('projects') || q.includes('work')) {
        return "One of the most notable projects I've worked on is called Astrocards, an Android-based Augmented Reality educational app designed specifically to help junior high school students learn about astronomy in a fun and interactive way. It was the highlight of my thesis and received excellent feedback during our university's research colloquium. I've also built other meaningful projects like FitConnect, which focuses on promoting community support in fitness. If you're curious, feel free to check out the 'Show my projects' section to explore more of what I've created.";
    }

    if (q.includes('skill') || q.includes('skills') || q.includes('proficient')) {
        return "I've developed a wide range of skills through academic work, internships, and hands-on experience. I'm proficient in HTML, CSS, JavaScript, PHP, MySQL, Java, and C#, and I regularly work with design tools like Figma and development environments like Visual Studio and WAMP Server. I also have experience in Android app development, game prototyping using Unity, and even video editing. What I really enjoy is learning how to bridge the gap between user experience and functional code, so I always try to stay updated with industry trends and frameworks.";
    }

    if (q.includes('contact') || q.includes('email') || q.includes('reach you')) {
        return "You can easily reach me through the contact links provided in the 'Where to contact?' section of this page. Whether you're reaching out for a potential collaboration, freelance opportunity, or just to connect professionally, I'll do my best to respond as soon as I can. I'm always open to discussing exciting projects or ideas — and I appreciate it when someone takes the time to reach out.";
    }

    if (q.includes('who are you') || q.includes('your name') || q.includes('who is miguel')) {
        return "I'm Miguel Joie S. Polines, a UI/UX Designer and Developer proudly based in Cavite, Philippines. I'm passionate about creating meaningful digital experiences, whether that's through intuitive design, clean code, or helping others understand technology better. I've worn different hats — from instructor and developer to designer and support tech — and I love building things that make people's lives easier or more inspiring. If you'd like to get to know more about my background, feel free to keep asking!";
    }

    if (q.includes('education') || q.includes('study') || q.includes('school') || q.includes('graduate')) {
        return "I completed my Bachelor of Science in Information Technology at Cavite State University - Main Campus and graduated Magna Cum Laude in 2024. My academic journey gave me a solid foundation in programming, system analysis, database design, and user-centered development. I also actively participated in academic competitions and research, which helped sharpen both my technical and communication skills. Education played a big role in who I am today — not just as a tech professional, but as someone who values curiosity and continuous learning.";
    }

    if (q.includes('experience') || q.includes('job') || q.includes('work experience')) {
        return "I've been lucky to gain experience in different fields — I worked as a UI/UX Intern at Pixel8 Web Solutions & Consultancy Inc., and I also served as a college instructor teaching core IT subjects to students. In addition to those roles, I've been a freelancer for years, offering computer repair services and assisting with system setups and troubleshooting. These diverse roles have given me a well-rounded perspective on both the technical and human sides of technology, which I believe is important in any career.";
    }

    if (q.includes('thesis') || q.includes('research') || q.includes('colloquium')) {
        return "My thesis was titled Astrocards, and it focused on using Augmented Reality in an Android application to teach astronomy to junior high school students. It was evaluated by over a hundred reviewers from Tanza National Trade School and received an impressive average score of 4.61. The app featured interactive learning through 3D AR visuals and was designed to support modular education. Presenting it at the 2nd CEIT Research Colloquium was one of the most exciting milestones in my academic life.";
    }

    if (q.includes('fitconnect') || q.includes('exercise app') || q.includes('fitness app')) {
        return "FitConnect is a project I designed and developed with the idea of encouraging people to stay motivated in their fitness journey by connecting with others who share the same goals. Its tagline, 'Inspire, be inspired...', captures the whole purpose of the app — to build a sense of community around health and wellness. The interface was carefully designed to feel inviting and simple, making it easy for users to communicate and share progress. It's one of my favorite conceptual projects, and I'd love to build it into a full platform someday.";
    }

    if (q.includes('teach') || q.includes('teaching') || q.includes('instructor') || q.includes('professor')) {
        return "Yes, I had the opportunity to teach at Cavite State University - Main Campus for one full academic year. I taught subjects like Database and Information Management, IT Tools Application for Businesses, and Discrete Mathematics to both IT and accountancy students. I also introduced students with limited tech backgrounds to tools like Microsoft Excel and helped them understand core computing concepts. Teaching was incredibly fulfilling — it pushed me to become more patient, creative, and confident in explaining technical ideas in a way that others could understand.";
    }

    if (q.includes('freelance') || q.includes('freelancing') || q.includes('services')) {
        return "I've been doing freelance work since my senior high school days, mostly focused on computer repair and maintenance. I've helped clients with system reformatting, hardware troubleshooting, software installation, and general tech support. While the earnings were modest, it helped me support my education and gave me hands-on experience that complemented what I was learning in school. I also accept small academic and multimedia-related projects whenever I can.";
    }

    if (q.includes('tools') || q.includes('software') || q.includes('programs you use')) {
        return "The tools I use depend on the project, but I tend to work with a pretty versatile stack. For design, I use Figma for UI/UX prototyping and Adobe Premiere or DaVinci Resolve when it comes to video editing. On the development side, I use Visual Studio, NetBeans, WAMP Server, and occasionally Unity for app and game development. I also enjoy using version control tools like Git, especially when collaborating on projects. I like to keep my workflow flexible and organized.";
    }

    if (q.includes('goal') || q.includes('aspiration') || q.includes('dream')) {
        return "My long-term goal is to become a strong full-stack developer while also growing as a designer who deeply understands users and how they interact with technology. I want to build apps and platforms that actually solve real problems or inspire people in their daily lives. I'm also curious about the fields of software testing, quality assurance, and project leadership. Whether I pursue design, development, or even teaching again someday, I just want to keep learning and doing meaningful work.";
    }

    if (q.includes('quote') || q.includes('motto') || q.includes('life saying')) {
        return "A personal quote I live by is: 'Inspire, be inspired.' It reflects how I approach both work and life — with the hope that the things I create can encourage others, and in return, I remain open to being inspired by the people and ideas around me. I even used this as the core message for my *FitConnect* app. For me, creativity and growth thrive best in a supportive, uplifting environment.";
    }
    return random(defaultAnswers);
}
