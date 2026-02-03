const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Email transporter configuration
// Uses Gmail by default - see .env.example for setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS  // Use App Password, not regular password
    }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
    const { name, email, firm, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
        return res.status(400).json({
            success: false,
            error: 'Name, email, and message are required'
        });
    }

    // Email content
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'gadiguy@gmail.com',
        replyTo: email,
        subject: `[DD Site] New inquiry from ${name}${firm ? ` at ${firm}` : ''}`,
        text: `
New contact form submission:

Name: ${name}
Email: ${email}
Firm: ${firm || 'Not provided'}

Message:
${message}

---
Sent from your Technical Due Diligence website
        `,
        html: `
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
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Firm</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${firm || 'Not provided'}</td>
    </tr>
</table>
<h3>Message:</h3>
<p style="background: #f5f5f5; padding: 15px; border-radius: 5px;">${message.replace(/\n/g, '<br>')}</p>
<hr>
<p style="color: #666; font-size: 12px;">Sent from your Technical Due Diligence website</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully from ${name} (${email})`);
        res.json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to send message. Please try again or email directly.'
        });
    }
});

// Checklist form endpoint
app.post('/api/checklist', async (req, res) => {
    const { email, role } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            error: 'Email is required'
        });
    }

    // Notify you of new checklist request
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'gadiguy@gmail.com',
        subject: `[DD Site] New checklist download request`,
        text: `
New checklist download request:

Email: ${email}
Role: ${role || 'Not provided'}

---
Remember to send them the VC Tech Risk Checklist!
        `,
        html: `
<h2>New checklist download request</h2>
<table style="border-collapse: collapse; margin-bottom: 20px;">
    <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email</td>
        <td style="padding: 8px; border: 1px solid #ddd;"><a href="mailto:${email}">${email}</a></td>
    </tr>
    <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Role</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${role || 'Not provided'}</td>
    </tr>
</table>
<p style="background: #fffde7; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107;">
    <strong>Action needed:</strong> Send them the VC Tech Risk Checklist!
</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Checklist request from ${email}`);
        res.json({ success: true, message: 'Request received' });
    } catch (error) {
        console.error('Error sending notification:', error);
        // Still return success to user - they don't need to know about internal email issues
        res.json({ success: true, message: 'Request received' });
    }
});

// Serve index.html for root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('\n⚠️  Warning: Email credentials not configured!');
        console.warn('   Create a .env file with EMAIL_USER and EMAIL_PASS');
        console.warn('   See .env.example for instructions\n');
    }
});
