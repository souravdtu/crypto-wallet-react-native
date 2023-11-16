import axios from "axios";

export const GET_HOLDINGS_BEGIN = "GET_HOLDINGS_BEGIN";
export const GET_HOLDINGS_SUCESS = "GET_HOLDINGS_SUCESS";
export const GET_HOLDINGS_FAILURE = "GET_HOLDINGS_FAILURE";
export const GET_COIN_MARKET_BEGIN = "GET_COIN_MARKET_BEGIN";
export const GET_COIN_MARKET_SUCCESS = "GET_COIN_MARKET_SUCCESS";
export const GET_COIN_MARKET_FAILURE = "GET_COIN_MARKET_FAILURE";

//Holding / My Holdings

export const getHoldingsBegin = () => ({
  type: GET_HOLDINGS_BEGIN,
});

export const getHoldingsSuccess = (myHoldings) => ({
  type: GET_HOLDINGS_SUCESS,
  payload: { myHoldings },
});

export const getHoldingsFailure = (error) => ({
  type: GET_HOLDINGS_SUCESS,
  payload: { error },
});

export function getHoldings(
  holdings = [],
  currency = "inr",
  orderBy = "market_cap_desc",
  sparkline = true,
  priceChangePerc = "7d",
  perPage = 10,
  page = 1
) {
  return (dispatch) => {
    dispatch(getHoldingsBegin());
    let ids = holdings
      .map((item) => {
        return item.id;
      })
      .join(",");
    let apiUrl = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=${orderBy}&per_page=${perPage}&page=${page}&sparkline=${sparkline}&price_change_percentage=${priceChangePerc}&ids=${ids}`;

    return axios({
      url: apiUrl,
      method: "GET",
      header: {
        Accept: "application/json",
      },
    })
      .then((res) => {
        if ((res.status = 200)) {
          let myHoldings = res.data.map((item) => {
            let coin = holdings.find((a) => a.id == item.id);
            let price7d =
              item.current_price /
              (1 + item.price_change_percentage_7d_in_currency * 0.01);
            const {
              id,
              symbol,
              name,
              image,
              current_price,
              price_change_percentage_7d_in_currency,
            } = item;
            const { qty } = coin;
            return {
              id,
              symbol,
              name,
              image,
              current_price,
              qty,
              total: qty * current_price,
              price_change_percentage_7d_in_currency,
              holding_value_change_7d: (current_price - price7d) * qty,
              sparkline_in_7d: {
                value: item?.sparkline_in_7d.price.map((price) => {
                  return price * qty;
                }),
              },
            };
          });

          dispatch(getHoldingsSuccess(myHoldings));
        } else {
          dispatch(getHoldingsFailure(res.data));
        }
      })
      .catch((err) => {
        dispatch(getHoldingsFailure(err));
      });
  };
}

export const getCoinMarketBegin = () => ({
  type: GET_COIN_MARKET_BEGIN,
});

export const getCoinMarketSuccess = (coins) => ({
  type: GET_COIN_MARKET_SUCCESS,
  payload: { coins },
});

export const getCoinMarketFailure = (err) => ({
  type: GET_COIN_MARKET_FAILURE,
  payload: { err },
});

export function getCoinMarket(
  currency = "inr",
  orderBy = "market_cap_desc",
  sparkline = true,
  priceChangePerc = "7d",
  perPage = "10",
  page = 1
) {
  return (dispatch) => {
    dispatch(getCoinMarketBegin());
    let apiUrl = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=${orderBy}&per_page=${perPage}&page=${page}&sparkline=${sparkline}&price_change_percentage=${priceChangePerc}`;

    return axios({
      url: apiUrl,
      method: "GET",
      header: {
        Accept: "application/json",
      },
    })
      .then((res) => {
        if ((res.status = 200)) {
          dispatch(getCoinMarketSuccess(res.data));
        } else {
          dispatch(getCoinMarketFailure(res.data));
        }
      })
      .catch((err) => {
        dispatch(getCoinMarketFailure(err));
      });
  };
}
