import { FC, useEffect, useState } from "react";
import {
  Avatar, Button, Card, Typography, Row, Col, Form, Input, message, Divider, Progress
} from "antd";
import {
  UserOutlined, MailOutlined, PhoneOutlined, CalendarOutlined, EditOutlined, SaveOutlined, CloseOutlined
} from "@ant-design/icons";
import { axiosInstance } from "../../api/instance";
import { useUser } from "../../contexts/UserContext";
import type { Customer } from "../../types";
import "./index.css";

const { Title, Text } = Typography;

const Profile: FC = () => {
  const { customerId } = useUser();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (customerId) {
      axiosInstance.get(`/customers/${customerId}`).then((res) => {
        setCustomer(res.data);
        form.setFieldsValue({
          ...res.data.personalData,
          ...res.data.personalData.address,
        });
      });
    }
  }, [customerId, form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const personalDataId = customer?.personalData.id;
      const addressId = customer?.personalData.address.id;

      if (!personalDataId || !addressId) {
        message.error("Brakuje identyfikatorów do edycji danych.");
        return;
      }

      await axiosInstance.patch(`/personalData/${personalDataId}`, {
        ...values,
        addressId,
      });

      await axiosInstance.patch(`/addresses/${addressId}`, {
        country: values.country,
        postal_code: values.postal_code,
        city: values.city,
        street: values.street,
        street_number: values.street_number,
      });

      const updatedCustomer = {
        ...customer,
        personalData: {
          ...customer.personalData,
          ...values,
          address: {
            ...customer.personalData.address,
            ...values,
          },
        },
      };

      setCustomer(updatedCustomer);
      setIsEditing(false);
      message.success("Dane zapisane pomyślnie!");
    } catch (error) {
      console.error("Błąd zapisu:", error);
      message.error("Błąd podczas zapisu danych.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.setFieldsValue({
      ...customer?.personalData,
      ...customer?.personalData.address,
    });
  };

  return (
    <div className="profile-grid">
      <Card className="profile-sidebar">
        <div className="avatar-wrapper">
          <Avatar size={90} src={`https://ui-avatars.com/api/?name=${customer?.personalData.first_name}+${customer?.personalData.last_name}&background=0D8ABC&color=fff`}/>
        </div>
        <Title level={4} className="centered-name">
          {customer?.personalData.first_name} {customer?.personalData.last_name}
        </Title>

        <div className="loyalty-box">
          <Text strong>Program lojalnościowy</Text>
          <div className="loyalty-points">{customer?.loyalty_points} punktów</div>
          <Progress percent={((customer?.loyalty_points ?? 0) % 1000) / 10} showInfo={false} />
          <Text type="secondary" style={{ fontSize: 12 }}>
            Zbierz jeszcze {1000 - (customer?.loyalty_points ?? 0) % 1000} punktów, aby otrzymać bonus.
          </Text>
        </div>

        <Divider />

        <div className="sidebar-info">
          <p><MailOutlined /> {customer?.personalData.email}</p>
          <p><PhoneOutlined /> {customer?.personalData.phone_number}</p>
          <p><CalendarOutlined /> Klient od: {customer?.date_of_joining}</p>
        </div>

        <Button icon={<EditOutlined />} type="primary" block onClick={() => setIsEditing(true)}>
          Edytuj profil
        </Button>
      </Card>

      <Card className="profile-content">
        <Title level={4}>Dane kontaktowe</Title>
        {!isEditing ? (
          <>
            <Row gutter={24}>
              <Col span={12}>
                <Text type="secondary">Imię</Text>
                <p><Text strong>{customer?.personalData.first_name}</Text></p>
              </Col>
              <Col span={12}>
                <Text type="secondary">Nazwisko</Text>
                <p><Text strong>{customer?.personalData.last_name}</Text></p>
              </Col>
              <Col span={12}>
                <Text type="secondary">Email</Text>
                <p><Text strong>{customer?.personalData.email}</Text></p>
              </Col>
              <Col span={12}>
                <Text type="secondary">Telefon</Text>
                <p><Text strong>{customer?.personalData.phone_number}</Text></p>
              </Col>
              <Col span={12}>
                <Text type="secondary">Ulica</Text>
                <p><Text strong>{customer?.personalData.address.street}</Text></p>
            </Col>
            <Col span={12}>
                <Text type="secondary">Numer budynku</Text>
                <p><Text strong>{customer?.personalData.address.street_number}</Text></p>
            </Col>
            <Col span={12}>
                <Text type="secondary">Kod pocztowy</Text>
                <p><Text strong>{customer?.personalData.address.postal_code}</Text></p>
            </Col>
            <Col span={12}>
                <Text type="secondary">Miasto</Text>
                <p><Text strong>{customer?.personalData.address.city}</Text></p>
            </Col>
            <Col span={12}>
                <Text type="secondary">Kraj</Text>
                <p><Text strong>{customer?.personalData.address.country}</Text></p>
            </Col>
            </Row>
          </>
        ) : (
          <Form layout="vertical" form={form}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="first_name" label="Imię"><Input /></Form.Item>
                <Form.Item name="last_name" label="Nazwisko"><Input /></Form.Item>
                <Form.Item name="email" label="Email"><Input /></Form.Item>
                <Form.Item name="phone_number" label="Telefon"><Input /></Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="street" label="Ulica"><Input /></Form.Item>
                <Form.Item name="street_number" label="Numer budynku"><Input /></Form.Item>
                <Form.Item name="postal_code" label="Kod pocztowy"><Input /></Form.Item>
                <Form.Item name="city" label="Miasto"><Input /></Form.Item>
                <Form.Item name="country" label="Kraj"><Input /></Form.Item>
              </Col>
            </Row>
            <div style={{ marginTop: 24 }}>
              <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} style={{ marginRight: 12 }}>
                Zapisz
              </Button>
              <Button icon={<CloseOutlined />} danger onClick={handleCancel}>
                Anuluj
              </Button>
            </div>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default Profile;
