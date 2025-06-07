import React from 'react';
import type { FormProps } from 'antd';
import { Button, Flex, Form, Input, message  } from 'antd';
import { useNavigate } from 'react-router-dom'
import { login } from '../../api/auth.ts'
import './index.css';
import Logo from '../../assets/Logo.png';
import type { LoginData } from '../../types.ts'
import { GoogleOutlined } from '@ant-design/icons'
import { useUser } from '../../contexts/UserContext';

const Login: React.FC = () => {
    const navigate = useNavigate()
    const { setUsername } = useUser();

    const onFinish: FormProps<LoginData>['onFinish'] = (values) => {
        login(values)
            .then(() => {
                console.log(values.username);
                setUsername(values.username);
                navigate('/')
            })
            .catch(() => {
                message.error('Nieprawidłowe dane logowania. Spróbuj ponownie.')
            })
    }

    const onFinishFailed: FormProps<LoginData>['onFinishFailed'] = (errorInfo,) => {
        console.log('Failed:', errorInfo)
    }

    return (
        <Flex justify="center" align="center" className="h-screen">
            <div className="login-card">
                <div className="logo-container">
                    <img src={Logo} alt="Logo" className="logo"/>
                </div>
                <h2 className="login-title">Login</h2>
                <Form
                    name="basic"
                    layout="vertical"
                    initialValues={{remember: true}}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item<LoginData>
                        label="Username"
                        name="username"
                        rules={[{required: true, message: 'Please input your username!'}]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item<LoginData>
                        label="Password"
                        name="password"
                        rules={[{required: true, message: 'Please input your password!'}]}
                    >
                        <Input.Password/>
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
                                icon={<GoogleOutlined/>}
                                onClick={() =>
                                    (window.location.href = 'http://localhost:3000/auth/google')
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
    )
}

export default Login;