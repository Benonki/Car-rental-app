import React from 'react';
import { LaptopOutlined, NotificationOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme, Button } from 'antd';
import { Outlet } from "react-router";
import './layout.css';
import Logo from './assets/Logo.png';
import { logout } from './api/auth.ts'

const { Header, Content, Sider } = Layout;

const leftItems: MenuProps['items'] = [
    { key: '1', label: 'nav 1' },
    { key: '2', label: 'nav 2' },
];

const items2: MenuProps['items'] = [UserOutlined, LaptopOutlined, NotificationOutlined].map(
    (icon, index) => {
        const key = String(index + 1);

        return {
            key: `sub${key}`,
            icon: React.createElement(icon),
            label: `subnav ${key}`,
            children: Array.from({ length: 4 }).map((_, j) => {
                const subKey = index * 4 + j + 1;
                return {
                    key: subKey,
                    label: `option${subKey}`,
                };
            }),
        };
    },
);

const LayoutApp: React.FC = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const handleMenuClick: MenuProps['onClick'] = (e) => {
        if (e.key === '1' || e.key === '2') {
            console.log(`Clicked on nav ${e.key}`);
        }
    };

    const handleLogoutClick = () => {
        logout().then(() => {
            window.location.href = '/login'
        })
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header className="layout-header" style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
                <div className="header-logo">
                    <img src={Logo} alt="Logo" className="miniLogo" />
                </div>
                <div className="header-menu-container">
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={['2']}
                        items={leftItems}
                        style={{ flex: 1, minWidth: 0 }}
                        onClick={handleMenuClick}
                    />
                    <Button
                        type="primary"
                        icon={<LogoutOutlined />}
                        onClick={handleLogoutClick}
                    >
                        Wyloguj się
                    </Button>
                </div>
            </Header>
            <Layout style={{ marginTop: 64, marginLeft: 200, flex: 1 }}>
                <Sider width={200} className="layout-sider" style={{ background: colorBgContainer }}>
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        style={{ height: '100%', borderRight: 0 }}
                        items={items2}
                    />
                </Sider>
                <Layout style={{ padding: '10px 24px 24px', flex: 1 }}>
                    <Content
                        className="layout-content"
                        style={{
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                            flex: 1,
                        }}
                    >
                        <Outlet />
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default LayoutApp;