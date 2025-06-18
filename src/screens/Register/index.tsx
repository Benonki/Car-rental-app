import React from 'react';
import type { FormProps } from 'antd';
import { Button, Checkbox, Flex, Form, Input, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { register } from '../../api/auth.ts';
import './index.css';
import Logo from '../../assets/Logo.png';
import { AxiosError } from 'axios';

type FieldType = {
    email: string;
    password: string;
    terms: boolean;
};

const Register: React.FC = () => {
    const navigate = useNavigate();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        try {
            // Sprawdź, czy użytkownik zaakceptował warunki
            if (!values.terms) {
                message.error('Musisz zaakceptować warunki użytkowania');
                return;
            }

            // Wyślij dane rejestracyjne
            const response = await register({
                email: values.email,
                password: values.password
            });

            if (response === "User registered") {
                message.success('Rejestracja zakończona pomyślnie!');
                navigate('/login');
            } else {
                message.error(response || 'Rejestracja nie powiodła się');
            }
        } catch (error: unknown) {
            const err = error as AxiosError<{ message: string }>;
            message.error(err.response?.data?.message || 'Wystąpił błąd podczas rejestracji');
        }
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Flex justify="center" align="center" className="h-screen">
            <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                className="back-button"
                onClick={() => window.history.back()}
            >
                Powrót
            </Button>

            <div className="register-card">
                <div className="logo-container">
                    <img src={Logo} alt="Logo" className="logo" />
                </div>
                <h2 className="register-title">Register</h2>
                <Form
                    name="basic"
                    layout="vertical"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item<FieldType>
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Podaj swój email!' },
                            { type: 'email', message: 'Podaj poprawny adres email!' }
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Hasło"
                        name="password"
                        rules={[
                            { required: true, message: 'Podaj hasło!' },
                            { min: 6, message: 'Hasło musi mieć co najmniej 6 znaków!' }
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item<FieldType>
                        name="terms"
                        valuePropName="checked"
                        rules={[
                            {
                                validator: (_, value) =>
                                    value ? Promise.resolve() : Promise.reject('Musisz zaakceptować warunki użytkowania'),
                            },
                        ]}
                    >
                        <Checkbox>Akceptuję warunki użytkowania</Checkbox>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="register-button">
                            Zarejestruj się
                        </Button>
                    </Form.Item>
                </Form>
                <p className="login-text">
                    Masz już konto? <a href="/login" className="login-link">Zaloguj się</a>
                </p>
            </div>
        </Flex>
    );
};

export default Register;