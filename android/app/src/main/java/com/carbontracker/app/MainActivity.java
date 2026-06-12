package com.carbontracker.app;

import android.os.Bundle;
import android.os.Build;
import android.app.AlertDialog;
import android.content.DialogInterface;
import com.getcapacitor.BridgeActivity;
import java.io.File;
import java.io.BufferedReader;
import java.io.InputStreamReader;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (isRooted()) {
            showRootWarningAndExit();
        }
    }

    private boolean isRooted() {
        // Check Build Tags for test-keys
        String buildTags = Build.TAGS;
        if (buildTags != null && buildTags.contains("test-keys")) {
            return true;
        }

        // Check for common SU path locations
        String[] paths = {
            "/system/app/Superuser.apk",
            "/sbin/su",
            "/system/bin/su",
            "/system/xbin/su",
            "/data/local/xbin/su",
            "/data/local/bin/su",
            "/system/sd/xbin/su",
            "/system/bin/failsafe/su",
            "/data/local/su"
        };
        for (String path : paths) {
            if (new File(path).exists()) {
                return true;
            }
        }

        // Check if su command can be executed
        Process process = null;
        try {
            process = Runtime.getRuntime().exec(new String[] { "/system/xbin/which", "su" });
            BufferedReader in = new BufferedReader(new InputStreamReader(process.getInputStream()));
            if (in.readLine() != null) return true;
        } catch (Throwable t) {
            // Ignore
        } finally {
            if (process != null) process.destroy();
        }

        return false;
    }

    private void showRootWarningAndExit() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("Security Violation Detected")
               .setMessage("This application cannot run on a rooted device due to security policy enforcement.")
               .setCancelable(false)
               .setPositiveButton("Exit App", new DialogInterface.OnClickListener() {
                   public void onClick(DialogInterface dialog, int id) {
                       finish();
                       System.exit(0);
                   }
               });
        AlertDialog alert = builder.create();
        alert.show();
    }
}
