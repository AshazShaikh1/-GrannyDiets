'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      toast.success("Thank you for reaching out! We'll get back to you shortly.")
      e.currentTarget.reset()
    }, 1500)
  }

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="firstName" className="text-sm font-medium text-text-primary">First Name <span className="text-error">*</span></label>
          <input 
            id="firstName" 
            name="firstName"
            required 
            className="w-full rounded-md border border-border bg-transparent px-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="lastName" className="text-sm font-medium text-text-primary">Last Name <span className="text-error">*</span></label>
          <input 
            id="lastName" 
            name="lastName"
            required 
            className="w-full rounded-md border border-border bg-transparent px-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-text-primary">Email Address <span className="text-error">*</span></label>
        <input 
          id="email" 
          type="email" 
          name="email"
          required 
          className="w-full rounded-md border border-border bg-transparent px-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="phone" className="text-sm font-medium text-text-primary">Phone (Optional)</label>
        <input 
          id="phone" 
          type="tel" 
          name="phone"
          className="w-full rounded-md border border-border bg-transparent px-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium text-text-primary">Message <span className="text-error">*</span></label>
        <textarea 
          id="message" 
          name="message"
          rows={5} 
          required 
          className="w-full rounded-md border border-border bg-transparent px-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-y min-h-[120px] transition-colors"
        />
      </div>
      
      <div className="pt-2 flex justify-start">
        <Button type="submit" variant="primary" className="px-8" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </Button>
      </div>
    </motion.form>
  )
}
