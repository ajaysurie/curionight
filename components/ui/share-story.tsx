'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Share2, Copy, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { toast } from 'sonner'

interface ShareStoryProps {
  storyId: string
  shareToken?: string
  childName?: string
}

export function ShareStory({ storyId, shareToken, childName }: ShareStoryProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  
  const shareUrl = shareToken 
    ? `${window.location.origin}/story/shared/${shareToken}`
    : `${window.location.origin}/story/${storyId}`
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast.success('Link copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy link')
    }
  }
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${childName || 'Explorer'}'s Science Story`,
          text: 'Check out this amazing bedtime science story!',
          url: shareUrl,
        })
      } catch (error) {
        // User cancelled or error occurred
        if ((error as Error).name !== 'AbortError') {
          console.error('Error sharing:', error)
        }
      }
    } else {
      // Fallback to showing the share dialog
      setIsOpen(true)
    }
  }
  
  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleShare}
        className="border-purple-400 bg-purple-900/50 text-purple-100 hover:bg-purple-800/50"
      >
        <Share2 className="mr-2 h-4 w-4" />
        Share Story
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="border-purple-700 bg-purple-950 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">
              Share This Story
            </DialogTitle>
            <DialogDescription className="text-purple-200">
              Share this magical science adventure with friends and family!
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Share URL display */}
            <div className="relative">
              <div className="rounded-lg bg-purple-900/50 p-4 pr-12">
                <p className="break-all text-sm text-purple-100">
                  {shareUrl}
                </p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCopy}
                className="absolute right-2 top-2 text-purple-200 hover:text-white"
              >
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Check className="h-5 w-5 text-green-400" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="copy"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Copy className="h-5 w-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </div>
            
            {/* Share options */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => {
                  window.open(
                    `https://wa.me/?text=${encodeURIComponent(
                      `Check out ${childName || 'this'}'s amazing science story! ${shareUrl}`
                    )}`,
                    '_blank'
                  )
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                WhatsApp
              </Button>
              
              <Button
                onClick={() => {
                  window.open(
                    `mailto:?subject=${encodeURIComponent(
                      `${childName || 'Explorer'}'s Science Story`
                    )}&body=${encodeURIComponent(
                      `I thought you'd enjoy this bedtime science story!\n\n${shareUrl}`
                    )}`,
                    '_blank'
                  )
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Email
              </Button>
            </div>
            
            <div className="rounded-lg bg-purple-900/30 p-4">
              <p className="text-sm text-purple-200">
                💡 <strong>Tip:</strong> Anyone with this link can view the story - no login required!
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}