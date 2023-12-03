import 'package:aptos/app_theme.dart';
import 'package:aptos/model/pair_trade_info.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class PairStatusCard extends StatelessWidget {
  final PairTradeInfo tradeInfo;
  const PairStatusCard({required this.tradeInfo, super.key});

  @override
  Widget build(BuildContext context) {
    const changeKey = '24H Change';
    final changeColor =
        tradeInfo.dayChange > 0 ? AppTheme.textPositive : AppTheme.textNegative;
    final data = {
      'Price': '\$${tradeInfo.price}',
      '24H Change':
          '${tradeInfo.dayChange > 0 ? '+' : ''}${tradeInfo.dayChange}%',
      '24H High': tradeInfo.dayhigh.toString(),
      '24H Low': tradeInfo.dayLow.toString(),
      '24H Volume': tradeInfo.dayVolume,
      'Open Intrest': tradeInfo.openIntrest
    };

    return Card(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(4),
      ),
      clipBehavior: Clip.antiAliasWithSaveLayer,
      child: Container(
        decoration: const BoxDecoration(
          color: AppTheme.secondary,
        ),
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Row(
                      children: [
                        Padding(
                          padding: const EdgeInsets.only(right: 8.0),
                          child: SvgPicture.asset(tradeInfo.iconImage),
                        ),
                        Text.rich(
                          TextSpan(
                            children: [
                              TextSpan(
                                text: tradeInfo.coinSymbol1,
                                style: Theme.of(context)
                                    .textTheme
                                    .displayMedium
                                    ?.copyWith(
                                      color: AppTheme.textBodyPrimary,
                                    ),
                              ),
                              TextSpan(
                                text: '/${tradeInfo.coinSymbol1}',
                                style: Theme.of(context)
                                    .textTheme
                                    .displaySmall
                                    ?.copyWith(
                                      color: AppTheme.textNeutral,
                                    ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                  MaterialButton(
                    onPressed: () {},
                    visualDensity: VisualDensity.compact,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(4),
                    ),
                    color: AppTheme.buttonPrimary,
                    child: Text(
                      'Trade',
                      style: Theme.of(context).textTheme.displaySmall,
                    ),
                  )
                ],
              ),
            ),
            const Divider(
              height: 2,
              thickness: 2,
              color: AppTheme.tertiary,
            ),
            ListView.separated(
              padding: const EdgeInsets.all(8),
              physics: const ScrollPhysics(),
              shrinkWrap: true,
              itemCount: data.keys.length,
              separatorBuilder: (context, index) => const SizedBox(
                height: 4.0,
              ),
              itemBuilder: (context, index) => Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    data.keys.elementAt(index),
                    style: Theme.of(context)
                        .textTheme
                        .displaySmall
                        ?.copyWith(color: AppTheme.textNeutral),
                  ),
                  Text(
                    data.values.elementAt(
                      index,
                    ),
                    style: Theme.of(context).textTheme.displaySmall?.copyWith(
                        color: data.keys.elementAt(index) == changeKey
                            ? changeColor
                            : AppTheme.textBodyPrimary),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/*
// Row(
          //   mainAxisAlignment: MainAxisAlignment.spaceBetween,
          //   children: [

          //   ],
          // ),

*/
