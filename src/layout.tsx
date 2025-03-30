import React from 'react';
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme, Button } from 'antd';
import { Outlet, useNavigate } from "react-router";
import './layout.css';
import Logo from './assets/Logo.png';

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
    const navigate = useNavigate();

    const handleMenuClick: MenuProps['onClick'] = (e) => {
        if (e.key === '1' || e.key === '2') {
            console.log(`Clicked on nav ${e.key}`);
        }
    };

    const handleLoginClick = () => {
        navigate('/login');
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header className="layout-header">
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
                        type="text"
                        onClick={handleLoginClick}
                        style={{
                            color: '#fff',
                            marginLeft: 'auto',
                            fontWeight: 'bold',
                        }}
                    >
                        Login
                    </Button>
                </div>
            </Header>
            <Layout style={{ flex: 1 }}>
                <Sider width={200} className="layout-sider" style={{ background: colorBgContainer }}>
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        style={{ height: '100%', borderRight: 0 }}
                        items={items2}
                    />
                </Sider>
                <Layout style={{ padding: '0 24px 24px', flex: 1 }}>
                    <Breadcrumb
                        items={[{ title: 'Home' }, { title: 'List' }, { title: 'App' }]}
                        className="layout-breadcrumb"
                    />
                    <Content
                        className="layout-content"
                        style={{
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                            flex: 1,
                        }}
                    >
                        Content
                        <Outlet />
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default LayoutApp;