import { FC } from "react";
import './index.css';

const FAQ: FC = () => {
  return (
    <div>
      <h1>FAQ - Często zadawane pytania</h1>
      <ol>
        <li>
            Jak mogę zarezerwować samochód?
            <p>Możesz dokonać rezerwacji online poprzez naszą stronę internetową – wystarczy wybrać auto, określić daty wypożyczenia oraz miejsce odbioru i zwrotu, a następnie wypełnić formularz.</p>
        </li>
        <li>
            Czy muszę zakładać konto, aby wypożyczyć samochód?
            <p>Tak, rejestracja konta jest wymagana, abyśmy mogli zarządzać Twoją rezerwacją i zapewnić bezpieczeństwo transakcji.</p>
        </li>
        <li>
            Jakie dokumenty są potrzebne przy odbiorze auta?
            <p>Potrzebujesz: ważnego prawa jazdy (minimum 12 miesięcy doświadczenia), dokumentu tożsamości (dowód osobisty lub paszport), karty kredytowej (lub innej akceptowanej formy płatności).</p>
        </li>
        <li>
            Czy mogę anulować rezerwację?
            <p>Tak, rezerwację można anulować bez opłat do 24 godzin przed planowanym odbiorem auta. Po tym czasie mogą zostać naliczone koszty anulacji.</p>
        </li>
        <li>
            Czy mogę wyjechać samochodem za granicę?
            <p>Tak, ale tylko po wcześniejszym zgłoszeniu i uzyskaniu zgody naszej obsługi. Wymagane może być dodatkowe ubezpieczenie.</p>
        </li>
        <li>
            Co się stanie, jeśli spóźnię się ze zwrotem auta?
            <p>Za każdą rozpoczętą godzinę opóźnienia naliczana jest opłata zgodnie z cennikiem. W przypadku znacznego opóźnienia mogą obowiązywać opłaty dobowe.</p>
        </li>
        <li>
            Czy oferujecie foteliki dla dzieci lub dodatkowe wyposażenie?
            <p>Tak, możesz dodać do rezerwacji fotelik dziecięcy, nawigację GPS czy łańcuchy na koła. Wszystkie opcje są widoczne podczas procesu rezerwacji.</p>
        </li>
        <li>
            Co zrobić w razie awarii lub wypadku?
            <p>Skontaktuj się z nami pod całodobowym numerem alarmowym widocznym w umowie najmu. Jeśli to konieczne, wezwij policję i sporządź protokół zdarzenia.</p>
        </li>
        <li>
            Jakie ubezpieczenie jest w cenie?
            <p>Standardowa cena zawiera ubezpieczenie OC i podstawowe AC. Możesz dokupić rozszerzoną ochronę (np. zniesienie udziału własnego) podczas rezerwacji.</p>
        </li>
        <li>
            Czy mogę wskazać dodatkowego kierowcę?
            <p>Tak, przy rezerwacji możesz dodać dodatkowego kierowcę. Musi on również okazać dokumenty przy odbiorze auta.</p>
        </li>
        </ol>
    </div>
  );
};

export default FAQ;