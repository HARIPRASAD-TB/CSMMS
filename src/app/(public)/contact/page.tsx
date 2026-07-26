"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">
          Contact <span className="text-accent">Us</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-zinc-400">
          Have questions about hiring workers, booking contractors, or purchasing
          materials? We are here to help.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-xl border border-zinc-800 bg-surface p-6">
            <h2 className="mb-6 text-xl font-bold">Get in Touch</h2>
            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-zinc-400">support@buildconnect.com</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-zinc-400">+91 1800-123-4567</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-zinc-400">
                    42 Construction Hub, Andheri East,
                    <br />
                    Mumbai, Maharashtra 400069
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <div>
                  <p className="font-medium">Business Hours</p>
                  <p className="text-zinc-400">
                    Mon – Sat: 9:00 AM – 7:00 PM
                    <br />
                    Sunday: Closed
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-surface p-6">
          <h2 className="mb-6 text-xl font-bold">Send a Message</h2>
          {sent ? (
            <div className="rounded-lg bg-green-500/10 p-6 text-center text-green-400">
              Thank you for reaching out. Our support team will respond within
              one business day.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="contact-name" className="mb-1 block text-sm text-zinc-400">
                  Your Name <span className="text-accent">*</span>
                </label>
                <input
                  id="contact-name"
                  required
                  className="w-full rounded-lg px-4 py-2.5"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="mb-1 block text-sm text-zinc-400">
                  Email Address <span className="text-accent">*</span>
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  className="w-full rounded-lg px-4 py-2.5"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="contact-subject" className="mb-1 block text-sm text-zinc-400">
                  Subject <span className="text-accent">*</span>
                </label>
                <input
                  id="contact-subject"
                  required
                  className="w-full rounded-lg px-4 py-2.5"
                  value={form.subject}
                  onChange={(e) =>
                    setForm({ ...form, subject: e.target.value })
                  }
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="mb-1 block text-sm text-zinc-400">
                  Message <span className="text-accent">*</span>
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={5}
                  className="w-full rounded-lg px-4 py-2.5"
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                />
              </div>
              <Button type="submit" className="w-full">
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
