import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const VAPID_STORAGE_KEY = "push-notifications-enabled";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function usePushNotifications() {
  const { user } = useAuth();
  const [isSupported, setIsSupported] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    const supported = "Notification" in window && "serviceWorker" in navigator;
    setIsSupported(supported);
    if (supported) {
      setPermission(Notification.permission);
      setIsEnabled(localStorage.getItem(VAPID_STORAGE_KEY) === "true");
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!isSupported) return false;

    const result = await Notification.requestPermission();
    setPermission(result);

    if (result === "granted") {
      // Register service worker for push
      try {
        const registration = await navigator.serviceWorker.register("/sw.js");
        await registration.update();
        localStorage.setItem(VAPID_STORAGE_KEY, "true");
        setIsEnabled(true);
        return true;
      } catch (err) {
        console.error("SW registration failed:", err);
        return false;
      }
    }
    return false;
  }, [isSupported]);

  const disable = useCallback(() => {
    localStorage.removeItem(VAPID_STORAGE_KEY);
    setIsEnabled(false);
  }, []);

  // Show browser notification for new in-app notifications
  const showBrowserNotification = useCallback(
    (title: string, body: string, link?: string) => {
      if (!isEnabled || permission !== "granted") return;

      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification(title, {
            body,
            icon: "/favicon.ico",
            badge: "/favicon.ico",
            tag: `notification-${Date.now()}`,
            data: { url: link || "/" },
          });
        });
      }
    },
    [isEnabled, permission]
  );

  return {
    isSupported,
    isEnabled,
    permission,
    requestPermission,
    disable,
    showBrowserNotification,
  };
}
