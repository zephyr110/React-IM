import styled from 'styled-components'

const StyledLogin = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background: ${({ theme }) => theme.background};

    .login-card {
        width: 360px;
        padding: 40px;
        border-radius: 12px;
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
        text-align: center;

        h1 {
            font-size: 28px;
            margin-bottom: 8px;
        }

        p {
            color: ${({ theme }) => theme.inactiveColor};
            margin-bottom: 24px;
        }
    }

    .avatar-select {
        display: flex;
        gap: 12px;
        justify-content: center;
        margin: 16px 0;

        img {
            width: 56px;
            height: 56px;
            border-radius: 50%;
            cursor: pointer;
            border: 3px solid transparent;
            transition: all 0.2s;

            &.selected {
                border-color: ${({ theme }) => theme.primaryColor};
            }
        }
    }
`

export default StyledLogin
