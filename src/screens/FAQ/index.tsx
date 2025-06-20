import { FC } from "react";
import './index.css';

const FAQ: FC = () => {
    return (
        <div className="faq-container">
            <h1 className="faq-title">FAQ - Często zadawane pytania</h1>
            <ol className="faq-list">
                <li className="faq-item">
                    <span className="faq-question">Jak mogę zarezerwować samochód?</span>
                    <p className="faq-answer">Możesz dokonać rezerwacji online poprzez naszą stronę internetową – wystarczy wybrać auto, określić daty wypożyczenia oraz miejsce odbioru i zwrotu, a następnie wypełnić formularz.</p>
                </li>
                <li className="faq-item">
                    <span className="faq-question">Czy muszę zakładać konto, aby wypożyczyć samochód?</span>
                    <p className="faq-answer">Tak, rejestracja konta jest wymagana, abyśmy mogli zarządzać Twoją rezerwacją i zapewnić bezpieczeństwo transakcji.</p>
                </li>
                <li className="faq-item">
                    <span className="faq-question">Jakie dokumenty są potrzebne przy odbiorze auta?</span>
                    <p className="faq-answer">Potrzebujesz: ważnego prawa jazdy (minimum 12 miesięcy doświadczenia), dokumentu tożsamości (dowód osobisty lub paszport), karty kredytowej (lub innej akceptowanej formy płatności).</p>
                </li>
                <li className="faq-item">
                    <span className="faq-question">Czy mogę anulować rezerwację?</span>
                    <p className="faq-answer">Tak, rezerwację można anulować bez opłat do 24 godzin przed planowanym odbiorem auta. Po tym czasie mogą zostać naliczone koszty anulacji.</p>
                </li>
                <li className="faq-item">
                    <span className="faq-question">Czy mogę wyjechać samochodem za granicę?</span>
                    <p className="faq-answer">Tak, ale tylko po wcześniejszym zgłoszeniu i uzyskaniu zgody naszej obsługi. Wymagane może być dodatkowe ubezpieczenie.</p>
                </li>
                <li className="faq-item">
                    <span className="faq-question">Co się stanie, jeśli spóźnię się ze zwrotem auta?</span>
                    <p className="faq-answer">Za każdą rozpoczętą godzinę opóźnienia naliczana jest opłata zgodnie z cennikiem. W przypadku znacznego opóźnienia mogą obowiązywać opłaty dobowe.</p>
                </li>
                <li className="faq-item">
                    <span className="faq-question">Czy oferujecie foteliki dla dzieci lub dodatkowe wyposażenie?</span>
                    <p className="faq-answer">Tak, możesz dodać do rezerwacji fotelik dziecięcy, nawigację GPS czy łańcuchy na koła. Wszystkie opcje są widoczne podczas procesu rezerwacji.</p>
                </li>
                <li className="faq-item">
                    <span className="faq-question">Co zrobić w razie awarii lub wypadku?</span>
                    <p className="faq-answer">Skontaktuj się z nami pod całodobowym numerem alarmowym widocznym w umowie najmu. Jeśli to konieczne, wezwij policję i sporządź protokół zdarzenia.</p>
                </li>
                <li className="faq-item">
                    <span className="faq-question">Jakie ubezpieczenie jest w cenie?</span>
                    <p className="faq-answer">Standardowa cena zawiera ubezpieczenie OC i podstawowe AC. Możesz dokupić rozszerzoną ochronę (np. zniesienie udziału własnego) podczas rezerwacji.</p>
                </li>
                <li className="faq-item">
                    <span className="faq-question">Czy mogę wskazać dodatkowego kierowcę?</span>
                    <p className="faq-answer">Tak, przy rezerwacji możesz dodać dodatkowego kierowcę. Musi on również okazać dokumenty przy odbiorze auta.</p>
                </li>
            </ol>
    </div>
  );
};

export default FAQ;