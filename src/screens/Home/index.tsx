import { FC, useState, useEffect } from "react";
import { Button,Card, Typography,Row,Col,Carousel,Divider,Tag,Rate,Spin } from "antd";
import { CarOutlined,CalendarOutlined,EnvironmentOutlined,CheckCircleOutlined } from "@ant-design/icons";
import "./index.css";
import type { Opinion, Car } from "../../types.ts";
import { getAllOpinions, getOpinionsByCarId } from "../../api/opinions.ts";
import { getCars } from "../../api/cars.ts";
import CarOpinionModal from "../../components/CarOpinionModal.tsx";
import {useNavigate} from "react-router-dom";

const { Title, Paragraph } = Typography;

type CarWithOpinionCount = Car & { opinionCount: number };

const Home: FC = () => {
  const navigate = useNavigate();
  const [opinie, setOpinie] = useState<Opinion[]>([]);
  const [popularneAuta, setPopularneAuta] = useState<CarWithOpinionCount[]>([]);
  const [loading, setLoading] = useState(true);

  const [opinionModalVisible, setOpinionModalVisible] = useState(false);
  const [selectedCarOpinions, setSelectedCarOpinions] = useState<Opinion[]>([]);
  const [selectedCarName, setSelectedCarName] = useState('');

  useEffect(() => {
    const loadOpinie = async () => {
      try {
        const data = await getAllOpinions();
        const filtered = data.filter((op) => op.rating >= 4);
        setOpinie(filtered);
      } catch (err) {
        console.error("Błąd przy ładowaniu opinii:", err);
      }
    };
    loadOpinie();
  }, []);

  useEffect(() => {
    const fetchPopularCars = async () => {
      try {
        const allCars = await getCars();

        const carsWithCounts = await Promise.all(
          allCars.map(async (car) => {
            const opinions = await getOpinionsByCarId(car.id);
            return { ...car, opinionCount: opinions.length };
          })
        );

        const top3 = carsWithCounts
          .sort((a, b) => b.opinionCount - a.opinionCount)
          .slice(0, 3);

        setPopularneAuta(top3);
      } catch (error) {
        console.error("Błąd przy ładowaniu popularnych aut:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularCars();
  }, []);

  const handleShowOpinions = async (carId: string, carName: string) => {
    try {
        const opinions = await getOpinionsByCarId(carId);
        setSelectedCarOpinions(opinions);
        setSelectedCarName(carName);
        setOpinionModalVisible(true);
    } catch (error) {
        console.error('Błąd podczas pobierania opinii:', error);
    }
    };

  const zalety = [
    {
      ikona: <CarOutlined />,
      tytul: "Szeroki wybór pojazdów",
      opis:
        "Od ekonomicznych po luksusowe - znajdziesz auto idealnie dopasowane do Twoich potrzeb.",
    },
    {
      ikona: <CalendarOutlined />,
      tytul: "Elastyczne terminy",
      opis:
        "Wypożycz na dzień, tydzień lub miesiąc - Ty decydujesz jak długo potrzebujesz samochodu.",
    },
    {
      ikona: <EnvironmentOutlined />,
      tytul: "Wiele lokalizacji",
      opis:
        "Odbierz i zwróć auto w jednym z naszych punktów rozmieszczonych w całym kraju.",
    },
    {
      ikona: <CheckCircleOutlined />,
      tytul: "Pełne ubezpieczenie",
      opis: "Wszystkie nasze samochody posiadają pełne ubezpieczenie dla Twojego spokoju.",
    },
  ];

  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <Title level={1}>Wypożycz Swój Wymarzony Samochód</Title>
          <Paragraph className="hero-subtitle">
            Szeroki wybór pojazdów, konkurencyjne ceny i profesjonalna obsługa
          </Paragraph>
        </div>
      </section>

      <section className="section">
        <Title level={2} className="section-title">Popularne Samochody</Title>
        {loading ? (
          <Spin tip="Ładowanie..." />
        ) : (
          <Row gutter={[24, 24]}>
            {popularneAuta.map((auto) => (
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
                  <Button
                        type="link"
                        onClick={() => handleShowOpinions(auto.id, auto.nazwa)}
                        >
                        Zobacz opinie
                    </Button>
                  <Divider />
                  <div className="car-card-footer">
                    <div className="car-price">
                      <span className="price">{auto.cena} zł</span>
                      <span className="price-period">/dzień</span>
                    </div>
                    <Button
                        type="primary"
                        disabled={!auto.dostepny}
                        onClick={() => navigate(`/renting/${auto.id}`)}
                    >
                      {auto.dostepny ? "Zarezerwuj" : "Niedostępny"}
                    </Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}
        <div className="view-more">
          <Button type="link" size="large" onClick={() => window.location.href = '/cars'}>
            Zobacz wszystkie samochody
          </Button>
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

      <section className="section testimonials-section">
        <Title level={2} className="section-title">Co mówią nasi klienci</Title>
        <Carousel autoplay>
          {opinie.map((opinia, i) => (
            <div key={i}>
              <Card className="testimonial-card">
                <Rate disabled defaultValue={opinia.rating} />
                <Paragraph className="testimonial-text">"{opinia.description}"</Paragraph>
                <div className="testimonial-author">
                  - {opinia.customer.personalData.first_name}
                </div>
              </Card>
            </div>
          ))}
        </Carousel>
      </section>

      <section className="section cta-section">
        <Title level={2}>Gotowy do drogi?</Title>
        <Paragraph className="cta-text">
          Zarezerwuj samochód już teraz i wyrusz w podróż swoim wymarzonym autem!
        </Paragraph>
        <Button type="primary" size="large" onClick={() => window.location.href = '/cars'}>
          Zarezerwuj teraz
        </Button>
      </section>
      <CarOpinionModal
        visible={opinionModalVisible}
        carName={selectedCarName}
        opinions={selectedCarOpinions}
        onClose={() => setOpinionModalVisible(false)}
      />
    </div>
  );
};

export default Home;