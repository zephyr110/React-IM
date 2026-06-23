
import React from 'react'
import PropTypes from 'prop-types'
import StyledMessageList, { ChatList } from './style'
// 抽离filterList组件
// import Filter from 'components/Filter'
// import Select from 'components/Select'
// import Option from 'components/Option'
// import Button from 'components/Button'
// import Icon from 'components/Icon'
// import Plus from 'assets/icons/plus.svg?react'
// import Input from 'components/Input'
import MessageCard from 'components/MessageCard'
import avatarImg1 from 'assets/images/avatar-1.jpg'
import FilterList from 'components/FilterList'
import { animated } from 'react-spring'
import useStaggeredList from 'hooks/useStaggeredList'
function MessageList ({ children, ...rest }) {
    const trailAnimation = useStaggeredList(6)

    return (
        <StyledMessageList {...rest}>
            {/* 抽离filterList组件 */}
            {/* <Input.Search />
            <ChatFilter /> */}
            <FilterList
                options={['最新消息优先', '在线好友优先']}
                actionLabel='创建会话'
            >
                <ChatList>
                    {[1, 2, 3, 4, 5, 6].map((_, index) => (
                        <animated.div key={index} style={trailAnimation[index]}>
                            <MessageCard
                                key={index}
                                active={index === 3}
                                replied={index % 3 === 0}
                                avatarSrc={avatarImg1}
                                name='楚中天'
                                avatarStatus='online'
                                StatusText='在线'
                                time='3 小时之前'
                                message='Lorem ipsum dolor sit amet consectetur adipisicing elit.'
                                unreadCount={2}
                            />
                        </animated.div>
                    ))}
                </ChatList>
            </FilterList>
        </StyledMessageList>
    )
}

// 抽离filterList组件
// function ChatFilter () {
//     return (
//         <Filter style={{ padding: '20px 0' }}>
//             <Filter.Filters label='列表排序'>
//                 <Select>
//                     <Option>最新消息优先</Option>
//                     <Option>好友列表优先</Option>
//                 </Select>
//             </Filter.Filters>

//             <Filter.Action label='创建会话'>
//                 <Button>
//                     <Icon icon={Plus} width={12} height={12} />
//                 </Button>
//             </Filter.Action>
//         </Filter>
//     )
// }

MessageList.propTypes = {
    children: PropTypes.any
}

export default MessageList


