const { getExports } = require('../helper/heroku-api')
const index = require('../index')

module.exports = {
  timetravel: false,
  isHeavyProtocol: true,
}
const { solana: { tvl } } = getExports("pattiepumpswap", ['solana'])

module.exports.solana = {
  tvl: tvlWithCheck,
}

module.exports.solana = index.solana

async function tvlWithCheck(api) {
  const balances = await tvl(api)
  api.addBalances(balances)
  const usdValue = await api.getUSDValue()
  // for some godforsaken reason, the TVL is sometimes reported as 60M, we fail in that case rather than report a wrong number
  if (usdValue < 2e8) throw new Error('TVL is too low :' + usdValue / 1e6 + 'M')
  return api.getBalances()
}