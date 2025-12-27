import {WebSocket } from 'ws';

export interface AuthWebSocket extends WebSocket {
  token?: string;
  userId?: number;
}
