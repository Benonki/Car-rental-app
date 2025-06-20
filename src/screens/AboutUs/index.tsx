import React from 'react';
import { Typography, Row, Col, Card, Divider, Avatar, Space, Carousel, Statistic, Timeline } from 'antd';
import { CarOutlined, TeamOutlined, TrophyOutlined, EnvironmentOutlined, PhoneOutlined, MailOutlined, CheckCircleFilled, ClockCircleFilled, HistoryOutlined } from '@ant-design/icons';
import './index.css';

const { Title, Text, Paragraph } = Typography;

const AboutUs: React.FC = () => {
    return (
        <div className="about-container">
            <div className="hero-section">
                <Row gutter={[24, 24]} align="middle">
                    <Col xs={24} md={14}>
                        <Title level={1} style={{ color: '#fff' }}>O naszej wypożyczalni</Title>
                        <Paragraph className="hero-description" style={{ color: '#fff' }}>
                            Od 2010 roku dostarczamy najwyższej jakości samochody, dbając o komfort i bezpieczeństwo naszych klientów.
                            Nasza flota składa się z ponad 100 nowoczesnych pojazdów różnych klas, a doświadczony zespół dba o ich
                            nienaganny stan techniczny i czystość.
                        </Paragraph>
                        <div className="hero-stats">
                            <Row gutter={[48, 24]}>
                                <Col xs={8}>
                                    <Statistic
                                        title={<span style={{ color: '#fff' }}>Aut w ofercie</span>}
                                        value={12}
                                        prefix={<CarOutlined style={{ color: '#fff' }} />}
                                        valueStyle={{ color: '#fff' }}
                                        className="about-statistic"
                                    />
                                </Col>
                                <Col xs={8}>
                                    <Statistic
                                        title={<span style={{ color: '#fff' }}>Lokalizacji</span>}
                                        value={12}
                                        prefix={<EnvironmentOutlined style={{ color: '#fff' }} />}
                                        valueStyle={{ color: '#fff' }}
                                        className="about-statistic"
                                    />
                                </Col>
                                <Col xs={8}>
                                    <Statistic
                                        title={<span style={{ color: '#fff' }}>Zadowolonych klientów</span>}
                                        value={15000}
                                        prefix={<TeamOutlined style={{ color: '#fff' }} />}
                                        valueStyle={{ color: '#fff' }}
                                        className="about-statistic"
                                    />
                                </Col>
                            </Row>
                        </div>
                    </Col>
                    <Col xs={24} md={10}>
                        <div className="hero-carousel-wrapper">
                            <Carousel autoplay className="hero-carousel">
                                <div>
                                    <img src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Biuro firmy" className="carousel-image" />
                                </div>
                                <div>
                                    <img src="https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Flota samochodów" className="carousel-image" />
                                </div>
                                <div>
                                    <img src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Obsługa klienta" className="carousel-image" />
                                </div>
                            </Carousel>
                        </div>
                    </Col>
                </Row>
            </div>
            <Divider className="section-divider" />

            <div className="mission-section">
                <Title level={2} className="section-title">Nasza misja i wartości</Title>
                <Row gutter={[24, 24]}>
                    <Col xs={24} md={8}>
                        <Card className="mission-card">
                            <div className="card-icon-container">
                                <CarOutlined className="card-icon" />
                            </div>
                            <Title level={4}>Jakość</Title>
                            <Paragraph>
                                Oferujemy tylko sprawdzone i zadbane samochody najlepszych marek. Każdy pojazd jest regularnie serwisowany
                                i kompleksowo przygotowywany przed każdym najmem.
                            </Paragraph>
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card className="mission-card">
                            <div className="card-icon-container">
                                <TeamOutlined className="card-icon" />
                            </div>
                            <Title level={4}>Obsługa</Title>
                            <Paragraph>
                                Nasz zespół tworzą doświadczeni pracownicy, którzy doskonale znają potrzeby klientów i służą profesjonalnym
                                doradztwem przy wyborze odpowiedniego pojazdu.
                            </Paragraph>
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card className="mission-card">
                            <div className="card-icon-container">
                                <TrophyOutlined className="card-icon" />
                            </div>
                            <Title level={4}>Innowacje</Title>
                            <Paragraph>
                                Stale rozwijamy naszą ofertę i wprowadzamy najnowsze modele samochodów. Inwestujemy w rozwiązania technologiczne,
                                które ułatwiają wypożyczenie i zwrot samochodu.
                            </Paragraph>
                        </Card>
                    </Col>
                </Row>
            </div>

            <Divider className="section-divider" />

            <div className="team-section">
                <Title level={2} className="section-title">Nasz zespół</Title>
                <Paragraph className="section-intro">
                    Za sukcesem naszej wypożyczalni stoją ludzie. Poznaj zespół specjalistów, którzy każdego dnia dbają o najwyższą
                    jakość obsługi i zadowolenie klientów.
                </Paragraph>
                <Row gutter={[24, 24]}>
                    <Col xs={24} md={8}>
                        <Card className="team-card">
                            <Avatar size={120} src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80" className="team-avatar" />
                            <Title level={4}>Anna Kowalska</Title>
                            <Text type="secondary" className="team-position">Dyrektor Zarządzająca</Text>
                            <Paragraph className="team-bio">
                                Z branżą motoryzacyjną związana od 15 lat. Odpowiada za strategię rozwoju firmy i budowanie relacji
                                z kluczowymi partnerami.
                            </Paragraph>
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card className="team-card">
                            <Avatar size={120} src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80" className="team-avatar" />
                            <Title level={4}>Tomasz Nowak</Title>
                            <Text type="secondary" className="team-position">Kierownik Floty</Text>
                            <Paragraph className="team-bio">
                                Ekspert motoryzacyjny z pasją do samochodów. Dba o stan techniczny naszej floty i wprowadzanie nowych
                                modeli do oferty.
                            </Paragraph>
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card className="team-card">
                            <Avatar size={120} src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80" className="team-avatar" />
                            <Title level={4}>Marta Wiśniewska</Title>
                            <Text type="secondary" className="team-position">Kierownik Obsługi Klienta</Text>
                            <Paragraph className="team-bio">
                                Specjalistka w zakresie obsługi klienta z ponad 10-letnim doświadczeniem. Dba o najwyższe standardy
                                i satysfakcję naszych klientów.
                            </Paragraph>
                        </Card>
                    </Col>
                </Row>
            </div>

            <Divider className="section-divider" />

            <div className="history-section">
                <Title level={2} className="section-title">Historia naszej firmy</Title>
                <Row gutter={[24, 24]}>
                    <Col xs={24} md={17}>
                        <div className="history-timeline-container">
                            <Timeline
                                mode="left"
                                items={[
                                    {
                                        color: 'blue',
                                        label: '2010',
                                        children: (
                                            <div className="timeline-content">
                                                <Title level={5}>Rozpoczęcie działalności</Title>
                                                <Paragraph>
                                                    Otwarcie pierwszego punktu wypożyczalni w Warszawie z flotą 15 samochodów.
                                                </Paragraph>
                                            </div>
                                        ),
                                        dot: <HistoryOutlined />
                                    },
                                    {
                                        color: 'blue',
                                        label: '2013',
                                        children: (
                                            <div className="timeline-content">
                                                <Title level={5}>Poszerzenie oferty</Title>
                                                <Paragraph>
                                                    Rozszerzenie floty do 50 samochodów i otwarcie drugiego oddziału w Krakowie.
                                                </Paragraph>
                                            </div>
                                        ),
                                        dot: <ClockCircleFilled />
                                    },
                                    {
                                        color: 'blue',
                                        label: '2017',
                                        children: (
                                            <div className="timeline-content">
                                                <Title level={5}>Rozwój sieci</Title>
                                                <Paragraph>
                                                    Uruchomienie oddziałów w 5 największych miastach Polski i wprowadzenie systemu rezerwacji online.
                                                </Paragraph>
                                            </div>
                                        ),
                                        dot: <CheckCircleFilled />
                                    },
                                    {
                                        color: 'blue',
                                        label: '2020',
                                        children: (
                                            <div className="timeline-content">
                                                <Title level={5}>Modernizacja floty</Title>
                                                <Paragraph>
                                                    Wymiana całej floty na nowe modele i wprowadzenie samochodów elektrycznych do oferty.
                                                </Paragraph>
                                            </div>
                                        ),
                                        dot: <CarOutlined />
                                    },
                                    {
                                        color: 'blue',
                                        label: '2023',
                                        children: (
                                            <div className="timeline-content">
                                                <Title level={5}>Ekspansja i innowacje</Title>
                                                <Paragraph>
                                                    Otwarcie międzynarodowych oddziałów i wprowadzenie aplikacji mobilnej do zarządzania wynajmem.
                                                </Paragraph>
                                            </div>
                                        ),
                                        dot: <TrophyOutlined />
                                    },
                                ]}
                            />
                        </div>
                    </Col>
                </Row>
            </div>

            <Divider className="section-divider" />

            <div className="contact-section">
                <Title level={2} className="section-title">Skontaktuj się z nami</Title>
                <Row gutter={[24, 24]}>
                    <Col xs={24} md={12}>
                        <Card className="contact-card">
                            <Title level={4}>Biuro główne</Title>
                            <Space direction="vertical" size="middle" className="contact-info">
                                <div className="contact-item">
                                    <EnvironmentOutlined className="contact-icon" />
                                    <Text>ul. Przykładowa 15, 00-001 Warszawa</Text>
                                </div>
                                <div className="contact-item">
                                    <PhoneOutlined className="contact-icon" />
                                    <Text>+48 123 456 789</Text>
                                </div>
                                <div className="contact-item">
                                    <MailOutlined className="contact-icon" />
                                    <Text>kontakt@przykladowa-wypozyczalnia.pl</Text>
                                </div>
                            </Space>
                        </Card>
                    </Col>
                    <Col xs={24} md={12}>
                        <Card className="contact-card">
                            <Title level={4}>Godziny otwarcia</Title>
                            <div className="opening-hours">
                                <div className="hours-item">
                                    <Text strong>Poniedziałek - Piątek:</Text>
                                    <Text>08:00 - 20:00</Text>
                                </div>
                                <div className="hours-item">
                                    <Text strong>Sobota:</Text>
                                    <Text>09:00 - 16:00</Text>
                                </div>
                                <div className="hours-item">
                                    <Text strong>Niedziela:</Text>
                                    <Text>10:00 - 14:00</Text>
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default AboutUs;