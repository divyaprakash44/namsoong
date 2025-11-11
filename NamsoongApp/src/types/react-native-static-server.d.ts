// src/types/react-native-static-server.d.ts
declare module 'react-native-static-server' {
  export interface StaticServerOptions {
    // port and root can be provided via constructor params or options depending on lib version
    port?: number;
    root?: string;
    localOnly?: boolean;
    log?: boolean;
  }

  declare class StaticServer {
    constructor(port?: number | StaticServerOptions, root?: string, options?: StaticServerOptions);

    /**
     * Starts the server and resolves to the server origin e.g. "http://127.0.0.1:8080"
     */
    start(): Promise<string>;

    /**
     * Stops the server
     */
    stop(): void;
  }

  export default StaticServer;
}
