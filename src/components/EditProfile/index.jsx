import React, { useState } from 'react'
import PropTypes from 'prop-types'
import StyledEditProfile, { GroupTitle, GenderAndRegion, SelectGroup, StyledIconInput } from './style'
import Profile from 'components/Profile'
import Avatar from 'components/Avatar'
// import avatarImg1 from 'assets/images/avatar-1.jpg'
import Button from 'components/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { faWeibo, faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons'
import 'styled-components/macro'
import InputText from 'components/Input/InputText'
import Radio from 'components/Radio'
import LabelContainer from 'components/LabelContainer'
import Select from 'components/Select'
import Option from 'components/Option'
import Icon from 'components/Icon'


function EditProfile ({ children, src, ...rest }) {
    const [showEdit, setShowEdit] = useState(false)

    if (!showEdit) {
        return (
            <Profile
                onEdit={() => setShowEdit(true)}
                showEditBtn
                showCloseIcon={false}
                src={src}
            />
        )
    }
    return (
        <StyledEditProfile {...rest}>
            <Avatar
                src={src}
                size='160px'
                css={`
                    grid-area: 1 / 1 / 3 / 2; 
                    justify-self: center;
                    margin-bottom: 12px;
                `}
            />
            <Button
                size='52px'
                css={`
                    grid-area: 1 / 1 / 3 / 2;
                    justify-self: center;
                    align-self: end;
                    margin-top: 136px;
                    margin-left: 100px;
                    z-index: 10;
                `}
            >
                <FontAwesomeIcon icon={faCheck} style={{transform: 'scale(2)'}} onClick={() => setShowEdit(false)} />
            </Button>

            <GroupTitle>基本信息</GroupTitle>
            <InputText label='昵称' />
            <GenderAndRegion>
                <Radio.Group label='性别'>
                    <Radio name='gender'>男</Radio>
                    <Radio name='gender'>女</Radio>
                </Radio.Group>
                <LabelContainer label='地区'>
                    <SelectGroup>
                        <Select type='form'>
                            <Option>省份</Option>
                        </Select>
                        <Select type='form'>
                            <Option>城市</Option>
                        </Select>
                        <Select type='form'>
                            <Option>区县</Option>
                        </Select>
                    </SelectGroup>
                </LabelContainer>
            </GenderAndRegion>
            <InputText label='个性签名' />

            <GroupTitle>联系信息</GroupTitle>
            <InputText label='联系电话' />
            <InputText label='电子邮箱' />
            <InputText label='个人网站' />

            <GroupTitle>社交信息</GroupTitle>
            <IconInput icon={faWeibo} bgColor='#f06767' />
            <IconInput icon={faGithub} bgColor='#000' />
            <IconInput icon={faLinkedin} bgColor='#2483c0' />
        </StyledEditProfile>
    )
}

function IconInput ({ icon, bgColor, ...rest }) {
    return (
        <StyledIconInput>
            <Icon.Social icon={icon} bgColor={bgColor} />
            <InputText  {...rest} />
        </StyledIconInput>
    )
}

EditProfile.propTypes = {
    children: PropTypes.any
}


export default EditProfile


