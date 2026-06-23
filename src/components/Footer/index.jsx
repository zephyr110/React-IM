
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import StyledFooter, { IconContainer, StyledPopoverContent } from './style'
import Input from 'components/Input'
import Icon from 'components/Icon'
import ClipIcon from 'assets/icons/clip.svg?react'
import SmileIcon from 'assets/icons/smile.svg?react'
import MicrphoneIcon from 'assets/icons/microphone.svg?react'
import PlaneIcon from 'assets/icons/plane.svg?react'
import OptionsIcon from 'assets/icons/options.svg?react'
import Button from 'components/Button'
import Emoji from 'components/Emoji'
import Popover from 'components/Popover'
import { useTheme } from 'styled-components'
import { useMessages } from 'context/MessageContext'

function Footer ({
    children,
    footerAnimation,
    style,
    ...rest
}) {
    const [emojiIconActive, setEmojiIconActive] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const theme = useTheme()
    const { sendTextMessage, activeContactId } = useMessages()

    const handleSend = () => {
        if (!inputValue.trim()) return
        sendTextMessage(inputValue)
        setInputValue('')
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSend()
        }
    }

    return (
        <StyledFooter style={{ ...style, ...footerAnimation }} {...rest}>
            <Input
                placeholder='请输入想和对方说的话'
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={!activeContactId}
                prefix={<Icon icon={ClipIcon} />}
                suffix={
                    <IconContainer>
                        <Popover
                            content={<PopoverContent />}
                            offset={{ x: '-25%' }}
                            onVisible={() => setEmojiIconActive(true)}
                            onHide={() => setEmojiIconActive(false)}
                        >
                            <Icon
                                icon={SmileIcon}
                                color={emojiIconActive ? undefined : theme.gray3}
                                style={{ cursor: 'pointer' }}
                            />
                        </Popover>
                        <Icon icon={MicrphoneIcon} style={{ cursor: 'pointer' }} />
                        <Button size='42px' onClick={handleSend}>
                            <Icon
                                icon={PlaneIcon}
                                color='#fff'
                                style={{ transform: 'translateX(-2px)' }}
                            />
                        </Button>
                    </IconContainer>
                }

            />
        </StyledFooter>
    )
}

/* eslint-disable jsx-a11y/accessible-emoji */
function PopoverContent (props) {
    return (
        <StyledPopoverContent>
            <Emoji label='smile'> 😊 </Emoji>
            <Emoji label='grinning'> 😆 </Emoji>
            <Emoji label='thumbup'> 👍 </Emoji>
            <Emoji label='ok'> 👌 </Emoji>
            <Emoji label='handsputtogether'> 🙏 </Emoji>
            <Emoji label='flexedbicep'> 💪 </Emoji>
            <Emoji label='smilewithsunglasses'> 😎 </Emoji>
            <Icon icon={OptionsIcon} style={{ marginLeft: '24px' }} />
        </StyledPopoverContent>
    )
}

Footer.propTypes = {
    children: PropTypes.any
}

export default Footer


