import React from 'react';
import type { FormProps } from 'antd';
import { Button, Checkbox, Form, Input } from 'antd';
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

const App: React.FC = () => (
    <div className="login-container">
        <div className="login-card">
            <div className="logo-container">
                <img src={Logo} alt="Logo" className="logo"/>
            </div>
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

                <Form.Item<FieldType> name="remember" valuePropName="checked">
                    <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-button">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    </div>
);

export default App;
