import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  // Text Styles
  static TextStyle headline1 = GoogleFonts.interTight(
    fontWeight: FontWeight.w700,
    color: textBodyPrimary,
    fontSize: 14,
  );

  static TextStyle headline2 = GoogleFonts.interTight(
    fontWeight: FontWeight.w600,
    color: textBodyPrimary,
    fontSize: 12,
  );

  static TextStyle headline3 = GoogleFonts.interTight(
    fontWeight: FontWeight.w400,
    color: textBodyPrimary,
    fontSize: 12,
  );

  static TextStyle bodyText1 = GoogleFonts.interTight(
    fontWeight: FontWeight.w400,
    color: textBodyPrimary,
    fontSize: 10,
  );

  // Colors
  static const Color primary = Color(0xFF101124);
  static const Color secondary = Color(0xFF16182E);
  static const Color tertiary = Color(0xFF23263B);

  static const Color buttonPrimary = Color(0xFF6802DD);
  static const Color buttonSecondary = Color(0xFF242944);

  static const Color textPositive = Color(0xFF0ECC83);
  static const Color textNegative = Color(0xFFFA3C58);
  static const Color textNeutral = Color(0xFFA9A9B0);
  static const Color textBodySecondary = Color(0xFF719DB5);
  static const Color textBodyPrimary = Color(0xFFFFFFFF);

  static const Color lightGreenBlue = Color(0xFF0B2C41);
  static const Color darkGreenValue = Color(0xFF051421);
}
