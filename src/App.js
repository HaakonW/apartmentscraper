import React, { useState, useEffect } from 'react';
import cheerio from 'cheerio';
import got from 'got';
import Cookies from 'js-cookie';
import moment from 'moment';
import {
  fetchFinnCode,
  fetchTitle,
  fetchPictureUrl,
  fetchTotalSquareMeter,
  fetchTodaysViewing,
  fetchAdress
} from './ScraperUtils';
const url =
  'https://www.finn.no/realestate/homes/search.html?area_from=30&ownership_type=3&price_collective_to=3500000&stored-id=32895144&sort=1&location=0.20061';
function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await got(url);
      const $ = cheerio.load(response.body);
      const data = [];

      $('.ads__unit').map(async (i, e) => {
        const title = fetchTitle($, e);
        const finnKode = fetchFinnCode($, e);
        const pictureUrl = fetchPictureUrl($, e);
        const finnId = finnKode && finnKode.slice(finnKode.indexOf('=') + 1);
        const warning = fetchTodaysViewing($, e);
        const squareMeter = fetchTotalSquareMeter($, e);
        const address = fetchAdress($, e);

        const totalPrice = $(e)
          .find('.u-float-left')
          .children()
          .eq(1)
          .text();

        const totalPriceParsed = parseInt(
          totalPrice
            .slice(totalPrice.indexOf(' '), totalPrice.indexOf('kr'))
            .replace(/\s/g, '')
        );

        const squareMeterParsed =
          parseInt(squareMeter.slice(0, squareMeter.indexOf(' '))) || 0;

        const squareMeterPrice = parseInt(totalPriceParsed / squareMeterParsed);

        if (totalPrice.includes('Totalpris')) {
          if (!Cookies.get(finnId)) {
            Cookies.set(finnId, moment().format('DD/MM/YYYY'));
          }
          const obj = {
            title,
            totalPrice,
            squareMeterPrice,
            squareMeterParsed,
            address,
            finnId,
            pictureUrl,
            cardClass:
              (warning === 'Solgt' && 'sold') ||
              (warning.includes('Visning') && 'today'),
            firstSeen: Cookies.get(finnId)
          };
          data.push(obj);
        }
      });

      // setData(data.sort((a, b) => a.title.localeCompare(b.title)));
      setData(data.sort((a, b) => a.finnKode < b.finnKode));
    };

    fetchData();
  }, []);

  return (
    <main>
      {data.map(
        ({
          finnId,
          title,
          address,
          firstSeen,
          cardClass,
          pictureUrl,
          totalPrice,
          squareMeterPrice,
          squareMeterParsed
        }) => (
          <section key={finnId} className={cardClass}>
            <img src={pictureUrl} alt="" />
            <aside>
              <h2>
                <a
                  href={`https://www.finn.no/realestate/homes/ad.html?finnkode=${finnId}`}
                >
                  {title.slice(0, title.indexOf('-'))}
                </a>
              </h2>
              <ul>
                <li>{address}</li>
                <li>{totalPrice}</li>
                <li>
                  Kvm: {squareMeterParsed} Pris per kvm: {squareMeterPrice}
                </li>
                <li>Første gang sett: {firstSeen}</li>
              </ul>
            </aside>
          </section>
        )
      )}
    </main>
  );
}

export default App;
