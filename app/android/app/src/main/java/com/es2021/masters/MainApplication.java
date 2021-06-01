package com.es2021.masters;

import android.app.Application;
import android.content.Context;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.reactlibrary.RNInstallReferrerPackage;

import com.github.wumke.RNExitApp.RNExitAppPackage;
// import com.github.yamill.orientation.OrientationPackage;
// import org.wonday.orientation.OrientationPackage;
// import com.rnnestedscrollview.RNNestedScrollViewPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.como.RNTShadowView.ShadowViewPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import java.lang.reflect.InvocationTargetException;
import java.util.List;

import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage;

import com.facebook.FacebookSdk;
import com.facebook.appevents.AppEventsLogger;

import android.os.Bundle;
import com.facebook.react.ReactActivity;
import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.util.Log;
import com.facebook.applinks.AppLinkData;


public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // packages.add(new MyReactNativePackage());
            packages.add(new RNFirebaseNotificationsPackage());
            packages.add(new RNFirebaseMessagingPackage());
            packages.add(new RNFirebaseAnalyticsPackage());
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
     //DEEPLINK FB
     AppLinkData.fetchDeferredAppLinkData(this, getString(R.string.facebook_app_id),
        new AppLinkData.CompletionHandler() {
            @Override
            public void onDeferredAppLinkDataFetched(AppLinkData appLinkData) {
                Log.d("SplashActivity", "appLinkData: " + appLinkData);
            }
        }
    );
    SoLoader.init(this, /* native exopackage */ false);
     FacebookSdk.sdkInitialize(getApplicationContext());
     AppEventsLogger.activateApp(this);
    initializeFlipper(this); // Remove this line if you don't want Flipper enabled
  }

  /**
   * Loads Flipper in React Native templates.
   *
   * @param context
   */
  private static void initializeFlipper(Context context) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
        Class<?> aClass = Class.forName("com.facebook.flipper.ReactNativeFlipper");
        aClass.getMethod("initializeFlipper", Context.class).invoke(null, context);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }
}
