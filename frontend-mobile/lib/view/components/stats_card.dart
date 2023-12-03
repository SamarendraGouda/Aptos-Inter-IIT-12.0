import 'package:aptos/model/trade_info.dart';
import 'package:aptos/utils/constants.dart';
import 'package:flutter/material.dart';
import 'package:aptos/app_theme.dart';
import 'package:flutter_svg/flutter_svg.dart';

class StatsCard extends StatelessWidget {
  final String cardText;
  final String imageIcon;
  final List<TradeInfo> data;
  const StatsCard({
    required this.cardText,
    required this.imageIcon,
    required this.data,
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(4),
      ),
      clipBehavior: Clip.antiAliasWithSaveLayer,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            height: 80,
            decoration: const BoxDecoration(
              image: DecorationImage(
                image: AssetImage(cardBackground2),
                fit: BoxFit.cover,
              ),
            ),
            child: Align(
              alignment: Alignment.centerLeft,
              child: Row(
                children: [
                  SvgPicture.asset(imageIcon),
                  Text(
                    cardText,
                    style: Theme.of(context)
                        .textTheme
                        .displayLarge
                        ?.copyWith(color: AppTheme.textBodyPrimary),
                  )
                ],
              ),
            ),
          ),
          Container(
            decoration: const BoxDecoration(
              color: AppTheme.secondary,
            ),
            child: Padding(
              padding: const EdgeInsets.all(8.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: ListView.separated(
                      shrinkWrap: true,
                      physics: const ScrollPhysics(),
                      itemCount: data.length,
                      separatorBuilder: (context, index) => const SizedBox(
                        height: 8.0,
                      ),
                      itemBuilder: (context, index) => Align(
                        alignment: Alignment.centerLeft,
                        child: Text.rich(
                          TextSpan(
                            children: [
                              TextSpan(
                                text: data[index].coinSymbol1,
                                style: Theme.of(context)
                                    .textTheme
                                    .displayMedium
                                    ?.copyWith(
                                      color: AppTheme.textBodyPrimary,
                                    ),
                              ),
                              TextSpan(
                                text: '/${data[index].coinSymbol1}',
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
                      ),
                    ),
                  ),
                  Expanded(
                    child: ListView.separated(
                      shrinkWrap: true,
                      physics: const ScrollPhysics(),
                      itemCount: data.length,
                      separatorBuilder: (context, index) => const SizedBox(
                        height: 8.0,
                      ),
                      itemBuilder: (context, index) => Align(
                        alignment: Alignment.center,
                        child: Text(
                          '\$${data[index].volume}',
                          style: Theme.of(context).textTheme.displaySmall,
                        ),
                      ),
                    ),
                  ),
                  Expanded(
                    child: ListView.separated(
                      shrinkWrap: true,
                      physics: const ScrollPhysics(),
                      itemCount: data.length,
                      separatorBuilder: (context, index) => const SizedBox(
                        height: 8.0,
                      ),
                      itemBuilder: (context, index) => Align(
                        alignment: Alignment.centerRight,
                        child: Text(
                          '${data[index].change > 0 ? '+' : ''}${data[index].change}%',
                          style: Theme.of(context)
                              .textTheme
                              .displaySmall
                              ?.copyWith(
                                color: (data[index].change > 0)
                                    ? AppTheme.textPositive
                                    : AppTheme.textNegative,
                              ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          )
        ],
      ),
    );
  }
}
