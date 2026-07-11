import React, { useState, useRef, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import StyledVoiceMessage from './style'
import Button from 'components/Button'
import Icon from 'components/Icon'
import Play from 'assets/icons/play.svg?react'
import Wave from 'assets/icons/wave.svg?react'
import { useTheme } from 'styled-components'
import Text from 'components/Text'

function VoiceMessage ({ children, type, time, audioSrc, ...rest }) {
    const theme = useTheme()
    const [playing, setPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const audioRef = useRef(null)
    const rafRef = useRef(null)

    // 清理动画帧
    useEffect(() => {
        return () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current)
            }
        }
    }, [])

    // 更新播放进度
    const updateProgress = useCallback(() => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime)
            if (!audioRef.current.paused) {
                rafRef.current = requestAnimationFrame(updateProgress)
            }
        }
    }, [])

    // 处理音频播放/暂停
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

    // 音频播放结束
    const handleEnded = useCallback(() => {
        setPlaying(false)
        setCurrentTime(0)
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current)
            rafRef.current = null
        }
    }, [])

    // 格式化时间显示
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

    return (
        <StyledVoiceMessage type={type} {...rest}>
            <Button size='40px' onClick={handleTogglePlay}>
                <Icon
                    icon={Play}
                    color='#fff'
                    width='14'
                    height='16'
                    style={{
                        transform: 'translateX(1px)',
                        opacity: playing ? 0.6 : 1,
                    }}
                />
            </Button>
            <Icon
                icon={Wave}
                width='100%'
                height='100%'
                color={theme.primaryColor}
                style={{ opacity: playing ? 0.7 : 1 }}
            />
            <Text bold>{displayTime}</Text>
            {audioSrc && <audio ref={audioRef} src={audioSrc} onEnded={handleEnded} preload='auto' />}
        </StyledVoiceMessage>
    )
}

VoiceMessage.propTypes = {
    children: PropTypes.any,
    type: PropTypes.oneOf(['mine']),
    time: PropTypes.string,
    audioSrc: PropTypes.string,
}

export default VoiceMessage
