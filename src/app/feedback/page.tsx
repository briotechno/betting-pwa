'use client'
import React, { useState } from 'react'
import { MessageSquare, Star, Send, ShieldCheck, Heart, ThumbsUp } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function FeedbackPage() {
  const [rating, setRating] = useState(0)

  return (
    <div className="max-w-md mx-auto p-4 pb-20">
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare size={24} className="text-primary" />
        <h1 className="text-xl font-bold text-white uppercase tracking-tight">Feedback Hub</h1>
      </div>

      <div className="bg-card border border-cardBorder rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-6 p-4 rounded-xl bg-primary/5 border border-primary/10">
          <Heart size={24} className="text-primary" />
          <div>
            <p className="text-sm font-bold text-white uppercase tracking-tight">Share Your Thoughts</p>
            <p className="text-[10px] text-textMuted uppercase tracking-widest font-black">Help us build the next level</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col items-center justify-center p-6 bg-surface border border-cardBorder rounded-xl text-center">
            <p className="text-sm font-black text-white uppercase tracking-widest mb-4">Rate Your Experience</p>
            <div className="flex gap-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`p-2 rounded-lg transition-all transform active:scale-90 ${
                    rating >= star ? 'bg-primary/20 text-primary scale-110' : 'bg-white/5 text-textMuted hover:bg-white/10'
                  }`}
                >
                  <Star fill={rating >= star ? 'currentColor' : 'none'} size={24} />
                </button>
              ))}
            </div>
            {rating > 0 && <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-primary animate-in fade-in zoom-in">Rating: {rating}/5</p>}
          </div>

          <div className="space-y-1">
            <p className="text-[10px] text-textMuted font-black uppercase tracking-widest px-1">Describe Your Feedback</p>
            <textarea 
              rows={4}
              placeholder="What can we do to improve?"
              className="w-full bg-surface border border-cardBorder rounded-xl py-3 px-4 text-sm font-medium text-white focus:border-primary focus:outline-none transition-all placeholder-gray-600 resize-none"
            />
          </div>

           <div className="mt-8 flex gap-3">
            <Button fullWidth className="flex-1 flex items-center justify-center gap-2">
                <Send size={16} /> SEND FEEDBACK
            </Button>
        </div>
        </div>
      </div>

      <div className="bg-success/5 border border-success/10 rounded-xl p-4 flex items-center gap-3">
            <ThumbsUp size={18} className="text-success" />
            <p className="text-[10px] text-success font-black uppercase tracking-widest leading-relaxed">
                Thank you for your valuable response. We personally read every single piece of feedback sent to us.
            </p>
      </div>
    </div>
  )
}
