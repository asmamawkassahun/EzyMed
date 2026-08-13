// services/presence.service.ts
import { supabase } from "./supabase";
import api from "./api";
import { webSocketService } from "./websocket.service";

export interface Presence {
  user_id: string;
  status: "online" | "offline" | "away";
  last_seen: string;
  typing_in_conversation?: string;
  updated_at: string;
}

class PresenceService {
  private typingChannels = new Map<string, any>();
  private presenceChannels = new Map<string, any>();

  async updatePresence(
    status: "online" | "offline" | "away",
    typingInConversation?: string | null,
  ): Promise<void> {
    try {
      const userRes = await supabase.auth.getUser();
      const user = (userRes as any)?.data?.user;

      if (!user) {
        // This can happen during logout/unmount flows; treat it as a no-op.
        return;
      }

      // For regular presence states, prefer backend so reads/writes share the
      // same API path used by doctor discovery and dashboard presence.
      if (typeof typingInConversation === "undefined") {
        try {
          await api.post("/presence", { userId: user.id, status });
          return;
        } catch {
          // Fallback to direct Supabase write if backend call fails.
        }
      }

      const baseUpdateData = {
        user_id: user.id,
        status: status,
        last_seen: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const updateData =
        typeof typingInConversation === "undefined"
          ? baseUpdateData
          : {
              ...baseUpdateData,
              typing_in_conversation: typingInConversation || null,
            };

      let { error } = await supabase.from("user_presence").upsert(updateData, {
        onConflict: "user_id",
      });

      // Backward compatibility for schemas without typing_in_conversation.
      if (
        error &&
        typeof typingInConversation !== "undefined" &&
        `${error.message || ""}`
          .toLowerCase()
          .includes("typing_in_conversation")
      ) {
        ({ error } = await supabase
          .from("user_presence")
          .upsert(baseUpdateData, {
            onConflict: "user_id",
          }));
      }

      if (error) {
        console.error("❌ Error updating presence:", error);
        console.error("🔍 Error details:", {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
        });
      }
    } catch (error) {
      console.error("💥 Failed to update presence:", error);
    }
  }

  async getPresence(userId: string): Promise<Presence | null> {
    try {
      const res = await api.get('/presence', { params: { userId } });
      const data = res.data;
      if (!data) return this.getDefaultPresence(userId);
      return data;
    } catch (error) {
      console.error("Failed to get presence:", error);
      return this.getDefaultPresence(userId);
    }
  }

  async getCurrentUserPresence(): Promise<Presence | null> {
    try {
      const userRes = await supabase.auth.getUser();
      const user = (userRes as any)?.data?.user;
      if (!user) return null;

      return await this.getPresence(user.id);
    } catch (error) {
      console.error("Failed to get current user presence:", error);
      return null;
    }
  }

  async getMultiplePresence(userIds: string[]): Promise<Presence[]> {
    try {
      const results = await Promise.all(userIds.map((id) => this.getPresence(id)));
      return results.filter(Boolean) as Presence[];
    } catch (error) {
      console.error("Failed to get multiple presence:", error);
      return [];
    }
  }

  private getDefaultPresence(userId: string): Presence {
    return {
      user_id: userId,
      status: "offline",
      last_seen: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  async setTyping(conversationId: string, isTyping: boolean): Promise<void> {
    try {
      if (isTyping) {
        await this.updatePresence("online", conversationId);
      } else {
        await this.updatePresence("online", null);
      }
    } catch (error) {
      console.error("Failed to set typing:", error);
    }
  }

  subscribeToPresence(
    userId: string,
    callback: (presence: Presence) => void,
  ): any {
    try {
      // Unsubscribe from existing channel if any
      if (this.presenceChannels.has(userId)) {
        const existing = this.presenceChannels.get(userId);
        try {
          existing.unsubscribe?.();
        } catch {}
      }

      const handler = (payload: any) => {
        const presence = payload?.presence || payload?.new || payload;
        if (presence) callback(presence as Presence);
      };

      // Ensure websocket is connected and subscribe to presence:update events
      webSocketService.subscribeToIncomingCalls(userId, () => {}); // ensure socket exists
      // Listen for presence updates
      webSocketService.on('presence:update', handler);

      const channel = { unsubscribe: () => webSocketService.off('presence:update', handler) };
      this.presenceChannels.set(userId, channel);
      return channel;
    } catch (error) {
      console.error("Failed to subscribe to presence:", error);
      return { unsubscribe: () => {} };
    }
  }

  subscribeToConversationPresence(
    conversationUserIds: string[],
    callback: (presences: Map<string, Presence>) => void,
  ): any {
    try {
      const channelId = `conversation-presence:${conversationUserIds.join("-")}`;

      // Unsubscribe from existing channel if any
      if (this.presenceChannels.has(channelId)) {
        this.presenceChannels.get(channelId).unsubscribe();
      }

      // Build filters if needed (not used with Socket.IO subscriptions)

      // Subscribe to presence updates and refetch on any change
      const handler = async (_payload?: any) => {
        const presences = await this.getMultiplePresence(conversationUserIds);
        const presenceMap = new Map<string, Presence>();
        presences.forEach((presence) => {
          presenceMap.set(presence.user_id, presence);
        });
        conversationUserIds.forEach((userId) => {
          if (!presenceMap.has(userId)) {
            presenceMap.set(userId, this.getDefaultPresence(userId));
          }
        });
        callback(presenceMap);
      };

      webSocketService.subscribeToIncomingCalls(conversationUserIds[0] || '', () => {}); // ensure socket
      webSocketService.on('presence:update', handler);

      const channel = { unsubscribe: () => webSocketService.off('presence:update', handler) };
      this.presenceChannels.set(channelId, channel);
      return channel;
    } catch (error) {
      console.error("Failed to subscribe to conversation presence:", error);
      return { unsubscribe: () => {} };
    }
  }

  subscribeToTyping(
    conversationId: string,
    currentUserId: string,
    callback: (typingUserId: string, isTyping: boolean) => void,
  ): any {
    try {
      const channelKey = `typing:${conversationId}:${currentUserId}`;

      // Unsubscribe from existing channel if any
      if (this.typingChannels.has(channelKey)) {
        this.typingChannels.get(channelKey).unsubscribe();
      }

      const channel = supabase
        .channel(`typing:${conversationId}`)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "user_presence",
            filter: `typing_in_conversation=eq.${conversationId}`,
          },
          (payload: any) => {
            const presence = payload.new as Presence;
            // Only trigger if it's not the current user and we have a presence record
            if (presence && presence.user_id !== currentUserId) {
              callback(presence.user_id, !!presence.typing_in_conversation);
            }
          },
        )
        .subscribe((status: any) => {
          if (status === "SUBSCRIBED") {
          }
        });

      this.typingChannels.set(channelKey, channel);
      return channel;
    } catch (error) {
      console.error("Failed to subscribe to typing:", error);
      return { unsubscribe: () => {} };
    }
  }

  // Initialize presence for the current user if it doesn't exist.
  // Accepting a known userId avoids auth hydration race conditions.
  async initializePresence(userId?: string): Promise<void> {
    try {
      let resolvedUserId = userId;

      if (!resolvedUserId) {
        const userRes = await supabase.auth.getUser();
        const user = (userRes as any)?.data?.user;
        resolvedUserId = user?.id;
      }

      if (!resolvedUserId) {
        return;
      }

      const existingPresence = await this.getPresence(resolvedUserId);
      if (!existingPresence || existingPresence.status === "offline") {
        await this.updatePresence("online");
      }
    } catch (error) {
      console.error("Failed to initialize presence:", error);
    }
  }

  // Set user as offline (call when user leaves/logs out)
  async setOffline(): Promise<void> {
    try {
      await this.updatePresence("offline");
    } catch (error) {
      console.error("Failed to set offline status:", error);
    }
  }

  // Set user as away/inactive
  async setAway(): Promise<void> {
    try {
      await this.updatePresence("away");
    } catch (error) {
      console.error("Failed to set away status:", error);
    }
  }

  // Update last seen timestamp without changing status
  async updateLastSeen(): Promise<void> {
    try {
      const userRes = await supabase.auth.getUser();
      const user = (userRes as any)?.data?.user;
      if (!user) return;

      const { error } = await supabase
        .from("user_presence")
        .update({
          last_seen: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      if (error) {
        console.error("Error updating last seen:", error);
      }
    } catch (error) {
      console.error("Failed to update last seen:", error);
    }
  }

  // Cleanup method to unsubscribe all channels
  cleanup() {
    this.typingChannels.forEach((channel) => {
      try {
        channel.unsubscribe();
      } catch (error) {
        console.error("Error unsubscribing typing channel:", error);
      }
    });

    this.presenceChannels.forEach((channel) => {
      try {
        channel.unsubscribe();
      } catch (error) {
        console.error("Error unsubscribing presence channel:", error);
      }
    });

    this.typingChannels.clear();
    this.presenceChannels.clear();
  }

  // Cleanup specific user's subscriptions
  cleanupUserSubscriptions(userId: string) {
    const userPresenceChannel = this.presenceChannels.get(userId);
    if (userPresenceChannel) {
      try {
        userPresenceChannel.unsubscribe();
        this.presenceChannels.delete(userId);
      } catch (error) {
        console.error("Error cleaning up user presence subscriptions:", error);
      }
    }

    // Clean up typing channels for this user
    this.typingChannels.forEach((channel, key) => {
      if (key.includes(userId)) {
        try {
          channel.unsubscribe();
          this.typingChannels.delete(key);
        } catch (error) {
          console.error("Error cleaning up typing channel:", error);
        }
      }
    });
  }
}

export const presenceService = new PresenceService();
