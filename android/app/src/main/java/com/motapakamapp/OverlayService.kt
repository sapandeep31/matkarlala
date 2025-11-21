package com.motapakamapp

import android.app.Service
import android.content.Intent
import android.graphics.PixelFormat
import android.os.IBinder
import android.view.Gravity
import android.view.WindowManager
import com.facebook.react.ReactRootView
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap

class OverlayService : Service() {
    private var windowManager: WindowManager? = null
    private var overlayView: ReactRootView? = null

    override fun onCreate() {
        super.onCreate()
        windowManager = getSystemService(WINDOW_SERVICE) as WindowManager
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val targetPkg = intent?.getStringExtra("targetPkg") ?: ""
        val warningsJson = intent?.getStringExtra("warningsJson") ?: "[]"

        if (overlayView != null) {
            sendPropsToReact(targetPkg, warningsJson)
            return START_STICKY
        }

        overlayView = ReactRootView(this)
        val reactInstanceManager = (application as MainApplication).reactNativeHost.reactInstanceManager

        val initialProps: WritableMap = Arguments.createMap().apply {
            putString("targetPkg", targetPkg)
            putString("warningsJson", warningsJson)
        }

        overlayView?.startReactApplication(reactInstanceManager, "WarningOverlayApp", initialProps)

        val layoutFlag = WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
        val params = WindowManager.LayoutParams(
            WindowManager.LayoutParams.MATCH_PARENT,
            WindowManager.LayoutParams.MATCH_PARENT,
            layoutFlag,
            WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN,
            PixelFormat.TRANSLUCENT
        )
        params.gravity = Gravity.TOP or Gravity.START

        windowManager?.addView(overlayView, params)

        return START_STICKY
    }

    private fun sendPropsToReact(targetPkg: String, warningsJson: String) {
        val reactInstanceManager = (application as MainApplication).reactNativeHost.reactInstanceManager
        val reactContext = reactInstanceManager.currentReactContext ?: return
        val params = Arguments.createMap().apply {
            putString("targetPkg", targetPkg)
            putString("warningsJson", warningsJson)
        }
        reactContext
            .getJSModule(com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit("OverlayUpdate", params)
    }

    fun removeOverlay() {
        overlayView?.let {
            try {
                windowManager?.removeView(it)
            } catch (e: Exception) {
                // ignore
            }
        }
        overlayView = null
        stopSelf()
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onDestroy() {
        super.onDestroy()
        removeOverlay()
    }
}
