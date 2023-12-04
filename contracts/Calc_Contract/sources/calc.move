module calc_addr::calc{

    public fun future_entry(entry_price: u64 , quantity_purchased: u64 , leverage : u64): (u64, u64){
       let trade_value = entry_price * quantity_purchased;
       let margin = trade_value / leverage; 
       (trade_value, margin)
    }

    public fun pnl_long(margin:u64 ,current_price: u64 , quantity_purchased: u64 , entry_price: u64): u64{
        let num = (current_price - entry_price) * quantity_purchased;
        let pnl = num/margin;
        pnl
    }

    public fun pnl_short(margin:u64 ,current_price: u64 , quantity_purchased: u64 , entry_price: u64): u64{
        let num = (entry_price - current_price) * quantity_purchased;
        let pnl = num/margin;
        pnl
    }

    public fun liquidate_or_not(is_long: bool , margin:u64 ,current_price: u64 , quantity_purchased: u64 , entry_price: u64): bool{
        let pnl = if (is_long) {pnl_long(margin, current_price, quantity_purchased, entry_price)} else {pnl_short(margin, current_price, quantity_purchased, entry_price)};
        if (pnl >= 1) {true} else {false}
    }

    public fun long_2_long( margin1:u64 , trade_value1:u64 , margin2:u64 , trade_value2:u64): (u64, u64,u64){
        let new_margin = margin1 + margin2;
        let new_trade_value = trade_value1 + trade_value2;
        let new_leverage = new_trade_value / new_margin;
        (new_leverage, new_margin, new_trade_value)
    }

    public fun long_2_short( margin1:u64 , trade_value1:u64 , margin2:u64 , trade_value2:u64): (u64, u64, u64 , bool){
       let new_margin = if (margin1 > margin2) {margin1 - margin2} else {margin2 - margin1};
       let new_trade_value = if (trade_value1 > trade_value2) {trade_value1 - trade_value2} else {trade_value2 - trade_value1};
       let new_leverage = new_trade_value / new_margin;
       let is_long = if (margin1 > margin2) {true} else {false};
       (new_leverage, new_margin, new_trade_value, is_long)
    }
}