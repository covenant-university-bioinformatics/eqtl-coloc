import { Stan } from 'node-nats-streaming';
import * as nats from 'node-nats-streaming';
export class NatsClient {
  private _client?: Stan;

  constructor() {}

  get client() {
    if (!this._client) {
      throw new Error('Cannot access NATS client before connecting');
    }

    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string): Promise<void> {
    // console.log('Auth: ', clusterId, clientId, { url });
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise((resolve, reject) => {
      this.client.on('connect', () => {
        console.log('Connected to NATS');
        resolve();
      });
      this.client.on('error', (err) => {
        console.log(err);
        reject(err);
      });
    });
  }
}

// export const natsWrapper = new NatsWrapper();
