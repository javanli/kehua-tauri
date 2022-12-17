import { invoke, transformCallback } from '@tauri-apps/api/tauri';

export interface MessageKind<T, D> {
  type: T;
  data: D;
}

export interface CloseFrame {
  code: number;
  reason: string;
}

export type Message =
  | MessageKind<'Text', string>
  | MessageKind<'Binary', number[]>
  | MessageKind<'Ping', number[]>
  | MessageKind<'Pong', number[]>
  | MessageKind<'Close', CloseFrame | null>;

export default class WebSocket {
  id: number;
  private listeners: ((arg: Message) => void)[];

  constructor(id: number, listeners: ((arg: Message) => void)[]) {
    this.id = id;
    this.listeners = listeners;
  }

  static async connect(
    url: string,
    options?: any,
    headers?: Record<string, string>,
  ): Promise<WebSocket> {
    const listeners: ((arg: Message) => void)[] = [];
    const handler = (message: Message) => {
      console.log('websocket receive msg:', message);
      listeners.forEach((l) => l(message));
    };

    return invoke<number>('plugin:websocket|connect', {
      url,
      callbackFunction: transformCallback(handler),
      options,
      headers,
    }).then((id) => new WebSocket(id, listeners));
  }

  addListener(cb: (arg: Message) => void) {
    this.listeners.push(cb);
  }

  send(message: Message | string | number[]): Promise<void> {
    let m: Message;
    if (typeof message === 'string') {
      m = { type: 'Text', data: message };
    } else if (typeof message === 'object' && 'type' in message) {
      m = message;
    } else if (Array.isArray(message)) {
      m = { type: 'Binary', data: message };
    } else {
      throw new Error(
        'invalid `message` type, expected a `{ type: string, data: any }` object, a string or a numeric array',
      );
    }
    console.log('websocket send msg:', m);
    return invoke('plugin:websocket|send', {
      id: this.id,
      message: m,
    });
  }

  disconnect(): Promise<void> {
    return this.send({
      type: 'Close',
      data: {
        code: 1000,
        reason: 'Disconnected by client',
      },
    });
  }
}
