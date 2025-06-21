import { FC, useEffect, useState } from "react";
import { Avatar, Button, Card, Typography, Row, Col, Form, Input, message, Space, Tabs, Table, Tag, Progress, Modal, Rate } from "antd";
import { UserOutlined, EditOutlined, SaveOutlined, CloseOutlined, HistoryOutlined } from "@ant-design/icons";
import { fetchCustomerData, fetchCustomerRentals, updatePersonalData, updateAddress } from '../../api/customer';
import { useUser } from "../../contexts/UserContext";
import type { Customer, Rental, Opinion, Insurance } from "../../types";
import { postOpinion, getAllOpinions } from '../../api/opinions';
import { patchRental } from "../../api/rental";
import { fetchInsuranceByRentalId } from "../../api/insurance";
import "./index.css";

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Column } = Table;

const Profile: FC = () => {
    const { customerId } = useUser();
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [rentals, setRentals] = useState<Rental[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('1');
    const [form] = Form.useForm();
    const [customerOpinions, setCustomerOpinions] = useState<Opinion[]>([]);

    const [isInsuranceModalVisible, setIsInsuranceModalVisible] = useState(false);
    const [insuranceDetails, setInsuranceDetails] = useState<Insurance | null>(null);


    const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
    const [selectedRental, setSelectedRental] = useState<Rental | null>(null);
    const [reviewForm] = Form.useForm();

    const handleReviewSubmit = async () => {
    try {
        const values = await reviewForm.validateFields();

        if (!customer || !selectedRental) return;

        await postOpinion({
        customerId: customer.id,
        carId: selectedRental.car.id,
        rating: values.rating,
        description: values.description,
        date_of_publishing: new Date().toISOString().split('T')[0]
        });

        getAllOpinions().then((opinions) => {
          const userOpinions = opinions.filter(op => op.customer.id === customerId);
          setCustomerOpinions(userOpinions);
        });

        message.success("Opinia została dodana!");
        setIsReviewModalVisible(false);
        reviewForm.resetFields();
    } catch (err) {
        console.error(err);
        message.error("Nie udało się dodać opinii.");
    }
    };

    const handleRentalCancel = async (rentalId: string) => {
      try {
        await patchRental(rentalId, { status: "Anulowane" });
        setRentals(prev =>
          prev.map(r =>
            r.id === rentalId ? { ...r, status: "Anulowane" } : r
          )
        );
        message.success("Wypożyczenie zostało anulowane.");
      } catch (error) {
        console.error(error);
        message.error("Nie udało się anulować wypożyczenia.");
      }
    };

    const handleInsuranceClick = async (rentalId: string) => {
      try {
        const response = await fetchInsuranceByRentalId(rentalId);
        setInsuranceDetails(response.data);
        setIsInsuranceModalVisible(true);
      } catch (err) {
        message.error("Nie udało się pobrać danych o ubezpieczeniu.");
      }
    };


  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const tabParam = queryParams.get('tab');
    if (tabParam === '2') {
      setActiveTab('2');
    }

    if (customerId) {
      fetchCustomerData(customerId).then((data: Customer) => {
        setCustomer(data);
        form.setFieldsValue({
          ...data.personalData,
          ...data.personalData.address,
        });
      });

      fetchCustomerRentals(customerId).then((data: Rental[]) => {
        setRentals(data);

        const completedRentals = data.filter(rental => rental.status === 'Zakończone');
        const points = completedRentals.length * 50;

        setCustomer(prev => prev ? { ...prev, loyalty_points: points } : null);
      });

      getAllOpinions().then((opinions) => {
        const userOpinions = opinions.filter(op => op.customer.id === customerId);
        setCustomerOpinions(userOpinions);
      });
    }
  }, [customerId, form]);

  const isRentalReviewed = (rental: Rental): boolean => {
    return customerOpinions.some(op => op.car.id === rental.car.id);
  };


  const handleTabChange = (key: string) => {
    setActiveTab(key);
    window.history.pushState({}, '', `/profile?tab=${key}`);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const personalDataId = customer?.personalData.id;
      const addressId = customer?.personalData.address.id;

      if (!personalDataId || !addressId) {
        message.error("Brakuje identyfikatorów do edycji danych.");
        return;
      }

      await updatePersonalData(personalDataId, {
        ...values,
        addressId: addressId
      });

      await updateAddress(addressId, values);

      const updatedCustomer = {
        ...customer,
        personalData: {
          ...customer.personalData,
          ...values,
          address: {
            ...customer.personalData.address,
            ...values
          }
        }
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
      ...customer?.personalData.address
    });
  };

  return (
    <div className="profile-container">
      <div className="profile-grid">
        <Card className="profile-card">
          <div className="avatar-wrapper">
            <Avatar
              size={90}
              icon={<UserOutlined />}
              src={`https://ui-avatars.com/api/?name=${customer?.personalData.first_name}+${customer?.personalData.last_name}&background=0D8ABC&color=fff`}
            />
          </div>
          <Title level={4} className="centered-name">
            {customer?.personalData.first_name} {customer?.personalData.last_name}
          </Title>

          <div className="loyalty-box">
            <Text strong>Program lojalnościowy</Text>
            <div className="loyalty-points">{customer?.loyalty_points ?? 0} punktów</div>
            <Progress percent={((customer?.loyalty_points ?? 0) % 1000) / 10} showInfo={false} />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Zdobądź jeszcze {1000 - (customer?.loyalty_points ?? 0) % 1000} punktów, aby odebrać bonus.
            </Text>
          </div>

          <div className="sidebar-info">
            <p><Text type="secondary">📧</Text> {customer?.personalData.email}</p>
            <p><Text type="secondary">📞</Text> {customer?.personalData.phone_number}</p>
            <p><Text type="secondary">📅</Text> Klient od: {customer?.date_of_joining}</p>
          </div>
        </Card>

        <Card className="tabs-card">
          <Tabs
              activeKey={activeTab}
              onChange={handleTabChange}
          >
            <TabPane tab="Dane osobowe" key="1">
              {!isEditing ? (
                <Row gutter={16}>
                  <Col span={12}><Text type="secondary">Imię</Text><p><Text strong>{customer?.personalData.first_name}</Text></p></Col>
                  <Col span={12}><Text type="secondary">Nazwisko</Text><p><Text strong>{customer?.personalData.last_name}</Text></p></Col>
                  <Col span={12}><Text type="secondary">Email</Text><p><Text strong>{customer?.personalData.email}</Text></p></Col>
                  <Col span={12}><Text type="secondary">Telefon</Text><p><Text strong>{customer?.personalData.phone_number}</Text></p></Col>
                  <Col span={12}><Text type="secondary">Ulica</Text><p><Text strong>{customer?.personalData.address.street}</Text></p></Col>
                  <Col span={12}><Text type="secondary">Numer budynku</Text><p><Text strong>{customer?.personalData.address.street_number}</Text></p></Col>
                  <Col span={12}><Text type="secondary">Kod pocztowy</Text><p><Text strong>{customer?.personalData.address.postal_code}</Text></p></Col>
                  <Col span={12}><Text type="secondary">Miasto</Text><p><Text strong>{customer?.personalData.address.city}</Text></p></Col>
                  <Col span={12}><Text type="secondary">Kraj</Text><p><Text strong>{customer?.personalData.address.country}</Text></p></Col>
                  <Col span={12}><Text type="secondary">Numer dowodu</Text><p><Text strong>{customer?.personalData.id_number}</Text></p></Col>
                  <Col span={12}><Text type="secondary">Pesel</Text><p><Text strong>{customer?.personalData.pesel}</Text></p></Col>

                  <Button type="primary" icon={<EditOutlined />} onClick={() => setIsEditing(true)}>
                    Edytuj profil
                </Button>
                </Row>
              ) : (
                <Form layout="vertical" form={form} validateMessages={{
                    required: "Pole wymagane",
                    types: {
                      email: "Podaj poprawny adres e-mail",
                    },
                    string: {
                      min: "Minimalna liczba znaków: ${min}",
                      max: "Maksymalna liczba znaków: ${max}"
                    },
                    pattern: {
                      mismatch: "${label} ma niepoprawny format"
                    }
                  }}>
                  <Row gutter={[8, 8]}>
                    <Col xs={24} sm={12}>
                      <Form.Item name="first_name" label="Imię" rules={[{ required: true }, { pattern: /^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ\s-]{2,}$/, message: "Podaj poprawne imię" }]}>
                        <Input />
                      </Form.Item>

                      <Form.Item name="last_name" label="Nazwisko" rules={[{ required: true }, { pattern: /^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ\s-]{2,}$/, message: "Podaj poprawne nazwisko" }]}>
                        <Input />
                      </Form.Item>

                      <Form.Item name="pesel" label="PESEL" rules={[{ required: true }, { pattern: /^\d{11}$/, message: "PESEL musi mieć dokładnie 11 cyfr" }]}>
                        <Input />
                      </Form.Item>

                      <Form.Item name="id_number" label="Numer dowodu" rules={[{ required: true }, { pattern: /^[A-Z]{3}\d{6}$/, message: "Wprowadź numer w formacie ABC123456" }]}>
                        <Input />
                      </Form.Item>

                      <Form.Item name="phone_number" label="Telefon" rules={[{ required: true }, { pattern: /^[0-9]{9,15}$/, message: "Podaj poprawny numer telefonu" }]}>
                        <Input />
                      </Form.Item>

                      <Form.Item name="email" label="Email" rules={[{ required: true }, { type: 'email', message: "Niepoprawny adres e-mail" }]}>
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item name="country" label="Kraj" rules={[{ required: true }, { pattern: /^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ\s-]{2,}$/, message: "Podaj poprawny kraj" }]}>
                        <Input />
                      </Form.Item>

                      <Form.Item name="postal_code" label="Kod pocztowy" rules={[{ required: true }, { pattern: /^\d{2}-\d{3}$/, message: "Format: 00-000" }]}>
                        <Input />
                      </Form.Item>

                      <Form.Item name="city" label="Miasto" rules={[{ required: true }, { pattern: /^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ\s-]{2,}$/, message: "Podaj poprawne miasto" }]}>
                        <Input />
                      </Form.Item>

                      <Form.Item name="street" label="Ulica" rules={[{ required: true }, { min: 2, message: "Podaj poprawną nazwę ulicy" }]}>
                        <Input />
                      </Form.Item>

                      <Form.Item name="street_number" label="Numer budynku" rules={[{ required: true }, { pattern: /^[0-9]+[A-Za-z]?$/, message: "Np. 12 lub 12A" }]}>
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Space className="mt-large">
                      <Space className="mt-large" direction={window.innerWidth < 768 ? "vertical" : "horizontal"}>
                          <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} block={window.innerWidth < 768}>
                              Zapisz
                          </Button>
                          <Button danger icon={<CloseOutlined />} onClick={handleCancel} block={window.innerWidth < 768}>
                              Anuluj
                          </Button>
                      </Space>
                  </Space>
                </Form>
              )}
            </TabPane>

            <TabPane tab={<span><HistoryOutlined /> Historia wypożyczeń</span>} key="2">
              <Title level={4}>Twoje wypożyczenia</Title>
              <Table dataSource={rentals} rowKey="id" pagination={{ pageSize: 3 }}  scroll={{ x: true }}>
                <Column title="Samochód" key="car" align="center" render={(_, record: Rental) => `${record.car.model.make.name} ${record.car.model.name}`} />
                <Column title="Data odbioru" dataIndex="date_of_rental" key="date_of_rental" align="center" />
                <Column title="Data zwrotu" dataIndex="date_of_return" key="date_of_return" align="center" />
                <Column title="Status" key="status" align="center" render={(_, record: Rental) => <Tag color={record.status === 'Zakończone' ? 'green' : record.status === 'Nadchodzące' ? 'blue' : record.status === 'Anulowane' ? 'red' : 'gray'}>{record.status}</Tag>} />
                <Column title="Cena (PLN)" dataIndex="total_cost" key="total_cost" align="center" render={(cost: number) => `${cost} zł`} />
                <Column
                  title="Ocena"
                  key="rating"
                  align="center"
                  render={(_, record: Rental) => {
                    const opinion = customerOpinions.find(op => op.car.id === record.car.id);
                    return opinion ? (
                      <Space>
                        <span>{opinion.rating}/5</span>
                        <Rate disabled defaultValue={1} count={1} />
                      </Space>
                    ) : '-';
                  }}
                />

                <Column
                    title="Akcje"
                    key="actions"
                    align="center"
                    render={(_, record: Rental) => (
                        <Space>
                        {record.status === 'Nadchodzące' && (
                          <Button type="link" danger onClick={() => handleRentalCancel(record.id)}>
                            Anuluj
                          </Button>
                        )}
                        {record.status === 'Zakończone' && !isRentalReviewed(record) && (
                        <Button
                          type="link"
                          onClick={() => {
                            setSelectedRental(record);
                            setIsReviewModalVisible(true);
                          }}
                        >
                          Opinia
                        </Button>
                        )}
                        {record.status === 'Zakończone' && isRentalReviewed(record) && (
                        <Tag color="gold">Oceniono</Tag>
                        )}
                        {record.status === 'Zakończone' && (
                        <Button
                          type="link"
                          onClick={() => handleInsuranceClick(record.id)}
                        >
                          Ubezpieczenie
                        </Button>
                      )}
                  </Space>
                  )}
                />
              </Table>
            </TabPane>
          </Tabs>
        </Card>
        <Modal
            title="Wystaw opinię"
            open={isReviewModalVisible}
            onCancel={() => setIsReviewModalVisible(false)}
            onOk={handleReviewSubmit}
            okText="Wyślij"
            cancelText="Anuluj"
            width={window.innerWidth < 768 ? '90%' : '50%'}
            >
            <Form layout="vertical" form={reviewForm}>
                <Form.Item
                name="rating"
                label="Ocena"
                rules={[{ required: true, message: "Podaj ocenę!" }]}
                >
                <Rate />
                </Form.Item>
                <Form.Item
                name="description"
                label="Opis"
                rules={[{ required: true, message: "Wpisz swoją opinię." }]}
                >
                <Input.TextArea rows={4} />
                </Form.Item>
            </Form>
        </Modal>


        <Modal
          title="Szczegóły ubezpieczenia"
          open={isInsuranceModalVisible}
          onCancel={() => setIsInsuranceModalVisible(false)}
          footer={null}
        >
          {insuranceDetails ? (
            <div>
              <p><strong>Typ:</strong> {insuranceDetails.insurance_type}</p>
              <p><strong>Koszt:</strong> {insuranceDetails.cost} zł</p>
            </div>
          ) : (
            <p>Brak danych.</p>
          )}
        </Modal>

      </div>
    </div>
  );
};

export default Profile;