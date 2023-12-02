mod futures_market;
use futures_market::create_market_order;

use serde::{Deserialize, Serialize, Clone, Debug};
use warp::{filters::BoxedFilter, Filter, Rejection, Reply};

const CONTENT_SIZE: u64 = 1024 * 1000;
fn json_body<T: serde::de::DeserializeOwned + Send>(
) -> impl Filter<Extract = (T,), Error = Rejection> + Clone {
    warp::body::content_length_limit(CONTENT_SIZE).and(warp::body::json())
}

pub fn routes() -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    get_post()
}
#[derive(Clone, Deserialize, Serialize, Debug)]
pub struct MarketOrder {
    pub econia_address: AccountAddress,
    pub base_coin: TypeTag,
    pub quote_coin: TypeTag,
    pub market_id: u64,
    pub trader: LocalAccount,
    pub node_url: &str,
    pub side: Side,
    pub sell_base_lots: u64,
}

pub fn place_market_order() -> BoxedFilter<(impl Reply,)> {
    warp::path!("place_market_order")
        .and(warp::path::end())
        .and(warp::post())
        .and(json_body::<MarketOrder>())
        .and(warp::headers::headers_cloned())
        .and_then(place_market_order_handler)
        .boxed()
}

pub async fn place_market_order_handler(
    request: MarketOrder,
    headers: HeaderMap,
)-> Result<impl warp::Reply, warp::Rejection>{
    let res = create_market_order(request.econia_address, request.base_coin, request.quote_coin, request.market_id, request.trader, request.node_url, request.side, request.sell_base_lots).await;

    let response = match res {
        Ok(result) => warp::reply::with_status(
            warp::reply::with_header(
                warp::reply::json(&result),
                "Access-Control-Allow-Origin",
                "DENY",
            ),
            warp::reply::json(&result),
            warp::http::StatusCode::OK,
        ),
        Err(e) => warp::reply::with_status(
            warp::reply::with_header(
                warp::reply::json(&e.to_string()),
                "Access-Control-Allow-Origin",
                "DENY",
            ),
            warp::reply::json(&e),
            warp::http::StatusCode::INTERNAL_SERVER_ERROR,
        ),
    };
    Ok(response)
}