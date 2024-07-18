const express = require('express');
const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
require('dotenv').config();
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);
const app = express();

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Subscriber model
const Subscriber = mongoose.model('Subscriber', new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  subscribeDate: { type: Date, default: Date.now }
}));

// Subscribe route
app.post('/api/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    const subscriber = new Subscriber({ email });
    await subscriber.save();
    res.status(201).json({ message: 'Subscribed successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Subscription failed', error: error.message });
  }
});
app.post('/api/send-newsletter', async (req, res) => {
    try {
      const { subject, content } = req.body;
      const subscribers = await Subscriber.find().select('email');
      const emails = subscribers.map(sub => sub.email);
  
      const { data, error } = await resend.emails.send({
        from: 'Your Newsletter <newsletter@yourdomain.com>',
        to: emails,
        subject: subject,
        html: content
      });
  
      if (error) {
        return res.status(400).json({ error });
      }
  
      res.status(200).json({ data });
    } catch (error) {
      res.status(500).json({ message: 'Failed to send newsletter', error: error.message });
    }
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));