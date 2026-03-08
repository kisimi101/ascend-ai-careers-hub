import React, { useEffect, useState } from "react";
import { Bell, Check, Briefcase, AlertCircle, Info, Trash2, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { usePushNotifications } from "@/hooks/usePushNotifications";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
}

const typeIcons: Record<string, React.ReactNode> = {
  job_alert: <Briefcase className="w-4 h-4 text-primary" />,
  status_change: <AlertCircle className="w-4 h-4 text-amber-500" />,
  deadline: <AlertCircle className="w-4 h-4 text-destructive" />,
  info: <Info className="w-4 h-4 text-muted-foreground" />,
};

export const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showBrowserNotification } = usePushNotifications();

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  useEffect(() => {
    if (!user) return;
    fetchNotifications();

    // Real-time subscription
    const channel = supabase
      .channel("notifications-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` },
        (payload) => {
          const newNotif = payload.new as Notification;
          setNotifications((prev) => [newNotif, ...prev]);
          // Trigger browser push notification
          showBrowserNotification(newNotif.title, newNotif.message, newNotif.link || undefined);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, showBrowserNotification]);

  const fetchNotifications = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);
    if (data) setNotifications(data);
  };

  const markAsRead = async (id: string) => {
    await supabase.from("notifications").update({ is_read: true }).eq("id", id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
  };

  const markAllRead = async () => {
    if (!user) return;
    const unreadIds = notifications.filter((n) => !n.is_read).map((n) => n.id);
    if (unreadIds.length === 0) return;
    await supabase.from("notifications").update({ is_read: true }).in("id", unreadIds);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const deleteNotification = async (id: string) => {
    await supabase.from("notifications").delete().eq("id", id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleClick = (n: Notification) => {
    markAsRead(n.id);
    if (n.link) {
      navigate(n.link);
      setOpen(false);
    }
  };

  if (!user) return null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] bg-destructive text-destructive-foreground border-2 border-background">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h4 className="font-semibold text-sm">Notifications</h4>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllRead} className="h-7 text-xs gap-1">
              <CheckCheck className="w-3 h-3" />
              Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="max-h-80">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground text-sm">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
              No notifications yet
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 px-4 py-3 hover:bg-accent/50 cursor-pointer transition-colors ${!n.is_read ? "bg-primary/5" : ""}`}
                  onClick={() => handleClick(n)}
                >
                  <div className="mt-0.5 shrink-0">
                    {typeIcons[n.type] || typeIcons.info}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm leading-tight ${!n.is_read ? "font-semibold" : "font-medium"}`}>
                      {n.title}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                      {n.message}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    {!n.is_read && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => { e.stopPropagation(); markAsRead(n.id); }}
                      >
                        <Check className="w-3 h-3" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-destructive"
                      onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
