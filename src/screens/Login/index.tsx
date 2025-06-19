import React, {useEffect} from 'react';
import type { FormProps } from 'antd';
import { Button, Flex, Form, Input, message } from 'antd';
import {useNavigate, useSearchParams} from 'react-router-dom';
import { decodeJwt, login } from '../../api/auth.ts';
import './index.css';
import Logo from '../../assets/Logo.png';
import type { LoginData } from '../../types.ts';
import { GoogleOutlined } from '@ant-design/icons';
import { useUser } from '../../contexts/UserContext';
import Cookies from "js-cookie";

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { setUsername } = useUser();

    useEffect(() => {
        const token = searchParams.get('token');
        const refreshToken = searchParams.get('refreshToken');

        if (token && refreshToken) {
            Cookies.set('authToken', token, { expires: 1 });
            Cookies.set('refreshToken', refreshToken, { expires: 7 });

            setTimeout(() => {
                const decodedToken = decodeJwt(token);
                if (decodedToken && decodedToken.sub) {
                    setUsername(decodedToken.sub);
                    message.success('Zalogowano przez Google pomyślnie!');
                    navigate('/');
                } else {
                    message.error('Błąd podczas logowania przez Google');
                    navigate('/login');
                }
            }, 200);
        }
    }, [searchParams, navigate, setUsername]);

    const onFinish: FormProps<LoginData>['onFinish'] = async (values) => {
        try {
            const response = await login(values);
            if (response.message === 'Success') {
                message.success('Zalogowano pomyślnie!');
                setUsername(values.email);
                navigate('/');
            } else {
                message.error(response.message || 'Nieprawidłowe dane logowania.');
            }
        } catch {
            message.error('Nieprawidłowe dane logowania. Spróbuj ponownie.');
        }
    };

    const onFinishFailed: FormProps<LoginData>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Flex justify="center" align="center" className="h-screen">
            <div className="login-card">
                <div className="logo-container">
                    <img src={Logo} alt="Logo" className="logo" />
                </div>
                <h2 className="login-title">Login</h2>
                <Form
                    name="basic"
                    layout="vertical"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item<LoginData>
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Please input your email!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<LoginData>
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-button">
                            Zaloguj się
                        </Button>
                    </Form.Item>

                    <div className="center-button">
                        <Form.Item label={null}>
                            <Button
                                type="default"
                                icon={<GoogleOutlined />}
                                onClick={() =>
                                    (window.location.href = 'http://localhost:8080/oauth2/authorization/google')
                                }
                            >
                                Zaloguj przez Google
                            </Button>

                        </Form.Item>
                    </div>
                </Form>
                <p className="register-text">
                    Pierwszy raz? <a href="/register" className="register-link">Zarejestruj się</a>
                </p>
            </div>
        </Flex>
    );
};

export default Login;