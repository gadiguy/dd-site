const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const { generateContactEmail } = require('./templates/contact');
const { generateChecklistEmail } = require('./templates/checklist');
require('dotenv').config();

console.log('Starting server with the following configuration:');
console.log(`PORT: ${process.env.PORT || 3000}`);
console.log(`EMAIL_USER: ${process.env.EMAIL_USER ? 'Configured' : 'Not configured'}`);
console.log(`EMAIL_PASS: ${process.env.EMAIL_PASS ? 'Configured' : 'Not configured'}`);

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
    const { name, email, linkedin, message } = req.body;

    // Validate required fields
    if (!name || !email || !linkedin) {
        return res.status(400).json({
            success: false,
            error: 'Name, email, and LinkedIn profile are required'
        });
    }

    // Email content
    const { text, html } = generateContactEmail({ name, email, linkedin, message });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'gadiguy@gmail.com',
        replyTo: email,
        subject: `[DD Site] New inquiry from ${name}`,
        text,
        html
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
    const { email, linkedin, role } = req.body;

    if (!email || !linkedin) {
        return res.status(400).json({
            success: false,
            error: 'Email and LinkedIn profile are required'
        });
    }

    // Notify you of new checklist request
    const { text, html } = generateChecklistEmail({ email, linkedin, role });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'gadiguy@gmail.com',
        subject: `[DD Site] New checklist download request`,
        text,
        html
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
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('\n⚠️  Warning: Email credentials not configured!');
        console.warn('   Create a .env file with EMAIL_USER and EMAIL_PASS');
        console.warn('   See .env.example for instructions\n');
    }
});
