import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';

const NewsletterAdmin = () => {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    setIsSending(true);

    try {
      const response = await fetch('/api/send-newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, content })
      });

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Newsletter sent successfully.",
        });
        setSubject('');
        setContent('');
      } else {
        throw new Error('Failed to send newsletter');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send newsletter. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form onSubmit={handleSend} className="space-y-4">
      <Input
        type="text"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="Newsletter Subject"
        required
      />
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Newsletter Content (HTML)"
        required
        rows={10}
      />
      <Button type="submit" disabled={isSending}>
        {isSending ? 'Sending...' : 'Send Newsletter'}
      </Button>
    </form>
  );
};

export default NewsletterAdmin;