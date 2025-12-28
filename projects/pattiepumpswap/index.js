
const { get } = require("../helper/http");

module.exports = {
  timetravel: false,
  isHeavyProtocol: true,
  misrepresentedTokens: true,

  solana: {
    tvl: tvlApi,
  },
};

async function tvlApi(api) {
  let hasMore = true
  let page = 1
  const pageSize = 1000
  do {
    const { data: { data } } = await get(`https://api-swap.pattiepump.fun/api/pools/info/list?poolType=all&poolSortField=liquidity&sortType=desc&pageSize=${pageSize}&page=${page}`)
    const lastItem = data[data.length - 1]
    hasMore = data.length === pageSize && lastItem.tvl > 1000
    api.log('lastItem', lastItem.tvl, page)
    data.forEach(({ mintA, mintB, mintAmountA, mintAmountB, tvl, }) => {
      if (tvl < 20_000) {
        api.addUSDValue(tvl)
        return;
      }
      api.add(mintA.address, mintAmountA * (10 ** mintA.decimals))
      api.add(mintB.address, mintAmountB * (10 ** mintB.decimals))
    })
    page++
  } while (hasMore)

  return api.getBalances()
}