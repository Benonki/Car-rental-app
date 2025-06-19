import {FC, useEffect, useState} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Card, Typography, Row, Col, Divider, Tag, Rate, Tabs } from "antd";
import type { Car } from '../../types.ts';
import { getCars } from '../../api/cars';
import './index.css';

const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;

const Cars: FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [cars, setCars] = useState<Car[]>([]);

    const queryParams = new URLSearchParams(location.search);
    const activeCategory = queryParams.get("type")?.toLowerCase() || "all";

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const data = await getCars();
                setCars(data);
            } catch (error) {
                console.error('Error loading cars:', error);
            }
        };
        fetchCars();
    }, []);

    const filteredCars = activeCategory === "all"
        ? cars
        : cars.filter(auto => auto.kategoria.toLowerCase() === activeCategory);

    const categories = [
        { key: "mpv", label: "MPV" },
        { key: "sedan", label: "Sedan" },
        { key: "kombi", label: "Kombi" },
        { key: "all", label: "Wszystkie" },
        { key: "suv", label: "SUV" },
        { key: "coupe", label: "Coupe" },
        { key: "kabriolet", label: "Kabriolet" }
    ];

    const handleTabChange = (key: string) => {
        const path = key === "all" ? "/cars" : `/cars?type=${key}`;
        navigate(path);
    };

    return (
        <div className="cars-container">
            <section className="section">
                <Title level={2} className="section-title">Nasza Flota Samochodów</Title>
                <Paragraph className="section-subtitle">
                    Wybierz spośród naszych nowoczesnych i komfortowych pojazdów
                </Paragraph>

                <div className="category-tabs">
                    <Tabs
                        defaultActiveKey="all"
                        activeKey={activeCategory}
                        onChange={handleTabChange}
                        centered
                    >
                        {categories.map(category => (
                            <TabPane key={category.key} tab={category.label} />
                        ))}
                    </Tabs>
                </div>

                <Row gutter={[24, 24]}>
                    {filteredCars.map(auto => (
                        <Col xs={24} md={12} lg={8} key={auto.id}>
                            <Card
                                hoverable
                                cover={<img alt={auto.nazwa} src={auto.image} />}
                                className="car-card"
                            >
                                <div className="car-card-header">
                                    <Title level={4}>{auto.nazwa}</Title>
                                    <Tag color={auto.dostepny ? "success" : "error"}>
                                        {auto.dostepny ? "Dostępny" : "Niedostępny"}
                                    </Tag>
                                </div>
                                <Paragraph className="car-category">{auto.kategoria}</Paragraph>
                                <Rate disabled defaultValue={Math.floor(auto.ocena)} allowHalf={false} />
                                <Paragraph className="car-description">{auto.opis}</Paragraph>
                                <Divider />
                                <div className="car-card-footer">
                                    <div className="car-price">
                                        <span className="price">{auto.cena} zł</span>
                                        <span className="price-period">/dzień</span>
                                    </div>
                                    <Button type="primary" disabled={!auto.dostepny}>
                                        {auto.dostepny ? "Zarezerwuj" : "Niedostępny"}
                                    </Button>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {filteredCars.length === 0 && (
                    <div className="no-cars">
                        <Title level={4} style={{ textAlign: 'center' }}>
                            Brak dostępnych samochodów w wybranej kategorii
                        </Title>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Cars;