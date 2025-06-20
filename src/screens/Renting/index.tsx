import { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Typography, Row, Col, Divider, Descriptions, DatePicker, Select, Form, Input, Space, message, Drawer, Radio } from "antd";
import dayjs from 'dayjs';
import { SiStripe } from "react-icons/si";
import { getCarById } from "../../api/cars";
import { getPickUpPlaces, getReturnPlaces, createFullPickUpPlace, createFullReturnPlace } from "../../api/locations";
import { Car, PickUpPlace, ReturnPlace } from "../../types";
import { useUser } from "../../contexts/UserContext";
import './index.css';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

interface RentalFormValues {
    dates: [dayjs.Dayjs, dayjs.Dayjs];
    pickUpPlaceId: string;
    returnPlaceId: string;
    insuranceType: 'NONE' | 'BASIC' | 'PREMIUM';
}

interface AddressFormValues {
    name: string;
    country: string;
    postalCode: string;
    city: string;
    street: string;
    streetNumber: string;
}

const Renting: FC = () => {
    const { customerId } = useUser();
    const [form] = Form.useForm<RentalFormValues>();
    const [pickUpForm] = Form.useForm();
    const [returnForm] = Form.useForm();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [car, setCar] = useState<Car | null>(null);
    const [loading, setLoading] = useState(true);
    const [pickUpPlaces, setPickUpPlaces] = useState<PickUpPlace[]>([]);
    const [returnPlaces, setReturnPlaces] = useState<ReturnPlace[]>([]);
    const [showNewPickUpForm, setShowNewPickUpForm] = useState(false);
    const [showNewReturnForm, setShowNewReturnForm] = useState(false);
    const [totalCost, setTotalCost] = useState<number>(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [carData, pickUpData, returnData] = await Promise.all([
                    getCarById(id!),
                    getPickUpPlaces(),
                    getReturnPlaces()
                ]);

                setCar(carData);
                setPickUpPlaces(pickUpData);
                setReturnPlaces(returnData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                message.error('Nie udało się załadować szczegółów samochodu');
                navigate('/cars');
            }
        };

        fetchData();
    }, [id, navigate]);

    const calculateTotalCost = (dates: [dayjs.Dayjs, dayjs.Dayjs] | null, insuranceType: 'NONE' | 'BASIC' | 'PREMIUM' = 'NONE') => {
        if (!dates || !car) return 0;
        const days = dates[1].diff(dates[0], 'days') + 1;
        const baseCost = days * car.cena;

        let insuranceCost = 0;
        if (insuranceType === 'BASIC') {
            insuranceCost = days * 20;
        } else if (insuranceType === 'PREMIUM') {
            insuranceCost = days * 50;
        }

        return baseCost + insuranceCost;
    };

    const handleDatesChange = (dates: [dayjs.Dayjs, dayjs.Dayjs] | null) => {
        const insuranceType = form.getFieldValue('insuranceType') || 'NONE';
        setTotalCost(calculateTotalCost(dates, insuranceType));
    };

    const handleInsuranceChange = (value: 'NONE' | 'BASIC' | 'PREMIUM') => {
        const dates = form.getFieldValue('dates');
        setTotalCost(calculateTotalCost(dates, value));
    };

    const handleSubmit = async (values: RentalFormValues) => {
        try {
            const [date_of_rental, date_of_return] = values.dates;
            const days = date_of_return.diff(date_of_rental, 'days') + 1;

            let insuranceCost = 0;
            let insuranceCoverage = 'None';

            if (values.insuranceType === 'BASIC') {
                insuranceCost = days * 20;
                insuranceCoverage = 'Scratches';
            } else if (values.insuranceType === 'PREMIUM') {
                insuranceCost = days * 50;
                insuranceCoverage = 'Everything';
            }

            console.log('Rental details:', {
                date_of_rental: date_of_rental.format('YYYY-MM-DD'),
                date_of_return: date_of_return.format('YYYY-MM-DD'),
                status: "Nadchodzące",
                totalCost: calculateTotalCost(values.dates, values.insuranceType),
                carId: id,
                customerId: customerId,
                pick_up_place_id: values.pickUpPlaceId,
                return_place_id: values.returnPlaceId,
                insurance: {
                    type: values.insuranceType,
                    coverage: insuranceCoverage,
                    cost: insuranceCost
                }
            });
            // TODO: MAKE PAYMENT WORK AND CREATE A NEW RENTAL
            message.success('Wypożyczenie zostało złożone!');
        } catch (error) {
            console.error('Error submitting rental:', error);
            message.error('Nie udało się złożyć wypożyczenia');
        }
    };

    const handleCreatePickUpPlace = async (values: AddressFormValues & { name: string }) => {
        try {
            const newPlace = await createFullPickUpPlace({
                name: values.name,
                country: values.country,
                postal_code: values.postalCode,
                city: values.city,
                street: values.street,
                street_number: values.streetNumber
            });

            const newPlaceWithCity = {
                ...newPlace,
                address: {
                    ...newPlace.address,
                    city: values.city
                }
            };

            setPickUpPlaces([...pickUpPlaces, newPlaceWithCity]);
            form.setFieldsValue({ pickUpPlaceId: newPlace.id });
            setShowNewPickUpForm(false);
            pickUpForm.resetFields();
            message.success('Miejsce odbioru dodane pomyślnie!');
        } catch (error) {
            message.error('Błąd podczas dodawania miejsca odbioru');
            console.error(error);
        }
    };

    const handleCreateReturnPlace = async (values: AddressFormValues & { name: string }) => {
        try {
            const newPlace = await createFullReturnPlace({
                name: values.name,
                country: values.country,
                postal_code: values.postalCode,
                city: values.city,
                street: values.street,
                street_number: values.streetNumber
            });

            const newPlaceWithCity = {
                ...newPlace,
                address: {
                    ...newPlace.address,
                    city: values.city
                }
            };

            setPickUpPlaces([...pickUpPlaces, newPlaceWithCity]);
            form.setFieldsValue({ returnPlaceId: newPlace.id });
            setShowNewReturnForm(false);
            returnForm.resetFields();
            message.success('Miejsce zwrotu dodane pomyślnie!');
        } catch (error) {
            message.error('Błąd podczas dodawania miejsca zwrotu');
            console.error(error);
        }
    };

    if (loading) {
        return <div>Ładowanie...</div>;
    }

    if (!car) {
        return <div>Nie znaleziono samochodu</div>;
    }

    return (
        <div className="renting-container">
            <Title level={2}>Podsumowanie Wypożyczenia</Title>

            <Row gutter={[24, 24]}>
                <Col xs={24} md={12}>
                    <Card title="Szczegóły Samochodu" className="car-details-card">
                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                <div className="car-image-container">
                                    <img src={car.image} alt={car.nazwa} className="car-image" />
                                </div>
                            </Col>
                            <Col span={24}>
                                <Descriptions column={1}>
                                    <Descriptions.Item label="Model"><Text strong>{car.nazwa}</Text></Descriptions.Item>
                                    <Descriptions.Item label="Kategoria">{car.kategoria}</Descriptions.Item>
                                    <Descriptions.Item label="Cena za dzień">{car.cena} zł</Descriptions.Item>
                                    <Descriptions.Item label="Dostępność">
                                        <Text type={car.dostepny ? "success" : "danger"}>
                                            {car.dostepny ? "Dostępny" : "Niedostępny"}
                                        </Text>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Opis">{car.opis}</Descriptions.Item>
                                </Descriptions>
                            </Col>
                        </Row>
                    </Card>
                </Col>

                <Col xs={24} md={12}>
                    <Card title="Specyfikacja Techniczna" className="specs-card">
                        <Descriptions column={1}>
                            {car.specification && (
                                <>
                                    <Descriptions.Item label="Rok produkcji">{car.specification.yearOfProduction}</Descriptions.Item>
                                    <Descriptions.Item label="Rejestracja">{car.specification.registration}</Descriptions.Item>
                                    <Descriptions.Item label="VIN">{car.specification.vin}</Descriptions.Item>
                                    <Descriptions.Item label="Kolor">{car.specification.color}</Descriptions.Item>
                                    <Descriptions.Item label="Liczba miejsc">{car.specification.numberOfSeats}</Descriptions.Item>
                                    <Descriptions.Item label="Pojemność silnika">{car.specification.engineCapacity} cm³</Descriptions.Item>
                                    <Descriptions.Item label="Moc">{car.specification.horsepower} KM</Descriptions.Item>
                                    <Descriptions.Item label="Skrzynia biegów">{car.specification.gearbox}</Descriptions.Item>
                                    <Descriptions.Item label="Napęd">{car.specification.driveType}</Descriptions.Item>
                                    <Descriptions.Item label="Typ paliwa">{car.specification.fuelType}</Descriptions.Item>
                                    <Descriptions.Item label="Przebieg">{car.specification.mileage} km</Descriptions.Item>
                                </>
                            )}
                        </Descriptions>
                    </Card>
                </Col>
            </Row>

            <Col xs={24} md={12}>
                <Card title="Szczegóły Wypożyczenia" className="rental-details-card">
                    <Form form={form} onFinish={handleSubmit} layout="vertical">
                        <Form.Item
                            name="dates"
                            label="Okres Wypożyczenia"
                            rules={[{ required: true, message: 'Proszę wybrać daty wypożyczenia' }]}
                        >
                            <RangePicker
                                style={{ width: '100%' }}
                                onChange={(dates) => handleDatesChange(dates as [dayjs.Dayjs, dayjs.Dayjs] | null)}
                            />
                        </Form.Item>

                        <Form.Item
                            name="pickUpPlaceId"
                            label="Miejsce Odbioru"
                            rules={[{ required: true, message: 'Proszę wybrać miejsce odbioru' }]}
                        >
                            <Select
                                showSearch
                                placeholder="Wybierz miejsce odbioru"
                                optionFilterProp="label"
                                filterOption={(input, option) => {
                                    const label = option?.label?.toString() ?? '';
                                    return label.toLowerCase().includes(input.toLowerCase());
                                }}
                                dropdownRender={(menu) => (
                                    <>
                                        {menu}
                                        <Divider style={{ margin: '8px 0' }} />
                                        <Space align="center" style={{ padding: '0 8px 4px' }}>
                                            <Button type="link" onClick={() => setShowNewPickUpForm(true)}>
                                                + Dodaj nowe miejsce
                                            </Button>
                                        </Space>
                                    </>
                                )}
                            >
                                {pickUpPlaces.map(place => (
                                    <Option
                                        key={place.id}
                                        value={place.id}
                                        label={`${place.name} - ${place.address.city}`}
                                    >
                                        {place.name} - {place.address.city}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="returnPlaceId"
                            label="Miejsce Zwrotu"
                            rules={[{ required: true, message: 'Proszę wybrać miejsce zwrotu' }]}
                        >
                            <Select
                                showSearch
                                placeholder="Wybierz miejsce zwrotu"
                                optionFilterProp="label"
                                filterOption={(input, option) => {
                                    const label = option?.label?.toString() ?? '';
                                    return label.toLowerCase().includes(input.toLowerCase());
                                }}
                                dropdownRender={(menu) => (
                                    <>
                                        {menu}
                                        <Divider style={{ margin: '8px 0' }} />
                                        <Space align="center" style={{ padding: '0 8px 4px' }}>
                                            <Button type="link" onClick={() => setShowNewReturnForm(true)}>
                                                + Dodaj nowe miejsce
                                            </Button>
                                        </Space>
                                    </>
                                )}
                            >
                                {returnPlaces.map(place => (
                                    <Option
                                        key={place.id}
                                        value={place.id}
                                        label={`${place.name} - ${place.address.city}`}
                                    >
                                        {place.name} - {place.address.city}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="insuranceType"
                            label="Ubezpieczenie"
                            initialValue="NONE"
                        >
                            <Radio.Group
                                optionType="button"
                                buttonStyle="solid"
                                onChange={(e) => handleInsuranceChange(e.target.value)}
                                className="insurance-radio-group"
                            >
                                <Row gutter={[8, 16]} style={{ width: '100%' }}>
                                    <Col span={8}>
                                        <div className="insurance-option">
                                            <Radio.Button
                                                value="NONE"
                                                style={{ width: '100%', borderRadius: '4px' }}
                                            >
                                                Brak
                                            </Radio.Button>
                                            <div className="insurance-description">
                                                Brak ubezpieczenia
                                            </div>
                                        </div>
                                    </Col>
                                    <Col span={8}>
                                        <div className="insurance-option">
                                            <Radio.Button
                                                value="BASIC"
                                                style={{ width: '100%', borderRadius: '4px' }}
                                            >
                                                Basic (+20zł/dzień)
                                            </Radio.Button>
                                            <div className="insurance-description">
                                                Pokrywa drobne rysy
                                            </div>
                                        </div>
                                    </Col>
                                    <Col span={8}>
                                        <div className="insurance-option">
                                            <Radio.Button
                                                value="PREMIUM"
                                                style={{ width: '100%', borderRadius: '4px' }}
                                            >
                                                Premium (+50zł/dzień)
                                            </Radio.Button>
                                            <div className="insurance-description">
                                                Pełne pokrycie szkód
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </Radio.Group>
                        </Form.Item>

                        <Divider />

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <Text strong style={{ fontSize: '1.2rem' }}>
                                    Suma: {totalCost} zł
                                </Text>
                                {totalCost > 0 && (
                                    <Text type="secondary" style={{ display: 'block' }}>
                                        {Math.floor(totalCost / car.cena)} dni × {car.cena} zł/dzień
                                    </Text>
                                )}
                            </div>
                            <Button
                                type="primary"
                                size="large"
                                onClick={() => form.submit()}
                                disabled={!car.dostepny || totalCost <= 0}
                                icon={<SiStripe size={24} />}
                                style={{
                                    backgroundColor: '#635bff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
                                Zapłać
                            </Button>
                        </div>
                    </Form>
                </Card>
            </Col>

            <Drawer
                title="Dodaj nowe miejsce odbioru"
                width={500}
                open={showNewPickUpForm}
                onClose={() => {
                    setShowNewPickUpForm(false);
                    pickUpForm.resetFields();
                }}
                placement="right"
                destroyOnClose
            >
                <Form form={pickUpForm} onFinish={handleCreatePickUpPlace} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Nazwa punktu"
                        rules={[{ required: true, message: 'Wprowadź nazwę punktu' }]}
                    >
                        <Input placeholder="np. Oddział centralny" />
                    </Form.Item>
                    <Form.Item
                        name="street"
                        label="Ulica"
                        rules={[{ required: true, message: 'Wprowadź ulicę' }]}
                    >
                        <Input placeholder="ul. Przykładowa" />
                    </Form.Item>
                    <Form.Item
                        name="streetNumber"
                        label="Numer budynku"
                        rules={[{ required: true, message: 'Wprowadź numer budynku' }]}
                    >
                        <Input placeholder="12" />
                    </Form.Item>
                    <Form.Item
                        name="city"
                        label="Miasto"
                        rules={[{ required: true, message: 'Wprowadź miasto' }]}
                    >
                        <Input placeholder="Warszawa" />
                    </Form.Item>
                    <Form.Item
                        name="postalCode"
                        label="Kod pocztowy"
                        rules={[{ required: true, message: 'Wprowadź kod pocztowy' }]}
                    >
                        <Input placeholder="00-000" />
                    </Form.Item>
                    <Form.Item
                        name="country"
                        label="Kraj"
                        rules={[{ required: true, message: 'Wprowadź kraj' }]}
                    >
                        <Input placeholder="Polska" />
                    </Form.Item>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            Zapisz
                        </Button>
                        <Button onClick={() => {
                            setShowNewPickUpForm(false);
                            pickUpForm.resetFields();
                        }}>
                            Anuluj
                        </Button>
                    </Space>
                </Form>
            </Drawer>

            <Drawer
                title="Dodaj nowe miejsce zwrotu"
                width={500}
                open={showNewReturnForm}
                onClose={() => {
                    setShowNewReturnForm(false);
                    returnForm.resetFields();
                }}
                placement="right"
                destroyOnClose
            >
                <Form form={returnForm} onFinish={handleCreateReturnPlace} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Nazwa punktu"
                        rules={[{ required: true, message: 'Wprowadź nazwę punktu' }]}
                    >
                        <Input placeholder="np. Oddział Warszawa" />
                    </Form.Item>
                    <Form.Item
                        name="street"
                        label="Ulica"
                        rules={[{ required: true, message: 'Wprowadź ulicę' }]}
                    >
                        <Input placeholder="ul. Przykładowa" />
                    </Form.Item>
                    <Form.Item
                        name="streetNumber"
                        label="Numer budynku"
                        rules={[{ required: true, message: 'Wprowadź numer budynku' }]}
                    >
                        <Input placeholder="12" />
                    </Form.Item>
                    <Form.Item
                        name="city"
                        label="Miasto"
                        rules={[{ required: true, message: 'Wprowadź miasto' }]}
                    >
                        <Input placeholder="Warszawa" />
                    </Form.Item>
                    <Form.Item
                        name="postalCode"
                        label="Kod pocztowy"
                        rules={[{ required: true, message: 'Wprowadź kod pocztowy' }]}
                    >
                        <Input placeholder="00-000" />
                    </Form.Item>
                    <Form.Item
                        name="country"
                        label="Kraj"
                        rules={[{ required: true, message: 'Wprowadź kraj' }]}
                    >
                        <Input placeholder="Polska" />
                    </Form.Item>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            Zapisz
                        </Button>
                        <Button onClick={() => {
                            setShowNewReturnForm(false);
                            returnForm.resetFields();
                        }}>
                            Anuluj
                        </Button>
                    </Space>
                </Form>
            </Drawer>
        </div>
    );
};


export default Renting;