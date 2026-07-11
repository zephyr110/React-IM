import React, { useState, useRef, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Play } from 'lucide-react'
import { cn } from '@/lib/utils'

function VoiceMessage ({ children, type, time, audioSrc, ...rest }) {
    const [playing, setPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const audioRef = useRef(null)
    const rafRef = useRef(null)

    // Clean up animation frame
    useEffect(() => {
        return () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current)
            }
        }
    }, [])

    // Update playback progress
    const updateProgress = useCallback(() => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime)
            if (!audioRef.current.paused) {
                rafRef.current = requestAnimationFrame(updateProgress)
            }
        }
    }, [])

    // Handle audio play/pause
    const handleTogglePlay = useCallback(() => {
        if (!audioRef.current) return

        if (playing) {
            audioRef.current.pause()
            setPlaying(false)
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current)
            }
        } else {
            audioRef.current.play().then(() => {
                setPlaying(true)
                rafRef.current = requestAnimationFrame(updateProgress)
            }).catch(err => {
                console.error('音频播放失败:', err)
            })
        }
    }, [playing, updateProgress])

    // Audio playback ended
    const handleEnded = useCallback(() => {
        setPlaying(false)
        setCurrentTime(0)
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current)
            rafRef.current = null
        }
    }, [])

    // Format time display
    const formatTime = (secs) => {
        if (typeof secs === 'string') return secs
        const totalSecs = Math.floor(secs)
        const mins = Math.floor(totalSecs / 60)
        const remainSecs = totalSecs % 60
        return mins > 0
            ? `${mins}:${remainSecs.toString().padStart(2, '0')}`
            : `${remainSecs}"`
    }

    const displayTime = playing ? formatTime(currentTime) : (time || '')
    const isMine = type === 'mine'

    return (
        <div
            className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-2xl',
                isMine ? 'bg-primary text-white' : 'bg-muted'
            )}
            {...rest}
        >
            {/* Play button */}
            <button
                className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors',
                    isMine
                        ? 'bg-white text-primary hover:bg-white/90'
                        : 'bg-primary text-white hover:bg-primary/90'
                )}
                onClick={handleTogglePlay}
            >
                <Play
                    className={cn('w-4 h-4 ml-0.5', playing && 'opacity-60')}
                    fill="currentColor"
                />
            </button>

            {/* Wave visualization bars */}
            <div className="flex-1 flex items-end gap-[2px] h-6">
                {[35, 55, 40, 70, 45, 60, 30, 50, 65, 38, 55, 42, 68, 48, 58, 33, 52, 62, 40, 55].map((h, i) => (
                    <div
                        key={i}
                        className={cn(
                            'w-[3px] rounded-full transition-all',
                            isMine ? 'bg-white' : 'bg-primary'
                        )}
                        style={{
                            height: `${h}%`,
                            opacity: playing ? 0.9 : 0.35,
                        }}
                    />
                ))}
            </div>

            {/* Duration */}
            <span className={cn('text-sm font-medium shrink-0', isMine && 'text-white')}>
                {displayTime}
            </span>

            {/* Hidden audio element */}
            {audioSrc && <audio ref={audioRef} src={audioSrc} onEnded={handleEnded} preload='auto' />}
        </div>
    )
}

VoiceMessage.propTypes = {
    children: PropTypes.any,
    type: PropTypes.oneOf(['mine']),
    time: PropTypes.string,
    audioSrc: PropTypes.string,
}

export default VoiceMessage
