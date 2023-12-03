class PairTradeInfo {
  final String coinSymbol1;
  final String coinSymbol2;
  final String iconImage;
  final double price;
  final double dayChange;
  final double dayhigh;
  final double dayLow;
  final String dayVolume;
  final String openIntrest;

  const PairTradeInfo({
    required this.coinSymbol1,
    required this.coinSymbol2,
    required this.iconImage,
    required this.price,
    required this.dayChange,
    required this.dayhigh,
    required this.dayLow,
    required this.dayVolume,
    required this.openIntrest,
  });
}
