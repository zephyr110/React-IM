
import React from 'react'
import PropTypes from 'prop-types'
import StyledNavBar, { StyledMenuItem, MenuIcon, MenuItems } from './style';
import Badge from 'components/Badge';
import Avatar from 'components/Avatar';
import avatarImg1 from 'assets/images/avatar-1.jpg'
import { faCommentDots, faUsers, faFolder, faCog, faEllipsisH, faStickyNote } from '@fortawesome/free-solid-svg-icons';
import 'styled-components/macro'
import { Link, matchPath, useLocation, Route } from 'react-router-dom'

function NavBar ({ children, ...rest }) {
    return (

        <StyledNavBar {...rest}>
            <Avatar src={avatarImg1} status='online' />
            <MenuItems>
                <MenuItem to='/' showBadge icon={faCommentDots} />
                <MenuItem to='/contcats' icon={faUsers} />
                <MenuItem to='/files' icon={faFolder} />
                <MenuItem to='/notes' icon={faStickyNote} />
                <MenuItem to=' ' icon={faEllipsisH} />
                <MenuItem
                    to='/settings'
                    icon={faCog}
                    css={`
                        align-self: end;
                    `}
                />
            </MenuItems>
        </StyledNavBar>
    )
}

function MenuItem ({ to, icon, showBadge, ...rest }) {
    // 判断路由
    const location = useLocation()
    // 当前路径与传递进来的路径匹配时，显示active
    const active = !!matchPath(location.pathname, {
        path: to,
        exact: to === '/'
    }) ? 1 : 0

    return (
        <StyledMenuItem active={active} {...rest}>
            <Route>
                <Link to={to}>
                    <Badge show={showBadge}>
                        <MenuIcon active={active} icon={icon} />
                    </Badge>
                </Link>
            </Route>
        </StyledMenuItem>
    )
}

NavBar.propTypes = {
    children: PropTypes.any
}

export default NavBar
export { MenuItem }

