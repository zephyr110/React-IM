import { useState, useRef, useCallback } from 'react'

/**
 * 语音录制 Hook
 * 使用 MediaRecorder API 录制音频，返回录制状态、控制方法和音频数据
 */
export default function useVoiceRecorder ({ maxDuration = 60 } = {}) {
  const [recordingState, setRecordingState] = useState('idle') // idle | recording | done
  const [duration, setDuration] = useState(0)
  const [audioBlob, setAudioBlob] = useState(null)
  const [audioUrl, setAudioUrl] = useState(null)

  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const timerRef = useRef(null)
  const streamRef = useRef(null)

  const cleanupStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
  }, [])

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm'

      const recorder = new MediaRecorder(stream, { mimeType })
      mediaRecorderRef.current = recorder
      chunksRef.current = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType })
        const url = URL.createObjectURL(blob)
        setAudioBlob(blob)
        setAudioUrl(url)
        setRecordingState('done')
        clearTimer()
        cleanupStream()
      }

      recorder.onerror = (e) => {
        console.error('[VoiceRecorder] recorder error:', e.error)
        setRecordingState('idle')
        clearTimer()
        cleanupStream()
      }

      setRecordingState('recording')
      setDuration(0)
      setAudioBlob(null)
      setAudioUrl(prev => {
        if (prev) URL.revokeObjectURL(prev)
        return null
      })

      recorder.start(100) // 每 100ms 收集一次数据

      const startTime = Date.now()
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000)
        setDuration(elapsed)
        if (elapsed >= maxDuration) {
          if (mediaRecorderRef.current?.state === 'recording') {
            mediaRecorderRef.current.stop()
          }
        }
      }, 200)
    } catch (err) {
      console.error('麦克风访问失败:', err)
      setRecordingState('idle')
    }
  }, [maxDuration, clearTimer, cleanupStream])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
    clearTimer()
  }, [clearTimer])

  const cancelRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      // 先绑定 onstop 清理，再停止
      mediaRecorderRef.current.onstop = () => {
        chunksRef.current = []
        setAudioBlob(null)
        setAudioUrl(null)
        setRecordingState('idle')
        clearTimer()
        cleanupStream()
      }
      mediaRecorderRef.current.stop()
    } else {
      cleanupAudio()
    }
  }, [clearTimer, cleanupStream])

  const cleanupAudio = useCallback(() => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
    }
    setAudioBlob(null)
    setAudioUrl(null)
    setRecordingState('idle')
    setDuration(0)
    clearTimer()
    cleanupStream()
  }, [audioUrl, clearTimer, cleanupStream])

  return {
    recordingState,
    duration,
    audioBlob,
    audioUrl,
    startRecording,
    stopRecording,
    cancelRecording,
    cleanupAudio,
  }
}
