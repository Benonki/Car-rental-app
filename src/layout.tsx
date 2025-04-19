import React from 'react';
import { CarOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme, Button } from 'antd';
import { Outlet, useLocation } from "react-router-dom";
import './layout.css';
import Logo from './assets/Logo.png';
import { logout } from './api/auth.ts'

const { Header, Content, Sider } = Layout;

const leftItems: MenuProps['items'] = [
    { key: '1', label: 'Strona Główna' },
    { key: '2', label: 'Nasze Auta' },
    { key: '3', label: 'O Nas' },
];

const items2: MenuProps['items'] = [
    {
        key: 'sub1',
        icon: <UserOutlined />,
        label: 'Profil',
        children: [
            { key: '1-1', label: 'Dane osobowe' },
            { key: '1-2', label: 'Historia wypożyczeń' },
            { key: '1-3', label: 'Ulubione' },
            { key: '1-4', label: 'Ustawienia' },
        ],
    },
    {
        key: 'sub2',
        icon: <CarOutlined />,
        label: 'Rodzaje Aut',
        children: [
            { key: '2-1', label: 'Sedan' },
            { key: '2-2', label: 'Kombi' },
            { key: '2-3', label: 'SUV' },
            { key: '2-4', label: 'Coupe' },
            { key: '2-5', label: 'Kabriolet' },
        ],
    },
];


const getSelectedKey = (pathname: string) => {
    if (pathname === "/") return "1";
    if (pathname.startsWith("/cars")) return "2";
    if (pathname.startsWith("/about")) return "3";
    return "";
};

const LayoutApp: React.FC = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const location = useLocation();

    const handleMenuClick: MenuProps['onClick'] = (e) => {
        switch (e.key) {
            case '1':
                window.location.href = '/';
                break;
            case '2':
                window.location.href = '/cars';
                break;
            case '3':
                window.location.href = '/about';
                break;
        }
    };

    const handleSiderMenuClick: MenuProps['onClick'] = (e) => {
        switch (e.key) {
            case '1-1':
                window.location.href = '/profile';
                break;
            case '1-2':
                window.location.href = '/profile?tab=2';
                break;
            case '1-3':
                window.location.href = '/profile?tab=3';
                break;
            case '1-4':
                window.location.href = '/profile?tab=4';
                break;
        }
    };

    const handleLogoutClick = () => {
        logout().then(() => {
            window.location.href = '/login';
        });
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
                        selectedKeys={[getSelectedKey(location.pathname)]}
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
                        onClick={handleSiderMenuClick}
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
