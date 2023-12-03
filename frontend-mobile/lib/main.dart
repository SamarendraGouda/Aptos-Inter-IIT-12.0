import 'package:aptos/app_theme.dart';
import 'package:aptos/view/router.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'package:aptos/locator.dart';
import 'package:aptos/view/pages/home/home_page.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await setupLocator();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    SystemChrome.setPreferredOrientations([DeviceOrientation.portraitUp]);
    return MaterialApp(
      onGenerateRoute: AptosRouter.generateRoute,
      debugShowCheckedModeBanner: false,
      title: 'Aptos Trading App',
      theme: ThemeData(
        primaryColor: AppTheme.primary,
        colorScheme: const ColorScheme(
          brightness: Brightness.light,
          primary: AppTheme.primary,
          onPrimary: AppTheme.textBodyPrimary,
          secondary: AppTheme.secondary,
          onSecondary: AppTheme.textBodyPrimary,
          error: AppTheme.textNegative,
          onError: AppTheme.textBodyPrimary,
          background: AppTheme.primary,
          onBackground: AppTheme.textBodyPrimary,
          surface: AppTheme.secondary,
          onSurface: AppTheme.textBodyPrimary,
        ),
        textTheme: TextTheme(
          displayLarge: AppTheme.headline1,
          displayMedium: AppTheme.headline2,
          displaySmall: AppTheme.headline3,
          bodyLarge: AppTheme.bodyText1,
        ),
      ),
      home: HomePage(),
    );
  }
}
