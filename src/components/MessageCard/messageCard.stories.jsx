
import React from 'react'
import MessageCard from '.'
import avatarImg from 'assets/images/avatar.jpg'

export default {
    title: 'UI组件/ MessageCard',
    component: MessageCard
}

export const Default = () => {
    return (
        <MessageCard
            avatarSrc={avatarImg}
            name='John Thompson'
            avatarStatus='online'
            statusText='online'
            time='3 hours ago'
            message='Lorem ipsum dolor sit amet consectetur adipisicing elit. '
            unreadCount={3}
        />
    )
}


export const Active = () => {
    return (
        <MessageCard
            active
            avatarSrc={avatarImg}
            name='John Thompson'
            avatarStatus='online'
            statusText='online'
            time='3 hours ago'
            message='Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident numquam facilis, cupiditate repellendus molestias dolor et. Tempora doloribus hic aspernatur asperiores molestiae dignissimos eligendi aliquam laborum voluptatem amet iste rem id, ab excepturi, assumenda molestias vitae? Facere ratione ea corporis. Mollitia dolor veniam numquam officiis vitae molestiae, fugit totam quas voluptatibus. Magnam ad impedit maiores voluptatibus saepe incidunt, consequuntur alias, quas nisi vel, voluptas ex quia atque quo a iste nihil exercitationem eaque omnis porro! Saepe asperiores, quia earum soluta tenetur non reiciendis natus totam, maiores labore illum. Ab ut consectetur quibusdam vero vel expedita possimus iusto inventore ratione libero?'
            unreadCount={3}
        />
    )
}

export const Replied = () => {
    return (
        <MessageCard
            replied
            active
            avatarSrc={avatarImg}
            name='John Thompson'
            avatarStatus='online'
            statusText='online'
            time='3 hours ago'
            message='Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident numquam facilis, cupiditate repellendus molestias dolor et. Tempora doloribus hic aspernatur asperiores molestiae dignissimos eligendi aliquam laborum voluptatem amet iste rem id, ab excepturi, assumenda molestias vitae? Facere ratione ea corporis. Mollitia dolor veniam numquam officiis vitae molestiae, fugit totam quas voluptatibus. Magnam ad impedit maiores voluptatibus saepe incidunt, consequuntur alias, quas nisi vel, voluptas ex quia atque quo a iste nihil exercitationem eaque omnis porro! Saepe asperiores, quia earum soluta tenetur non reiciendis natus totam, maiores labore illum. Ab ut consectetur quibusdam vero vel expedita possimus iusto inventore ratione libero?'
            unreadCount={3}
        />
    )
}

export const RepliedInactive = () => {
    return (
        <MessageCard
            replied
            avatarSrc={avatarImg}
            name='John Thompson'
            avatarStatus='online'
            statusText='online'
            time='3 hours ago'
            message='Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident numquam facilis, cupiditate repellendus molestias dolor et. Tempora doloribus hic aspernatur asperiores molestiae dignissimos eligendi aliquam laborum voluptatem amet iste rem id, ab excepturi, assumenda molestias vitae? Facere ratione ea corporis. Mollitia dolor veniam numquam officiis vitae molestiae, fugit totam quas voluptatibus. Magnam ad impedit maiores voluptatibus saepe incidunt, consequuntur alias, quas nisi vel, voluptas ex quia atque quo a iste nihil exercitationem eaque omnis porro! Saepe asperiores, quia earum soluta tenetur non reiciendis natus totam, maiores labore illum. Ab ut consectetur quibusdam vero vel expedita possimus iusto inventore ratione libero?'
            unreadCount={3}
        />
    )
}
