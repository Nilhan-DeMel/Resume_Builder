/**
 * CV Renderer
 * Purpose: Convert canonical JSON to human-readable Editor text
 */

/**
 * Render canonical JSON to formatted editor text
 * @param {Object} canonicalJson - Canonical CV structure
 * @returns {string} Formatted text for textarea
 */
export function renderCanonicalToEditorText(canonicalJson) {
    if (!canonicalJson) return '';

    const sections = [];

    // CONTACT
    const contact = canonicalJson.contact || {};
    const contactLines = [];
    if (contact.fullName) contactLines.push(`Full Name: ${contact.fullName}`);
    if (contact.headline) contactLines.push(`Headline: ${contact.headline}`);
    if (contact.email?.length) contactLines.push(`Email: ${contact.email.join(', ')}`);
    if (contact.phone?.length) contactLines.push(`Phone: ${contact.phone.join(', ')}`);
    if (contact.location) contactLines.push(`Location: ${contact.location}`);
    if (contact.linkedin) contactLines.push(`LinkedIn: ${contact.linkedin}`);
    if (contact.website?.length) contactLines.push(`Website: ${contact.website.join(', ')}`);

    if (contactLines.length) {
        sections.push(formatSection('CONTACT', contactLines));
    }

    // SUMMARY
    const summary = canonicalJson.summary || {};
    const summaryLines = [];
    if (summary.about) summaryLines.push(`About:\n${summary.about}`);
    if (summary.targetRole) summaryLines.push(`Target Role: ${summary.targetRole}`);
    if (summary.jobLevel) summaryLines.push(`Job Level: ${summary.jobLevel}`);

    if (summaryLines.length) {
        sections.push(formatSection('SUMMARY', summaryLines));
    }

    // EXPERIENCE
    const experience = canonicalJson.experience || [];
    if (experience.length) {
        const expLines = [];
        experience.forEach((exp, idx) => {
            expLines.push(`${idx + 1}) ${exp.jobTitle || 'Role'} @ ${exp.company || 'Company'}`);
            if (exp.startDate || exp.endDate) {
                expLines.push(`   Dates: ${exp.startDate || '?'} – ${exp.endDate || 'Present'}`);
            }
            if (exp.location) expLines.push(`   Location: ${exp.location}`);
            if (exp.jobDescription?.length) {
                expLines.push('   Description:');
                exp.jobDescription.forEach(d => expLines.push(`   - ${d}`));
            }
            if (exp.achievements?.length) {
                expLines.push('   Achievements:');
                exp.achievements.forEach(a => expLines.push(`   • ${a}`));
            }
            expLines.push('');
        });
        sections.push(formatSection('EXPERIENCE', expLines));
    }

    // EDUCATION
    const education = canonicalJson.education || [];
    if (education.length) {
        const eduLines = [];
        education.forEach((edu, idx) => {
            eduLines.push(`${idx + 1}) ${edu.degree || 'Degree'} - ${edu.institution || 'Institution'}`);
            if (edu.fieldOfStudy) eduLines.push(`   Field: ${edu.fieldOfStudy}`);
            if (edu.endDate) eduLines.push(`   Year: ${edu.endDate}`);
            if (edu.grade) eduLines.push(`   Grade: ${edu.grade}`);
            eduLines.push('');
        });
        sections.push(formatSection('EDUCATION', eduLines));
    }

    // SKILLS
    const skills = canonicalJson.skills || {};
    const skillLines = [];
    if (skills.core?.length) skillLines.push(`Core: ${skills.core.join(', ')}`);
    if (skills.tools?.length) skillLines.push(`Tools: ${skills.tools.join(', ')}`);
    if (skills.soft?.length) skillLines.push(`Soft: ${skills.soft.join(', ')}`);
    if (skills.all?.length && !skills.core?.length) {
        skillLines.push(`All: ${skills.all.join(', ')}`);
    }

    if (skillLines.length) {
        sections.push(formatSection('SKILLS', skillLines));
    }

    // CERTIFICATIONS
    const certs = canonicalJson.certifications || [];
    if (certs.length) {
        const certLines = certs.map(c => `- ${c.name}${c.issuer ? ` (${c.issuer})` : ''}`);
        sections.push(formatSection('CERTIFICATIONS', certLines));
    }

    // PROJECTS
    const projects = canonicalJson.projects || [];
    if (projects.length) {
        const projLines = [];
        projects.forEach(p => {
            projLines.push(`- ${p.name || 'Project'}`);
            if (p.description?.length) {
                p.description.forEach(d => projLines.push(`  ${d}`));
            }
        });
        sections.push(formatSection('PROJECTS', projLines));
    }

    // LANGUAGES
    const languages = canonicalJson.languages || [];
    if (languages.length) {
        sections.push(formatSection('LANGUAGES', languages.map(l => `- ${l}`)));
    }

    // NOTES / UNCAPTURED (always show)
    const notes = canonicalJson.notes || {};
    const noteLines = [];

    if (notes.uncapturedContent?.length) {
        noteLines.push('Uncaptured Content:');
        notes.uncapturedContent.slice(0, 10).forEach(n => noteLines.push(`- ${n}`));
    }
    if (notes.ambiguities?.length) {
        noteLines.push('Ambiguities:');
        notes.ambiguities.forEach(a => noteLines.push(`- ${a}`));
    }
    if (notes.formattingIssues?.length) {
        noteLines.push('Formatting Issues:');
        notes.formattingIssues.forEach(f => noteLines.push(`- ${f}`));
    }

    if (noteLines.length) {
        sections.push(formatSection('NOTES / UNCAPTURED', noteLines));
    } else {
        sections.push(formatSection('NOTES / UNCAPTURED', ['(None)']));
    }

    return sections.join('\n\n');
}

/**
 * Format a section with header
 */
function formatSection(title, lines) {
    const header = `--- [ ${title} ] ---`;
    const separator = '-'.repeat(40);
    return `${separator}\n${header}\n${separator}\n${lines.join('\n')}`;
}
