"use client";

import { Send } from "lucide-react";

export default function ContactForm() {
  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        alert("Thank you for contacting us! We'll get back to you soon.");
      }}
    >
      <div>
        <label className="block text-gray-700 font-medium mb-1">Name</label>
        <input
          type="text"
          required
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-[#00B7CD] outline-none"
          placeholder="Your Name"
        />
      </div>
      <div>
        <label className="block text-gray-700 font-medium mb-1">Email</label>
        <input
          type="email"
          required
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-[#00B7CD] outline-none"
          placeholder="you@email.com"
        />
      </div>
      <div>
        <label className="block text-gray-700 font-medium mb-1">Message</label>
        <textarea
          required
          rows={5}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-[#00B7CD] outline-none"
          placeholder="How can we help you?"
        />
      </div>
      <button
        type="submit"
        className="flex items-center gap-2 bg-[#00B7CD] hover:bg-[#0099AD] text-white font-semibold px-6 py-2 rounded-md transition"
      >
        <Send className="h-5 w-5" /> Send Message
      </button>
    </form>
  );
}
