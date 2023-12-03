import 'package:get_it/get_it.dart';

import 'package:aptos/viewmodels/home/home_viewmodel.dart';

GetIt locator = GetIt.instance;

Future<void> setupLocator() async {
  // viewmodels
  locator.registerFactory(() => HomeViewModel());
}
