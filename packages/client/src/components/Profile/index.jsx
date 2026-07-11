import React from 'react'
import PropTypes from 'prop-types'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { X, Pen } from 'lucide-react'
import useProfile from 'hooks/useProfile'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWeibo, faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons'
import paper1 from 'assets/images/paper-1.jpg'
import paper2 from 'assets/images/paper-2.jpg'
import paper3 from 'assets/images/paper-3.jpg'

function SocialLink ({ icon, bgColor, href }) {
    const circle = (
        <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-transform hover:scale-110"
            style={{ backgroundColor: bgColor }}
        >
            <FontAwesomeIcon icon={icon} className="text-lg" />
        </div>
    )
    if (href) {
        return <a href={href} target="_blank" rel="noopener noreferrer">{circle}</a>
    }
    return circle
}

function Description ({ label, children }) {
    return (
        <p className="text-sm">
            <span className="text-muted-foreground">{label}: </span>
            <span>{children}</span>
        </p>
    )
}

function Profile ({
    showEditBtn,
    showCloseIcon = true,
    onCloseClick,
    onEdit,
    status,
    children,
    src,
    name,
    ...rest
}) {
    const { profile } = useProfile()

    return (
        <div
            className="flex flex-col items-center relative py-8 px-6 h-screen overflow-auto"
            {...rest}
        >
            {/* Close button */}
            {showCloseIcon && (
                <button
                    className="absolute right-6 top-6 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                    onClick={onCloseClick}
                >
                    <X className="w-5 h-5" />
                </button>
            )}

            {/* Avatar with optional edit button */}
            <div className="relative my-6">
                <Avatar className="w-40 h-40">
                    <AvatarImage src={src} />
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>
                {showEditBtn && (
                    <Button
                        size="icon"
                        className="absolute -bottom-1 -right-1 rounded-full w-12 h-12 shadow-md z-10 bg-primary hover:bg-primary/90"
                        onClick={onEdit}
                    >
                        <Pen className="w-5 h-5 text-white" />
                    </Button>
                )}
            </div>

            {/* Name */}
            <p className="text-lg font-medium mb-3">
                {name || profile.name || '未设置昵称'}
            </p>

            {/* Region */}
            {profile.region && (
                <p className="text-sm text-muted-foreground mb-3">{profile.region}</p>
            )}

            {/* Signature */}
            {profile.signature && (
                <p className="text-sm text-center mb-6">{profile.signature}</p>
            )}

            {/* Social links */}
            <div className="flex gap-4 mb-8">
                <SocialLink icon={faWeibo} bgColor="#f06767" href="http://www.weibo.com" />
                <SocialLink icon={faGithub} bgColor="#000" />
                <SocialLink icon={faLinkedin} bgColor="#2483c0" />
            </div>

            <Separator className="mb-8" />

            {/* Contact section */}
            <div className="w-full space-y-4 mb-8">
                <Description label='联系电话'>{profile.phone}</Description>
                <Description label='电子邮件'>{profile.email}</Description>
                <Description label='个人网站'>{profile.website}</Description>
            </div>

            <Separator className="mb-8" />

            {/* Album section */}
            <div className="w-full">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-muted-foreground">相册（31）</span>
                    <a
                        href="http://www.baidu.com"
                        className="text-sm text-primary no-underline hover:underline"
                    >
                        查看全部 &rarr;
                    </a>
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                    <img src={paper1} alt="" className="w-full aspect-square object-cover rounded-md" />
                    <img src={paper2} alt="" className="w-full aspect-square object-cover rounded-md" />
                    <img src={paper3} alt="" className="w-full aspect-square object-cover rounded-md" />
                </div>
            </div>
        </div>
    )
}

Profile.propTypes = {
    children: PropTypes.any,
    showEditBtn: PropTypes.bool,
    showCloseIcon: PropTypes.bool,
    onCloseClick: PropTypes.func,
    onEdit: PropTypes.func,
    status: PropTypes.any,
    src: PropTypes.string,
    name: PropTypes.string,
}

export default Profile
