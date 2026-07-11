import React, { useState, useRef, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { useMessages } from 'context/MessageContext'
import useVoiceRecorder from 'hooks/useVoiceRecorder'
import useDrafts from 'hooks/useDrafts'
import emojis, { categoryLabels } from 'data/emoji'
import { cn } from '@/lib/utils'
import { Smile, Mic, Send, Paperclip, X } from 'lucide-react'

const EMOJI_CATEGORIES = Object.keys(emojis)

function Footer ({ footerAnimation, style, ...rest }) {
  const [emojiOpen, setEmojiOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState(EMOJI_CATEGORIES[0])
  const { saveDraft, getDraft, clearDraft } = useDrafts()
  const { sendTextMessage, sendVoiceMessage, sendImageMessage, activeContactId } = useMessages()
  const inputRef = useRef(null)
  const fileInputRef = useRef(null)
  const emojiRef = useRef(null)
  const prevContactRef = useRef(activeContactId)

  const [inputValue, setInputValue] = useState(() => getDraft(activeContactId))
  const [quoteMessage, setQuoteMessage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  const {
    recordingState, duration, audioBlob,
    startRecording, stopRecording, cancelRecording, cleanupAudio,
  } = useVoiceRecorder({ maxDuration: 60 })

  // Draft switching
  if (prevContactRef.current !== activeContactId) {
    saveDraft(prevContactRef.current, inputValue)
    setInputValue(getDraft(activeContactId))
    prevContactRef.current = activeContactId
  }

  const imagePreviewUrl = useMemo(() => {
    return imagePreview ? URL.createObjectURL(imagePreview) : null
  }, [imagePreview])

  // Expose for ChatBubble right-click quote
  if (typeof window !== 'undefined') {
    window.__setQuoteMessage = setQuoteMessage
  }

  const handleSend = () => {
    if (!inputValue.trim() && !imagePreview) return
    if (imagePreview) {
      sendImageMessage(imagePreview)
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl)
      setImagePreview(null)
      setInputValue('')
      return
    }
    sendTextMessage(inputValue, quoteMessage)
    setInputValue('')
    setQuoteMessage(null)
    clearDraft(activeContactId)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleChange = (e) => {
    setInputValue(e.target.value)
    saveDraft(activeContactId, e.target.value)
  }

  const handleEmojiClick = (emoji) => {
    const input = inputRef.current
    if (input) {
      const start = input.selectionStart || inputValue.length
      const end = input.selectionEnd || inputValue.length
      const newVal = inputValue.slice(0, start) + emoji + inputValue.slice(end)
      setInputValue(newVal)
      requestAnimationFrame(() => {
        const pos = start + emoji.length
        input.setSelectionRange(pos, pos)
        input.focus()
      })
    } else {
      setInputValue(prev => prev + emoji)
    }
  }

  const handleMicClick = () => {
    recordingState === 'idle' ? startRecording() : stopRecording()
  }

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    if (file.size > 5 * 1024 * 1024) { alert('图片大小不能超过5MB'); return }
    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl)
    setImagePreview(file)
    e.target.value = ''
  }

  const handleCancelImage = () => {
    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl)
    setImagePreview(null)
  }

  const handleCancelQuote = () => setQuoteMessage(null)
  const handleCancelVoice = () => cancelRecording()
  const handleSendVoice = () => {
    if (!audioBlob) return
    sendVoiceMessage(audioBlob, duration)
    cleanupAudio()
  }

  const formatDuration = (s) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return m > 0 ? `${m}:${String(sec).padStart(2, '0')}` : `${sec}"`
  }

  const disabled = !activeContactId

  // Recording state
  if (recordingState === 'recording') {
    return (
      <div className='bg-background px-4 py-3' {...rest}>
        <div className='flex items-center gap-3'>
          <div className='flex-1 flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full'>
            <span className='w-2 h-2 rounded-full bg-red-500 animate-pulse' />
            <span className='text-sm text-red-600 font-medium'>{formatDuration(duration)}</span>
            <span className='text-xs text-red-400 ml-2'>点击停止</span>
          </div>
          <Button variant='ghost' size='icon' onClick={handleCancelVoice} className='shrink-0'>
            <X className='w-4 h-4' />
          </Button>
        </div>
      </div>
    )
  }

  if (recordingState === 'done') {
    return (
      <div className='bg-background px-4 py-3' {...rest}>
        <div className='flex items-center gap-3'>
          <div className='flex-1 flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full'>
            <span className='text-sm text-blue-600 font-medium'>{formatDuration(duration)}</span>
            <span className='text-xs text-blue-400'>语音消息就绪</span>
          </div>
          <Button variant='ghost' size='icon' onClick={handleCancelVoice}><X className='w-4 h-4' /></Button>
          <Button size='icon' onClick={handleSendVoice}><Send className='w-4 h-4' /></Button>
        </div>
      </div>
    )
  }

  return (
    <div className='bg-background px-4 py-3' {...rest}>
      {/* Quote bar */}
      {quoteMessage && (
        <div className='flex items-center gap-2 mb-2 px-3 py-1.5 bg-muted/50 rounded-lg text-xs text-muted-foreground'>
          <span className='flex-1 truncate'>回复: {quoteMessage.content?.substring(0, 50)}</span>
          <button onClick={handleCancelQuote} className='hover:text-foreground'><X className='w-3 h-3' /></button>
        </div>
      )}
      {/* Image preview */}
      {imagePreview && (
        <div className='flex items-center gap-2 mb-2'>
          <img src={imagePreviewUrl} alt='preview' className='h-16 rounded-lg object-cover' />
          <button onClick={handleCancelImage} className='p-1 rounded-full bg-muted hover:bg-muted/80'><X className='w-3 h-3' /></button>
        </div>
      )}

      {/* Input area */}
      <div className='flex items-center gap-2'>
        {/* Clip button */}
        <Button variant='ghost' size='icon' className='shrink-0' onClick={() => fileInputRef.current?.click()} disabled={disabled}>
          <Paperclip className='w-5 h-5 text-muted-foreground' />
        </Button>
        <input type='file' ref={fileInputRef} className='hidden' accept='image/*' onChange={handleImageSelect} />

        {/* Text input */}
        <div className='flex-1 relative'>
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={disabled ? '请先选择联系人' : '输入消息，Enter 发送，Shift+Enter 换行'}
            rows={1}
            className='w-full resize-none rounded-2xl border border-input bg-muted/50 px-4 py-2.5 text-sm 
              placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
              disabled:opacity-50 disabled:cursor-not-allowed min-h-[42px] max-h-[120px]'
          />
        </div>

        {/* Emoji button */}
        <div className='relative' ref={emojiRef}>
          <Button variant='ghost' size='icon' className='shrink-0' onClick={() => setEmojiOpen(!emojiOpen)} disabled={disabled}>
            <Smile className='w-5 h-5 text-muted-foreground' />
          </Button>
          {/* Emoji popover */}
          {emojiOpen && (
            <div className='absolute bottom-full mb-2 right-0 w-72 bg-popover border rounded-xl shadow-xl z-50 animate-fade-in'>
              <div className='flex gap-0.5 p-1 border-b overflow-x-auto'>
                {EMOJI_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={(e) => { e.stopPropagation(); setActiveCategory(cat) }}
                    className={cn(
                      'shrink-0 px-2 py-1 text-xs rounded-md whitespace-nowrap transition-colors',
                      activeCategory === cat ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'
                    )}
                  >
                    {categoryLabels[cat]}
                  </button>
                ))}
              </div>
              <div className='grid grid-cols-8 gap-0.5 p-2 max-h-48 overflow-y-auto'>
                {emojis[activeCategory].map((emoji, i) => (
                  <button
                    key={`${activeCategory}-${i}`}
                    onClick={() => { handleEmojiClick(emoji); setEmojiOpen(false) }}
                    className='w-8 h-8 flex items-center justify-center text-lg rounded hover:bg-muted transition-colors'
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Mic button */}
        <Button variant='ghost' size='icon' className='shrink-0' onClick={handleMicClick} disabled={disabled}>
          <Mic className='w-5 h-5 text-muted-foreground' />
        </Button>

        {/* Send button */}
        <Button size='icon' onClick={handleSend} disabled={disabled || (!inputValue.trim() && !imagePreview)} className='shrink-0'>
          <Send className='w-4 h-4' />
        </Button>
      </div>
    </div>
  )
}

export default Footer
