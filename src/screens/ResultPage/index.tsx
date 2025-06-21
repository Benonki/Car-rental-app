import { FC, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Result, Button } from "antd";
import { SmileOutlined, FrownOutlined } from "@ant-design/icons";
import { updateRentalStatus } from "../../api/rental";

interface ResultPageState {
    success: boolean;
    message: string;
    rentalStatus: 'Nadchodzące' | 'Zakończone' | 'Anulowane';
}

const ResultPage: FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as ResultPageState;

    const isSuccess = state?.success ?? false;
    const message = state?.message ?? (isSuccess ? 'Operacja zakończona sukcesem!' : 'Operacja nie powiodła się');
    const rentalStatus = state?.rentalStatus ?? '';

    useEffect(() => {
        const handlePaymentStatus = async () => {
            const pendingRental = localStorage.getItem('pendingRental');
            if (!pendingRental) return;

            const { rentalId } = JSON.parse(pendingRental);
            try {
                if (!isSuccess) {
                    await updateRentalStatus(rentalId, 'Anulowane');
                }
            } catch (error) {
                console.error('Error updating statuses:', error);
            } finally {
                localStorage.removeItem('pendingRental');
            }
        };

        handlePaymentStatus();
    }, [isSuccess]);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            flexDirection: 'column'
        }}>
            <Result
                icon={isSuccess ? <SmileOutlined /> : <FrownOutlined />}
                title={
                    <>
                        {message.split('\n').map((line, index) => (
                            <span key={index}>
                                {line}
                                <br />
                            </span>
                        ))}
                    </>
                }
                subTitle={`Status wypożyczenia: ${rentalStatus}`}
                extra={[
                    <Button
                        type="primary"
                        key="home"
                        onClick={() => navigate('/')}
                    >
                        Powrót do strony głównej
                    </Button>,
                ]}
            />
        </div>
    );
};

export default ResultPage;