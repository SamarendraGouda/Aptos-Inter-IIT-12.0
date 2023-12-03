import 'package:aptos/app_theme.dart';
import 'package:aptos/model/pair_trade_info.dart';
import 'package:aptos/model/trade_info.dart';
import 'package:aptos/utils/constants.dart';
import 'package:aptos/view/base_view.dart';
import 'package:aptos/view/components/pair_status_card.dart';
import 'package:aptos/view/components/stats_card.dart';
import 'package:flutter/material.dart';
import 'package:aptos/viewmodels/home/home_viewmodel.dart';

class HomePage extends StatelessWidget {
  HomePage({super.key});

  final List<TradeInfo> data = [
    const TradeInfo(
      coinSymbol1: 'XRP',
      coinSymbol2: 'USDC',
      volume: '0.63013',
      change: 5.17,
    ),
    const TradeInfo(
      coinSymbol1: 'WETH',
      coinSymbol2: 'USDC',
      volume: '20,298',
      change: 4.75,
    ),
    const TradeInfo(
      coinSymbol1: 'MATIC',
      coinSymbol2: 'USDC',
      volume: '1.997M',
      change: -0.38,
    )
  ];

  final List<PairTradeInfo> pairData = [
    const PairTradeInfo(
      coinSymbol1: 'USDC',
      coinSymbol2: 'BTC',
      iconImage: bitcoinIcon,
      price: 38288,
      dayChange: 3.72,
      dayhigh: 38732,
      dayLow: 36819,
      dayVolume: '1.807M',
      openIntrest: '179,0M',
    ),
    const PairTradeInfo(
      coinSymbol1: 'USDC',
      coinSymbol2: 'BTC',
      iconImage: bitcoinIcon,
      price: 38288,
      dayChange: 3.72,
      dayhigh: 38732,
      dayLow: 36819,
      dayVolume: '1.807M',
      openIntrest: '179,0M',
    )
  ];

  @override
  Widget build(BuildContext context) {
    return BaseView<HomeViewModel>(
      builder: (BuildContext context, HomeViewModel model, Widget? child) =>
          Scaffold(
        backgroundColor: AppTheme.primary,
        appBar: AppBar(
          backgroundColor: AppTheme.secondary,
          title: const Text('abcd'),
        ),
        body: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          child: Column(
            children: [
              ListView.separated(
                padding: const EdgeInsets.all(8.0),
                physics: const ScrollPhysics(),
                shrinkWrap: true,
                itemCount: 3,
                separatorBuilder: (context, index) => const SizedBox(
                  height: 8.0,
                ),
                itemBuilder: (context, index) => StatsCard(
                  imageIcon: topGainerIcon,
                  cardText: 'Top Gainer',
                  data: data,
                ),
              ),
              ListView.separated(
                padding: const EdgeInsets.all(8.0),
                physics: const ScrollPhysics(),
                shrinkWrap: true,
                itemCount: pairData.length,
                separatorBuilder: (context, index) => const SizedBox(
                  height: 8.0,
                ),
                itemBuilder: (context, index) => PairStatusCard(
                  tradeInfo: pairData[index],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
