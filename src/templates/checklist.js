/**
 * Generates the checklist request email content
 * @param {Object} data - The request data
 * @param {string} data.email - Requester's email
 * @param {string} data.linkedin - Requester's LinkedIn profile
 * @param {string} data.role - Requester's role
 * @returns {Object} Object containing text and html versions of the email
 */
const generateChecklistEmail = ({ email, linkedin, role }) => {
    const text = `
New checklist download request:

Email: ${email}
LinkedIn: ${linkedin}
Role: ${role || 'Not provided'}

---
Remember to send them the VC Tech Risk Checklist!
    `;

    const html = `
<h2>New checklist download request</h2>
<table style="border-collapse: collapse; margin-bottom: 20px;">
    <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email</td>
        <td style="padding: 8px; border: 1px solid #ddd;"><a href="mailto:${email}">${email}</a></td>
    </tr>
    <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">LinkedIn</td>
        <td style="padding: 8px; border: 1px solid #ddd;"><a href="${linkedin}">${linkedin}</a></td>
    </tr>
    <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Role</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${role || 'Not provided'}</td>
    </tr>
</table>
<p style="background: #fffde7; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107;">
    <strong>Action needed:</strong> Send them the VC Tech Risk Checklist!
</p>
    `;

    return { text, html };
};

module.exports = { generateChecklistEmail };
