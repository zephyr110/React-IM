
import styled, { css } from 'styled-components'
import Paragraph from 'components/Paragraph'
import Icon from 'components/Icon'
import Text from 'components/Text'

const Time = styled(Paragraph).attrs({ type: 'secondary', size: 'small' })`
    margin: 6px;
    margin-left: 24px;
    word-spacing: 1rem;
`

const BubbleTip = styled(Icon)`
    position: absolute;
    bottom: -15%;
    left: 0;
    z-index: 5;
`

const Bubble = styled.div`
    padding: 15px 22px;
    box-shadow: 0px 8px 24px rgba(0, 0, 0, .1);
    border-radius: 100px;
    position: relative;
    z-index: 10;
`

const MessageText = styled(Text)``

const typeVariants = {
    mine: css`
        ${Bubble}{
            background-color: ${({ theme }) => theme.primaryColor};
        }

        ${BubbleTip}{
            transform: rotateY(180deg);
            left: unset;
            right: 0;

            path{
                fill: ${({ theme }) => theme.primaryColor}
            }
        }

        ${Time}{
            text-align: right;
            margin-left: 0;
            margin-right: 24px;
        }

        ${MessageText}{
            color: #fff;
        }
    `
}

const StyledChatBubble = styled.div`
    display: flex;
    flex-direction: column;

    ${({ type }) => type && typeVariants[type]}
`

const QuoteCard = styled.div`
    padding: 8px 12px;
    margin-bottom: 8px;
    background: rgba(0, 0, 0, 0.05);
    border-left: 3px solid ${({ theme }) => theme.primaryColor};
    border-radius: 4px;
    max-width: 280px;
`

const ImageContent = styled.img`
    max-width: 200px;
    max-height: 200px;
    border-radius: 12px;
    cursor: pointer;
    display: block;
`

const RevokedText = styled.span`
    color: ${({ theme }) => theme.gray3};
    font-size: ${({ theme }) => theme.small};
    font-style: italic;
`

const ReadStatus = styled.span`
    font-size: ${({ theme }) => theme.xxsmall};
    color: ${({ theme }) => theme.gray3};
    margin-left: 8px;
    text-align: right;
    margin-right: 24px;
`

const ContextMenu = styled.div`
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 24px rgba(0,0,0,.15);
    padding: 4px 0;
    min-width: 100px;
`

const ContextMenuItem = styled.div`
    padding: 8px 16px;
    cursor: pointer;
    font-size: 14px;
    &:hover {
        background: ${({ theme }) => theme.gray2};
    }
`

export default StyledChatBubble
export { Time, BubbleTip, Bubble, MessageText, QuoteCard, ImageContent, RevokedText, ReadStatus, ContextMenu, ContextMenuItem }
