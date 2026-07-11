import styled, { css, keyframes } from 'styled-components'
import { animated } from 'react-spring'

const IconContainer = styled.div`
    display: flex;
    align-items: center;
    margin-left: -30px;
    & > * {
        margin-left: 16px;
    }
`

const StyledPopoverContent = styled.div`
    display: flex;
    flex-direction: column;
    width: 320px;
    max-height: 360px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0px 8px 32px rgba(0, 0, 0, 0.12);
    overflow: hidden;
`

const EmojiGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 4px;
    padding: 12px;
    overflow-y: auto;
    flex: 1;
    min-height: 200px;
`

const EmojiItem = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    font-size: 20px;
    border: none;
    background: none;
    cursor: pointer;
    border-radius: 6px;
    padding: 0;
    transition: background 0.15s;

    &:hover {
        background: ${({ theme }) => theme.gray2};
    }
`

const CategoryTabs = styled.div`
    display: flex;
    border-bottom: 1px solid ${({ theme }) => theme.gray4};
    padding: 4px 8px;
    gap: 2px;
    overflow-x: auto;

    &::-webkit-scrollbar {
        display: none;
    }
`

const CategoryTab = styled.button`
    flex-shrink: 0;
    padding: 6px 10px;
    font-size: 14px;
    border: none;
    background: none;
    cursor: pointer;
    border-radius: 6px;
    color: ${({ theme }) => theme.gray3};
    white-space: nowrap;
    transition: all 0.15s;

    ${({ $active }) => $active && css`
        color: ${({ theme }) => theme.primaryColor};
        background: ${({ theme }) => theme.gray2};
    `}

    &:hover {
        background: ${({ theme }) => theme.gray2};
    }
`

const StyledFooter = styled(animated.footer)`
    padding: 12px 15px;
    width: 100%;
`

// 语音录制相关样式
const recordPulse = keyframes`
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
`

const RecordingIndicator = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 16px;
    background: ${({ theme }) => theme.red2};
    border-radius: 20px;
    animation: ${recordPulse} 1.5s ease-in-out infinite;
`

const RecordingDot = styled.span`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #fff;
`

const RecordingTime = styled.span`
    color: #fff;
    font-size: 13px;
    font-variant-numeric: tabular-nums;
`

const RecordingCancelHint = styled.span`
    color: rgba(255, 255, 255, 0.7);
    font-size: 12px;
    margin-left: 4px;
`

const QuoteBar = styled.div`
    display: flex;
    align-items: center;
    padding: 8px 12px;
    background: ${({ theme }) => theme.gray2};
    border-radius: 8px;
    margin-bottom: 8px;
    font-size: 13px;
    color: ${({ theme }) => theme.gray3};
`

const QuoteContent = styled.span`
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`

const ImagePreviewContainer = styled.div`
    display: flex;
    align-items: center;
    padding: 4px 12px;
    margin-bottom: 8px;
`

const ImagePreviewImg = styled.img`
    max-height: 80px;
    border-radius: 8px;
`

export default StyledFooter
export { IconContainer, StyledPopoverContent, EmojiGrid, EmojiItem, CategoryTabs, CategoryTab, RecordingIndicator, RecordingDot, RecordingTime, RecordingCancelHint, QuoteBar, QuoteContent, ImagePreviewContainer, ImagePreviewImg }
