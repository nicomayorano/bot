// Imports
import { MessageEmbed } from 'discord.js';
// eslint-disable-next-line import/extensions
import { fetchParsedDataFromAPI, buildUrl, buildHeader } from '../src/functions.js';

// Constants
const API_COINGECKO_SEARCH = 'https://api.coingecko.com/api/v3/search';
const API_COINGECKO_COINS = 'https://api.coingecko.com/api/v3/coins/';

export default async function precio(args) {
  args.shift();
  let coinData;
  {
    const rawData = await fetchParsedDataFromAPI(
      buildUrl(API_COINGECKO_SEARCH, { query: args.join(' ') }),
      'GET',
      buildHeader({ accept: 'application/json' }),
    );
    // eslint-disable-next-line prefer-destructuring
    coinData = rawData.coins[0];
  }
  if (coinData.id === undefined) {
    const embed = new MessageEmbed().setTitle('Coin no encontrada');
    return embed;
  }
  const marketData = await fetchParsedDataFromAPI(
    buildUrl(API_COINGECKO_COINS + coinData.id, {}),
    'GET',
    buildHeader({ accept: 'application/json' }),
  );
  const embed = new MessageEmbed()
    .setTitle(`US$ ${marketData.market_data.current_price.usd}`)
    .addFields(
      { name: '24h', value: `${marketData.market_data.price_change_24h > 0 ? '+' : ''}${marketData.market_data.price_change_percentage_24h}%` },
      { name: '7d', value: `${marketData.market_data.price_change_percentage_7d > 0 ? '+' : ''}${marketData.market_data.price_change_percentage_7d}%` },
      { name: 'ATH', value: `US$ ${marketData.market_data.ath.usd}`, inline: true },
      { name: 'ATL', value: `US$ ${marketData.market_data.atl.usd}`, inline: true },
    )
    .setImage(marketData.image.large)
    .setFooter('Powered by CoinGecko');
  return embed;
}
