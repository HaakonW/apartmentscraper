import cheerio from 'cheerio';
import got from 'got';
import Cookies from 'js-cookie';
import moment from 'moment';

export const fetchTitle = ($, e) =>
  $(e)
    .find('h2')
    .text();

export const fetchFinnCode = ($, e) => {
  const finnCode = $(e)
    .find('a[data-finnkode]')
    .attr('href');
  return finnCode && finnCode.slice(finnCode.indexOf('=') + 1);
};

export const fetchPictureUrl = ($, e) =>
  $(e)
    .find('.img-format__img')
    .attr('src');

export const fetchTodaysViewing = ($, e) =>
  $(e)
    .find('.status--warning')
    .text();

export const fetchTotalPrice = ($, e) => {
  const totalPrice = $(e)
    .find('.u-float-left')
    .children()
    .eq(1)
    .text();
  return parseInt(
    totalPrice
      .slice(totalPrice.indexOf(' '), totalPrice.indexOf('kr'))
      .replace(/\s/g, '')
  );
};

export const fetchTotalSquareMeter = ($, e) => {
  const squareMeter = $(e)
    .find('.ads__unit__content__keys')
    .children()
    .eq(0)
    .text();
  return squareMeter;
  // return parseInt(squareMeter.slice(0, squareMeter.indexOf(' '))) || 0;
};

// const squareMeterPrice = parseInt(totalPriceParsed / squareMeterParsed);

export const fetchAdress = ($, e) =>
  $(e)
    .find('.ads__unit__content__details')
    .children()
    .text();

// if (totalPrice.includes('Totalpris')) {
//   if (!Cookies.get(finnId)) {
//     Cookies.set(finnId, moment().format('DD/MM/YYYY'));
//   }
//   const obj = {
//     title,
//     totalPrice,
//     squareMeterPrice,
//     squareMeterParsed,
//     address,
//     finnId,
//     pictureUrl,
//     cardClass:
//       (warning === 'Solgt' && 'sold') ||
//       (warning.includes('Visning') && 'today'),
//     firstSeen: Cookies.get(finnId)
//   };
//   data.push(obj);
// }

// setData(data.sort((a, b) => a.finnKode < b.finnKode));
