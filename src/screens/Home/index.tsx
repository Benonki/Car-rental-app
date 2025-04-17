import { FC, useState } from "react";
import { Button, Card, DatePicker, Input, Typography, Row, Col, Carousel, Divider, Tag, Rate } from "antd";
import { SearchOutlined, CarOutlined, CalendarOutlined, EnvironmentOutlined, CheckCircleOutlined } from "@ant-design/icons";
import './index.css';

const { Title, Paragraph } = Typography;
const { RangePicker } = DatePicker;

const Home: FC = () => {
    const [lokalizacja, setLokalizacja] = useState("");

    const popularneAuta = [
        {
            id: 1,
            nazwa: "BMW X5",
            kategoria: "SUV",
            cena: 350,
            image: "data:image/jpeg;base64,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",
            ocena: 4.8,
            dostepny: true
        },
        {
            id: 2,
            nazwa: "Mercedes C-Class",
            kategoria: "Sedan",
            cena: 280,
            image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxETEBUQExMWFRUXFhYVGBUYFxYVGBgZFhUXFxYVFxkYHSggHR8lGxUVIjEhJSotLi4uFx8zODMtNygtLisBCgoKDg0OFxAQFS0aHR0tLS0rLS0tLSstKystKy0rLS0tLS0rLS0tKy0tLS0tKzg4LSstKystKy0tLy0tLS4rLv/AABEIAKgBKwMBIgACEQEDEQH/xAAcAAEAAQUBAQAAAAAAAAAAAAAABgIDBAUHAQj/xABFEAACAQIDBAcEBggFAwUAAAABAgADEQQSIQUGMUEHEyJRYXGRMoGhsSNCUmKSwRRDcoKistHwFzNTwuEk0vEVFkRjg//EABYBAQEBAAAAAAAAAAAAAAAAAAABAv/EABwRAQEBAAIDAQAAAAAAAAAAAAABEQJBEiExE//aAAwDAQACEQMRAD8A7jERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBETy8D2IiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiW69dUXMxAHeYFyYW0trUaClqjhbC51+fd75Et7t+VoU7rcXuFH13I42+yBcXPLz0nJ8bisTjXBdtC6Kq3simowUE342uSSdbA90uI6RtbpXpKSMPTNT7x0X1a3wvNA/SRtGofo6a+QDP8AyKJp6G0MBhahQYY4pkJU1KjhVOU2JRMrC2mhMn2yN58JUoCr1iURqCjuiFSDbhfhwIPjNYzeVnSG4zfvadMBqqZQTYXSslz3AsZ5Q6R8Ta7IbeFQj4EfnNd0nbcSviKdOk6vTppfMrBlLvq1iNDYBB6zSYPGPQqLUp2zLoCVVgNONmBF4WX06Jgeka+jPkPLrEUp+JLH3kgTfDfdEF66imOVQXem3hoLqediLHkTOS08V1xPWAFjrmAsT3k+N9Zl4HFmgRSq9qhUB0OuUXILAd1wbj3jXixddLHSLgz7LO/7NCu3+ye/4g0eVDEHyoMP5rSObJqUadVKdZUZDTKqzAOD1QLqdQQGyZw3I5KZHEgQ3aO8laq5KhadO/ZprTpgAcr9ntG3En4c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",
            ocena: 4.6,
            dostepny: true
        },
        {
            id: 3,
            nazwa: "Audi A4",
            kategoria: "Sedan",
            cena: 260,
            image: "data:image/jpeg;base64,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",
            ocena: 4.7,
            dostepny: false
        },
    ];

    const zalety = [
        {
            ikona: <CarOutlined />,
            tytul: "Szeroki wybór pojazdów",
            opis: "Od ekonomicznych po luksusowe - znajdziesz auto idealnie dopasowane do Twoich potrzeb."
        },
        {
            ikona: <CalendarOutlined />,
            tytul: "Elastyczne terminy",
            opis: "Wypożycz na dzień, tydzień lub miesiąc - Ty decydujesz jak długo potrzebujesz samochodu."
        },
        {
            ikona: <EnvironmentOutlined />,
            tytul: "Wiele lokalizacji",
            opis: "Odbierz i zwróć auto w jednym z naszych punktów rozmieszczonych w całym kraju."
        },
        {
            ikona: <CheckCircleOutlined />,
            tytul: "Pełne ubezpieczenie",
            opis: "Wszystkie nasze samochody posiadają pełne ubezpieczenie dla Twojego spokoju."
        }
    ];

    const opinie = [
        {
            autor: "Jan Kowalski",
            tresc: "Świetna obsługa i bardzo dobry stan samochodów. Polecam każdemu kto szuka niezawodnego auta!",
            ocena: 5
        },
        {
            autor: "Anna Nowak",
            tresc: "Sprawna rezerwacja online i bezproblemowy odbiór samochodu. Na pewno skorzystam ponownie.",
            ocena: 4.5
        },
        {
            autor: "Piotr Wiśniewski",
            tresc: "Konkurencyjne ceny i profesjonalna obsługa. Samochód był czysty i w idealnym stanie technicznym.",
            ocena: 5
        }
    ];

    return (
        <div className="home-container">
            <section className="hero-section">
                <div className="hero-content">
                    <Title level={1}>Wypożycz Swój Wymarzony Samochód</Title>
                    <Paragraph className="hero-subtitle">
                        Szeroki wybór pojazdów, konkurencyjne ceny i profesjonalna obsługa
                    </Paragraph>

                    <Card className="search-card">
                        <Title level={4}>Znajdź dostępne samochody</Title>
                        <Row gutter={[16, 16]}>
                            <Col xs={24} md={8}>
                                <Input
                                    size="large"
                                    placeholder="Lokalizacja odbioru"
                                    prefix={<EnvironmentOutlined />}
                                    value={lokalizacja}
                                    onChange={(e) => setLokalizacja(e.target.value)}
                                />
                            </Col>
                            <Col xs={24} md={12}>
                                <RangePicker
                                    size="large"
                                    placeholder={['Data odbioru', 'Data zwrotu']}
                                    className="date-picker-full"
                                />
                            </Col>
                            <Col xs={24} md={4}>
                                <Button type="primary" icon={<SearchOutlined />} size="large" block>
                                    Szukaj
                                </Button>
                            </Col>
                        </Row>
                    </Card>
                </div>
            </section>



            <section className="section">
                <Title level={2} className="section-title">Popularne Samochody</Title>
                <Row gutter={[24, 24]}>
                    {popularneAuta.map(auto => (
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
                                <Rate disabled defaultValue={auto.ocena} />
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
                <div className="view-more">
                    <Button type="link" size="large">Zobacz wszystkie samochody</Button>
                </div>
            </section>



            <section className="section why-us-section">
                <Title level={2} className="section-title">Dlaczego warto wybrać naszą wypożyczalnię?</Title>
                <Row gutter={[24, 24]}>
                    {zalety.map((zaleta, index) => (
                        <Col xs={24} md={12} lg={6} key={index}>
                            <Card className="feature-card">
                                <div className="feature-icon">{zaleta.ikona}</div>
                                <Title level={4}>{zaleta.tytul}</Title>
                                <Paragraph>{zaleta.opis}</Paragraph>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </section>



            <section className="section">
                <Title level={2} className="section-title">Jak wypożyczyć samochód?</Title>
                <Row gutter={[24, 24]} className="how-it-works">
                    <Col xs={24} md={8}>
                        <div className="step-card">
                            <div className="step-number">1</div>
                            <Title level={4}>Wybierz samochód</Title>
                            <Paragraph>Przeglądaj naszą flotę i wybierz pojazd, który najlepiej odpowiada Twoim potrzebom.</Paragraph>
                        </div>
                    </Col>
                    <Col xs={24} md={8}>
                        <div className="step-card">
                            <div className="step-number">2</div>
                            <Title level={4}>Zarezerwuj online</Title>
                            <Paragraph>Wypełnij formularz rezerwacji, wybierz datę odbioru i zwrotu oraz dodatkowe opcje.</Paragraph>
                        </div>
                    </Col>
                    <Col xs={24} md={8}>
                        <div className="step-card">
                            <div className="step-number">3</div>
                            <Title level={4}>Odbierz samochód</Title>
                            <Paragraph>Przyjedź do naszego punktu, podpisz umowę i ciesz się jazdą wymarzonym autem.</Paragraph>
                        </div>
                    </Col>
                </Row>
            </section>


            <section className="section testimonials-section">
                <Title level={2} className="section-title">Co mówią nasi klienci</Title>
                <Carousel autoplay>
                    {opinie.map((opinia, index) => (
                        <div key={index}>
                            <Card className="testimonial-card">
                                <Rate disabled defaultValue={opinia.ocena} />
                                <Paragraph className="testimonial-text">"{opinia.tresc}"</Paragraph>
                                <div className="testimonial-author">- {opinia.autor}</div>
                            </Card>
                        </div>
                    ))}
                </Carousel>
            </section>


            <section className="section cta-section">
                <Title level={2}>Gotowy do drogi?</Title>
                <Paragraph className="cta-text">Zarezerwuj samochód już teraz i wyrusz w podróż swoim wymarzonym autem!</Paragraph>
                <Button type="primary" size="large">Zarezerwuj teraz</Button>
            </section>
        </div>
    );
};

export default Home;