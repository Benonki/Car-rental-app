import React from 'react';
import type { FormProps } from 'antd';
import { Button, Checkbox, Flex, Form, Input } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import './index.css';
import Logo from '../../assets/Logo.png';

type FieldType = {
    username?: string;
    password?: string;
    remember?: boolean;
};

const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values);
};

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

const Register: React.FC = () => (
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
                <img src={Logo} alt="Logo" className="logo"/>
            </div>
            <h2 className="register-title">Register</h2>
            <Form
                name="basic"
                layout="vertical"
                initialValues={{remember: true}}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item<FieldType>
                    label="Username"
                    name="username"
                    rules={[{required: true, message: 'Please input your username!'}]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item<FieldType>
                    label="Password"
                    name="password"
                    rules={[{required: true, message: 'Please input your password!'}]}
                >
                    <Input.Password/>
                </Form.Item>

                <Form.Item<FieldType> valuePropName="checked">
                    <Checkbox>Akceptuje warunki użytkowania</Checkbox>
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

export default Register;