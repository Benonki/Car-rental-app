import React from 'react';
import { CarOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import {Divider, MenuProps} from 'antd';
import { Layout, Menu, theme, Button } from 'antd';
import { Outlet, useLocation } from "react-router-dom";
import './layout.css';
import Logo from './assets/Logo.png';
import { logout } from './api/auth.ts'
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { useUser } from "./contexts/UserContext.tsx";

const { Header, Content, Sider, Footer } = Layout;

const leftItems: MenuProps['items'] = [
    { key: '1', label: 'Strona Główna' },
    { key: '2', label: 'Nasze Auta' },
    { key: '3', label: 'O Nas' },
    { key: '4', label: 'FAQ' },
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
            { key: '2-6', label: 'MPV' },
            { key: '2-1', label: 'Sedan' },
            { key: '2-2', label: 'Kombi' },
            { key: '2-3', label: 'SUV' },
            { key: '2-4', label: 'Coupe' },
            { key: '2-5', label: 'Kabriolet' }
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
    const { username, logout: contextLogout } = useUser();

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
            case '4':
                window.location.href = '/FAQ';
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
            case '2-1':
                window.location.href = '/cars?type=Sedan';
                break;
            case '2-2':
                window.location.href = '/cars?type=Kombi';
                break;
            case '2-3':
                window.location.href = '/cars?type=SUV';
                break;
            case '2-4':
                window.location.href = '/cars?type=Coupe';
                break;
            case '2-5':
                window.location.href = '/cars?type=Kabriolet';
                break;
            case '2-6':
                window.location.href = '/cars?type=Mpv';
                break;
        }
    };

    const handleLogoutClick = async () => {
        logout().then(async () => {
            await logout();
            contextLogout();
            window.location.href = '/login';
        });
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header className="layout-header" style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
                <div className="header-logo" onClick={() => window.location.href = '/'}>
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
                        style={{ height: 'calc(100% - 60px)', borderRight: 0 }}
                        items={items2}
                        onClick={handleSiderMenuClick}
                    />

                    <div className="user-info-section">
                        <Divider className="custom-divider" />
                        <div className="username-display">
                            <div className="username-content">
                                <UserOutlined className="user-icon" />
                                <span className="username-text">{username || "Gość"}</span>
                            </div>
                        </div>
                    </div>
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
                    <Footer className="app-footer">
                    <div className="footer-copyright">
                        <p>&copy; {new Date().getFullYear()} CarRental App. Wszelkie prawa zastrzeżone.</p>
                    </div>
                    <div className="footer-content">
                        <div className="content-left">
                        <h4>Kontakt</h4>
                            <ul>
                                <li>
                                <span className="footer-icon">📍</span>
                                ul. Przykładowa 15, 00-001 Warszawa
                                </li>
                                <li>
                                <span className="footer-icon">📞</span>
                                +48 123 456 789
                                </li>
                                <li>
                                <span className="footer-icon">✉️</span>
                                    kontakt@przykladowa-wypozyczalnia.pl
                                </li>
                            </ul>
                        </div>
                        <div className="content-center">
                        <h4>Informacje</h4>
                            <ul>
                                <li>Regulamin</li>
                                <li>Polityka prywatności</li>
                                <li>FAQ</li>
                                <li>Kontakt</li>
                            </ul>
                        </div>
                        <div className="content-right">
                        <h4>Godziny otwarcia</h4>
                        <ul>
                            <li>Pon – Pt: 08:00 – 18:00</li>
                            <li>Sobota: 09:00 – 14:00</li>
                            <li>Niedziela: 10:00 - 14:00</li>
                        </ul>
                        </div>
                        <div className="footer-social">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                            <FaFacebookF />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                            <FaInstagram />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                            <FaLinkedinIn />
                            </a>
                        </div>
                    </div>
                    </Footer>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default LayoutApp;
