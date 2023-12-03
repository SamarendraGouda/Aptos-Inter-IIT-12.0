class TradeInfo {
  final String coinSymbol1;
  final String coinSymbol2;
  final String volume;
  final double change;

  const TradeInfo({
    required this.coinSymbol1,
    required this.coinSymbol2,
    required this.volume,
    required this.change,
  });
}
