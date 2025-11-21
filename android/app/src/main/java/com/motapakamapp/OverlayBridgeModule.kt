package com.motapakamapp

import android.content.Intent
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class OverlayBridgeModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "OverlayBridge"

    @ReactMethod
    fun allow(targetPkg: String) {
        val intent = reactApplicationContext.packageManager.getLaunchIntentForPackage(targetPkg)
        if (intent != null) {
            reactApplicationContext.startActivity(intent)
        }
        removeOverlay()
    }

    @ReactMethod
    fun close() {
        removeOverlay()
    }

    private fun removeOverlay() {
        val intent = Intent(reactApplicationContext, OverlayService::class.java)
        reactApplicationContext.stopService(intent)
    }
}
