"use client";
import { Mail, Send } from "lucide-react";
import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  // Add your submit logic here

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // handle subscribe
      }}
      className="flex items-center"
    >
      <label htmlFor="email-address" className="sr-only">
        Email address
      </label>
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Mail className="h-5 w-5 text-slate-500" />
        </div>
        <input
          type="email"
          name="email-address"
          id="email-address"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="block w-full bg-slate-800 border border-slate-700 rounded-l-md py-3 pl-10 pr-3 text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
          placeholder="Enter your email"
        />
        <button
          type="submit"
          className="absolute inset-y-0 right-0 flex items-center justify-center px-4 bg-amber-500 text-white rounded-r-md hover:bg-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-500"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
}
