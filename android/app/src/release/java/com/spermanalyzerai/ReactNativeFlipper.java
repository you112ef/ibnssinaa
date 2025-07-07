package com.spermanalyzerai;

import android.content.Context;
import com.facebook.react.ReactInstanceManager;

/**
 * Class responsible of loading Flipper inside your React Native application for Release builds.
 * Flipper is disabled in release builds.
 */
public class ReactNativeFlipper {
  public static void initializeFlipper(Context context, ReactInstanceManager reactInstanceManager) {
    // Do nothing as Flipper is disabled in release builds
  }
}