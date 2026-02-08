/**
 * Generates the contact form email content
 * @param {Object} data - The form data
 * @param {string} data.name - Sender's name
 * @param {string} data.email - Sender's email
 * @param {string} data.linkedin - Sender's LinkedIn profile
 * @param {string} data.message - Message content
 * @returns {Object} Object containing text and html versions of the email
 */
const generateContactEmail = ({ name, email, linkedin, message }) => {
    const text = `
New contact form submission:

Name: ${name}
Email: ${email}
LinkedIn: ${linkedin}

Message:
${message || 'No message provided'}

---
Sent from your Technical Due Diligence website
    `;

    const html = `
<h2>New contact form submission</h2>
<table style="border-collapse: collapse; margin-bottom: 20px;">
    <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Name</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${name}</td>
    </tr>
    <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email</td>
        <td style="padding: 8px; border: 1px solid #ddd;"><a href="mailto:${email}">${email}</a></td>
    </tr>
    <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">LinkedIn</td>
        <td style="padding: 8px; border: 1px solid #ddd;"><a href="${linkedin}">${linkedin}</a></td>
    </tr>
</table>
${message ? `<h3>Message:</h3>
<p style="background: #f5f5f5; padding: 15px; border-radius: 5px;">${message.replace(/\n/g, '<br>')}</p>` : ''}
<hr>
<p style="color: #666; font-size: 12px;">Sent from your Technical Due Diligence website</p>
    `;

    return { text, html };
};

module.exports = { generateContactEmail };
