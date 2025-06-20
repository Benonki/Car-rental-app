import { FC } from "react";
import { Modal, List, Rate } from "antd";
import type { Opinion } from "../src/types";

interface CarOpinionModalProps {
  visible: boolean;
  carName: string;
  opinions: Opinion[];
  onClose: () => void;
}

const CarOpinionModal: FC<CarOpinionModalProps> = ({
  visible,
  carName,
  opinions,
  onClose,
}) => {
  return (
    <Modal
      title={`Opinie o samochodzie: ${carName}`}
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      {opinions.length === 0 ? (
        <p>Brak opinii dla tego samochodu.</p>
      ) : (
        <List
          itemLayout="vertical"
          dataSource={opinions}
          renderItem={(item) => (
            <List.Item>
              <Rate disabled defaultValue={item.rating} />
              <p>{item.description}</p>
              <p style={{ fontSize: 12, color: "#999" }}>
                {item.customer.personalData.first_name}{" "}
                {item.customer.personalData.last_name}, {item.date_of_publishing}
              </p>
            </List.Item>
          )}
        />
      )}
    </Modal>
  );
};

export default CarOpinionModal;