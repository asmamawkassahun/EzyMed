// src/services/websocket.service.ts

import { io, Socket } from 'socket.io-client';

class WebSocketService {
  private static instance: WebSocketService;
  private socket: Socket | null = null;
  private currentUserId: string | null = null;
  private isInitialized = false;
  private callbacks: ((payload: any) => void)[] = [];
  // private callEndSocket: Socket | null = null; (declared above)

  static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  async subscribeToIncomingCalls(userId: string, callback: (payload: any) => void) {
    try {
      console.log('🔔 Subscribing to incoming calls for user:', userId);

      this.callbacks.push(callback);

      if (this.socket && this.currentUserId === userId) {
        console.log('✅ Already subscribed, checking for existing calls...');
        await this.checkExistingCalls(userId, callback);
        return this.socket;
      }

      this.unsubscribe();

      this.currentUserId = userId;

      const origin = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');
      this.socket = io(origin || '/', {
        autoConnect: false,
        auth: {
          token: localStorage.getItem('access_token'),
          userId,
        },
      });

      this.socket.on('connect', () => {
        console.log('Socket connected');
        this.isInitialized = true;
      });

      this.socket.on('audio_session:insert', (payload: any) => {
        console.log('📞 NEW incoming call notification:', payload);
        this.callbacks.forEach(cb => cb({ eventType: 'INSERT', new: payload, old: null }));
      });

      this.socket.on('audio_session:update', (payload: any) => {
        console.log('📞 Call status update:', payload);
        this.callbacks.forEach(cb => cb({ eventType: 'UPDATE', new: payload }));
      });

      this.socket.on('presence:update', (payload: any) => {
        console.log('🔔 Presence update received:', payload);
      });

      this.socket.connect();

      await this.checkExistingCalls(userId, callback);

      return this.socket;
    } catch (error) {
      console.error('❌ Failed to subscribe to incoming calls:', error);
      throw error;
    }
  }

  private async checkExistingCalls(userId: string, callback: (payload: any) => void) {
    try {
      console.log('🔍 Checking for existing pending calls...');
      const base = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '') || '';
      const res = await fetch(`${base}/api/audio-sessions?receiverId=${userId}&status=pending`);
      if (!res.ok) return;
      const pendingCalls = await res.json();
      if (Array.isArray(pendingCalls) && pendingCalls.length) {
        pendingCalls.forEach((session: any) => callback({ eventType: 'INSERT', new: session, old: null }));
      }
    } catch (error) {
      console.error('❌ Error in checkExistingCalls:', error);
    }
  }

  async subscribeToCallEndEvents(userId: string, callback: (payload: any) => void) {
    try {
      console.log('Subscribing to call end events for user:', userId);

      this.unsubscribeCallEnd();

      if (!this.socket) return null;
      const s = this.socket;
      const handler = (payload: any) => this.handleCallEnd(payload, callback, userId);
      s.on('audio_session:update', handler);
      this.callEndSocket = s;
      return s;
    } catch (error) {
      console.error('Failed to subscribe to call end events:', error);
      throw error;
    }
  }

  private handleCallEnd(payload: any, callback: (p: any) => void, userId: string) {
    if (payload?.new?.status === 'ended' || payload.status === 'ended') {
      console.log('CALL ENDED EVENT for user', userId, payload?.new?.id || payload.id);
      callback(payload);
    }
  }

  private callEndSocket: Socket | null = null;

  unsubscribeCallEnd() {
    if (this.callEndSocket && this.callEndSocket.off) {
      this.callEndSocket.off('audio_session:update');
      this.callEndSocket = null;
    }
  }

  unsubscribe() {
    if (this.socket) {
      try {
        this.socket.disconnect();
      } catch (e) {
        // ignore
      }
      this.socket = null;
      this.currentUserId = null;
      this.isInitialized = false;
      this.callbacks = [];
      console.log('🔕 Unsubscribed from WebSocket');
    }
  }

  removeCallback(callback: (payload: any) => void) {
    this.callbacks = this.callbacks.filter(cb => cb !== callback);
  }

  on(event: string, handler: (...args: any[]) => void) {
    this.socket?.on(event, handler);
  }

  off(event: string, handler?: (...args: any[]) => void) {
    if (handler) this.socket?.off(event, handler);
    else this.socket?.off(event as any);
  }

  isSubscribed(): boolean {
    return this.socket !== null && this.isInitialized;
  }
}

export const webSocketService = WebSocketService.getInstance();