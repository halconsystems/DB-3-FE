import { useEffect, useRef } from "react";
import * as signalR from "@microsoft/signalr";
// Update the import path below if your auth store is elsewhere

import { useQueryClient } from "@tanstack/react-query";
import { toast, toastOptions } from "../components/ui/toast";

export const useSignalR = () => {
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (typeof window === "undefined") return; // only run on client

    const API_BASE = process.env.NEXT_PUBLIC_API_URL;
    if (!API_BASE) {
      console.error("NEXT_PUBLIC_API_URL is not set");
      return;
    }

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_BASE}/hubs/realtime-events`, {
        accessTokenFactory: () => (typeof window !== "undefined" ? localStorage.getItem("token") || "" : "")
      })
      .withAutomaticReconnect()
      .build();

    connection.on("notification.created", (payload) => {
      // Show toast popup for new notification
      toast(
        payload?.title
          ? `${payload.title}: ${payload.message ?? "New notification received"}`
          : "New notification received!",
        toastOptions
      );
      // Invalidate or update notification queries
      queryClient.invalidateQueries({ queryKey: ["unread-notifications"] });
    });

    connection.on("tagApproval.request.created", (payload) => {
      // Invalidate or update tag approval queries
      queryClient.invalidateQueries({ queryKey: ["tag-approval-pending"] });
    });

    connection.on("tagApproval.request.statusChanged", (payload) => {
      // Invalidate or update tag approval status queries
      queryClient.invalidateQueries({ queryKey: ["tag-approval-status"] });
    });

    connection.start()
      .then(() => console.log("SignalR connected"))
      .catch(err => console.error("SignalR connection error:", err));

    connectionRef.current = connection;

    return () => {
      connection.stop();
    };
  }, [queryClient]);

  return connectionRef.current;
};
