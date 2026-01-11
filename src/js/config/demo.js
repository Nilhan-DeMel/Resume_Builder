/**
 * Demo Mode Configuration
 * Purpose: Allow testing without real API keys
 * 
 * Set DEMO_MODE = true to use mock responses instead of real APIs
 */

export const DEMO_MODE = true; // Set to false when using real APIs

export const DEMO_RESPONSES = {
    // Mock CV optimization response
    optimizedCV: `JOHN DOE
Professional Summary
Results-driven Senior Software Engineer with 8+ years of experience building scalable web applications. Proven track record of leading cross-functional teams and delivering high-impact projects.

Professional Experience

SENIOR SOFTWARE ENGINEER | Tech Corp | 2020 - Present
- Led development of microservices architecture serving 2M+ daily active users
- Reduced application load time by 45% through performance optimization
- Mentored team of 5 junior engineers, improving code quality by 30%
- Implemented CI/CD pipeline, reducing deployment time from 2 hours to 15 minutes

SOFTWARE ENGINEER | StartupXYZ | 2017 - 2020
- Built RESTful APIs handling 10,000+ requests per second
- Developed React-based dashboard used by 500+ enterprise clients
- Optimized database queries, improving response time by 60%

Education
B.S. Computer Science | University Name | 2017

Technical Skills
Languages: JavaScript, Python, TypeScript, Java
Frameworks: React, Node.js, Express, Django
Tools: Docker, Kubernetes, AWS, Git, PostgreSQL`,

    // Mock ATS validation response
    atsValidation: {
        score: 95,
        issues: [],
        recommendations: [
            'Excellent formatting for ATS systems',
            'Strong use of action verbs and quantified achievements',
            'Clear section headings detected'
        ]
    }
};
