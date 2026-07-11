import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import StyledFooter, {
  IconContainer,
  StyledPopoverContent,
  EmojiGrid,
  EmojiItem,
  CategoryTabs,
  CategoryTab,
  RecordingIndicator,
  RecordingDot,
  RecordingTime,
  RecordingCancelHint,
} from './style'
import Input from 'components/Input'
import Icon from 'components/Icon'
import ClipIcon from 'assets/icons/clip.svg?react'
import SmileIcon from 'assets/icons/smile.svg?react'
import MicrphoneIcon from 'assets/icons/microphone.svg?react'
import PlaneIcon from 'assets/icons/plane.svg?react'
import CrossIcon from 'assets/icons/cross.svg?react'
import Button from 'components/Button'
import Popover from 'components/Popover'
import { useTheme } from 'styled-components'
import { useMessages } from 'context/MessageContext'
import emojis, { categoryLabels } from 'data/emoji'
import useVoiceRecorder from 'hooks/useVoiceRecorder'
import useDrafts from 'hooks/useDrafts'

const EMOJI_CATEGORIES = Object.keys(emojis)

function Footer ({
    children,
    footerAnimation,
    style,
    ...rest
}) {
    const [emojiIconActive, setEmojiIconActive] = useState(false)
    const { saveDraft, getDraft, clearDraft } = useDrafts()
    const theme = useTheme()
    const { sendTextMessage, sendVoiceMessage, sendImageMessage, activeContactId } = useMessages()
    const inputRef = useRef(null)
    const prevContactRef = useRef(activeContactId)

    // State - restore draft for current contact
    const [inputValue, setInputValue] = useState(() => getDraft(activeContactId))
    // 引用回复状态
    const [quoteMessage, setQuoteMessage] = useState(null)
    // 图片发送状态
    const [imagePreview, setImagePreview] = useState(null)
    const fileInputRef = useRef(null)

    // Save draft when switching contacts
    if (prevContactRef.current !== activeContactId) {
        saveDraft(prevContactRef.current, inputValue)
        setInputValue(getDraft(activeContactId))
        prevContactRef.current = activeContactId
    }
    const {
        recordingState,
        duration,
        audioBlob,
        startRecording,
        stopRecording,
        cancelRecording,
        cleanupAudio,
    } = useVoiceRecorder({ maxDuration: 60 })

    // 简单写法：不用 useCallback，避免闭包问题
    const handleSend = () => {
        if (!inputValue.trim() && !imagePreview) return
        if (imagePreview) {
            sendImageMessage(imagePreview)
            setImagePreview(null)
            setInputValue('')
            clearDraft(activeContactId)
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
        if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const handleChange = (e) => {
        setInputValue(e.target.value)
        saveDraft(activeContactId, e.target.value)
    }

    const handleClipClick = () => {
        fileInputRef.current?.click()
    }

    const handleImageSelect = (e) => {
        const file = e.target.files?.[0]
        if (!file || !file.type.startsWith('image/')) return
        if (file.size > 5 * 1024 * 1024) {
            alert('图片大小不能超过5MB')
            return
        }
        setImagePreview(file)
        e.target.value = ''
    }

    const handleCancelImage = () => {
        setImagePreview(null)
    }

    const handleCancelQuote = () => {
        setQuoteMessage(null)
    }

    // 将表情符号插入到输入框光标位置
    const handleEmojiClick = (emojiChar) => {
        const input = inputRef.current
        if (input) {
            const start = input.selectionStart || inputValue.length
            const end = input.selectionEnd || inputValue.length
            const newValue = inputValue.slice(0, start) + emojiChar + inputValue.slice(end)
            setInputValue(newValue)
            requestAnimationFrame(() => {
                const newPos = start + emojiChar.length
                input.setSelectionRange(newPos, newPos)
                input.focus()
            })
        } else {
            setInputValue(prev => prev + emojiChar)
        }
    }

    const handleMicClick = () => {
        if (recordingState === 'idle') {
            startRecording()
        } else if (recordingState === 'recording') {
            stopRecording()
        }
    }

    const handleSendVoice = () => {
        if (!audioBlob) return
        sendVoiceMessage(audioBlob, duration)
        cleanupAudio()
    }

    const handleCancelVoice = () => {
        cancelRecording()
    }

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}"`
    }

    // Expose setQuoteMessage for external use via a global ref
    if (typeof window !== 'undefined') {
        window.__setQuoteMessage = setQuoteMessage
    }

    const renderSuffix = () => {
        if (recordingState === 'recording') {
            return (
                <IconContainer>
                    <RecordingIndicator>
                        <RecordingDot />
                        <RecordingTime>{formatDuration(duration)}</RecordingTime>
                        <RecordingCancelHint>点击停止</RecordingCancelHint>
                    </RecordingIndicator>
                    <Icon icon={CrossIcon} style={{ cursor: 'pointer' }} onClick={handleCancelVoice} />
                </IconContainer>
            )
        }

        if (recordingState === 'done') {
            return (
                <IconContainer>
                    <RecordingIndicator style={{ animation: 'none' }}>
                        <RecordingTime>{formatDuration(duration)}</RecordingTime>
                    </RecordingIndicator>
                    <Icon icon={CrossIcon} style={{ cursor: 'pointer' }} onClick={handleCancelVoice} />
                    <Button size='42px' onClick={handleSendVoice}>
                        <Icon icon={PlaneIcon} color='#fff' style={{ transform: 'translateX(-2px)' }} />
                    </Button>
                </IconContainer>
            )
        }

        return (
            <IconContainer>
                <Popover
                    content={<EmojiPickerContent onEmojiClick={handleEmojiClick} />}
                    offset={{ x: '-25%' }}
                    onVisible={() => setEmojiIconActive(true)}
                    onHide={() => setEmojiIconActive(false)}
                >
                    <Icon icon={SmileIcon} color={emojiIconActive ? undefined : theme.gray3} style={{ cursor: 'pointer' }} />
                </Popover>
                <Icon icon={MicrphoneIcon} style={{ cursor: 'pointer' }} onClick={handleMicClick} />
                <Button size='42px' onClick={handleSend}>
                    <Icon icon={PlaneIcon} color='#fff' style={{ transform: 'translateX(-2px)' }} />
                </Button>
            </IconContainer>
        )
    }

    return (
        <StyledFooter style={{ ...style, ...footerAnimation }} {...rest}>
            {/* 引用消息栏 */}
            {quoteMessage && (
                <div style={{
                    display: 'flex', alignItems: 'center', padding: '8px 12px',
                    background: theme.gray2, borderRadius: 8, marginBottom: 8,
                    fontSize: 13, color: theme.gray3
                }}>
                    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        回复: {quoteMessage.content?.substring(0, 50)}
                    </span>
                    <Icon icon={CrossIcon} style={{ cursor: 'pointer', marginLeft: 8 }} onClick={handleCancelQuote} />
                </div>
            )}

            {/* 图片预览 */}
            {imagePreview && (
                <div style={{ display: 'flex', alignItems: 'center', padding: '4px 12px', marginBottom: 8 }}>
                    <img
                        src={URL.createObjectURL(imagePreview)}
                        alt="preview"
                        style={{ maxHeight: 80, borderRadius: 8 }}
                    />
                    <Icon icon={CrossIcon} style={{ cursor: 'pointer', marginLeft: 8 }} onClick={handleCancelImage} />
                </div>
            )}

            {/* 隐藏的文件选择器 */}
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleImageSelect}
            />

            <Input
                multiline
                placeholder='请输入想和对方说的话，Shift+Enter 换行'
                value={inputValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                disabled={!activeContactId || recordingState !== 'idle'}
                prefix={recordingState === 'idle' ? <Icon icon={ClipIcon} style={{ cursor: 'pointer' }} onClick={handleClipClick} /> : null}
                suffix={renderSuffix()}
                ref={inputRef}
            />
        </StyledFooter>
    )
}

function EmojiPickerContent ({ onEmojiClick }) {
    const [activeCategory, setActiveCategory] = useState(EMOJI_CATEGORIES[0])

    return (
        <StyledPopoverContent>
            <CategoryTabs>
                {EMOJI_CATEGORIES.map((cat) => (
                    <CategoryTab key={cat} $active={activeCategory === cat} onClick={(e) => { e.stopPropagation(); setActiveCategory(cat) }}>
                        {categoryLabels[cat]}
                    </CategoryTab>
                ))}
            </CategoryTabs>
            <EmojiGrid>
                {emojis[activeCategory].map((emojiChar, index) => (
                    <EmojiItem key={`${activeCategory}-${index}`} onClick={() => onEmojiClick(emojiChar)} title={emojiChar}>
                        {emojiChar}
                    </EmojiItem>
                ))}
            </EmojiGrid>
        </StyledPopoverContent>
    )
}

EmojiPickerContent.propTypes = { onEmojiClick: PropTypes.func.isRequired }
Footer.propTypes = { children: PropTypes.any, footerAnimation: PropTypes.object, style: PropTypes.object }

export default Footer
