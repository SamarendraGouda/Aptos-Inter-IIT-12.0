def calculate_liquidation_price(trade_amount, trade_price, leverage, is_long):
    direction = 1 if is_long else -1
    liquidation_price = trade_price * (1 + direction * (1 / leverage)) / trade_amount
    return liquidation_price

def calculate_margin(quantity, entry_price, leverage):
    total_value = quantity * entry_price
    return (total_value / leverage)

def future_entry(entry_price, quantity_purchased, leverage):
    trade_value = entry_price * quantity_purchased
    margin = trade_value / leverage
    return trade_value, margin

def pnl_long(margin, current_price, quantity_purchased, entry_price):
    num = (current_price - entry_price) * quantity_purchased
    pnl = num / margin
    return pnl

def pnl_short(margin, current_price, quantity_purchased, entry_price):
    num = (entry_price - current_price) * quantity_purchased
    pnl = num / margin
    return pnl

def liquidate_or_not(is_long, margin, current_price, quantity_purchased, entry_price):
    pnl = pnl_long(margin, current_price, quantity_purchased, entry_price) if is_long else pnl_short(margin, current_price, quantity_purchased, entry_price)
    return pnl >= 1

def long_2_long(margin1, trade_value1, margin2, trade_value2):
    new_margin = margin1 + margin2
    new_trade_value = trade_value1 + trade_value2
    new_leverage = new_trade_value / new_margin
    return new_leverage, new_margin, new_trade_value

def long_2_short(margin1, trade_value1, margin2, trade_value2):
    new_margin = margin1 - margin2 if margin1 > margin2 else margin2 - margin1
    new_trade_value = trade_value1 - trade_value2 if trade_value1 > trade_value2 else trade_value2 - trade_value1
    new_leverage = new_trade_value / new_margin
    is_long = margin1 > margin2
    return new_leverage, new_margin, new_trade_value, is_long
