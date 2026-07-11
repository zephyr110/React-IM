import React, { useState } from 'react'
import PropTypes from 'prop-types'
import StyledEditProfile, { GroupTitle, GenderAndRegion, SelectGroup, StyledIconInput } from './style'
import Profile from 'components/Profile'
import Avatar from 'components/Avatar'
import useProfile from 'hooks/useProfile'
// import avatarImg1 from 'assets/images/avatar-1.jpg'
import Button from 'components/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { faWeibo, faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons'
import InputText from 'components/Input/InputText'
import Radio from 'components/Radio'
import LabelContainer from 'components/LabelContainer'
import Select from 'components/Select'
import Option from 'components/Option'
import Icon from 'components/Icon'


function EditProfile ({ children, src, ...rest }) {
    const [showEdit, setShowEdit] = useState(false)
    const { profile, updateProfile } = useProfile()
    const [form, setForm] = useState(profile)

    if (!showEdit) {
        return (
            <Profile
                onEdit={() => {
                    setForm(profile)
                    setShowEdit(true)
                }}
                showEditBtn
                showCloseIcon={false}
                src={src}
            />
        )
    }

    const handleSave = () => {
        updateProfile(form)
        setShowEdit(false)
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
                <FontAwesomeIcon icon={faCheck} style={{transform: 'scale(2)'}} onClick={handleSave} />
            </Button>

            <GroupTitle>基本信息</GroupTitle>
            <InputText label='昵称' value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            <GenderAndRegion>
                <Radio.Group label='性别'>
                    <Radio name='gender' checked={form.gender === '男'} onChange={() => setForm({...form, gender: '男'})}>男</Radio>
                    <Radio name='gender' checked={form.gender === '女'} onChange={() => setForm({...form, gender: '女'})}>女</Radio>
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
            <InputText label='个性签名' value={form.signature} onChange={e => setForm({...form, signature: e.target.value})} />

            <GroupTitle>联系信息</GroupTitle>
            <InputText label='联系电话' value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
            <InputText label='电子邮箱' value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            <InputText label='个人网站' value={form.website} onChange={e => setForm({...form, website: e.target.value})} />

            <GroupTitle>社交信息</GroupTitle>
            <IconInput icon={faWeibo} bgColor='#f06767' value={form.weibo} onChange={e => setForm({...form, weibo: e.target.value})} />
            <IconInput icon={faGithub} bgColor='#000' value={form.github} onChange={e => setForm({...form, github: e.target.value})} />
            <IconInput icon={faLinkedin} bgColor='#2483c0' value={form.linkedin} onChange={e => setForm({...form, linkedin: e.target.value})} />
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


