// server.ts (verbose, safe start)
import StaticServer from 'react-native-static-server';
import RNFS from 'react-native-fs';

export const WWW_ROOT = RNFS.CachesDirectoryPath + '/www';
export const SERVER_PORT = 8080;
export const SERVER_URL = `http://127.0.0.1:${SERVER_PORT}`; // use 127.0.0.1 for clarity

let server: any;

/**
 * Copy viewer assets from android assets -> WWW_ROOT
 */
const copyViewerFiles = async () => {
  try {
    console.log('[server] WWW_ROOT path:', WWW_ROOT);

    // ensure directories exist
    if (!(await RNFS.exists(WWW_ROOT))) {
      console.log('[server] creating WWW_ROOT folder');
      await RNFS.mkdir(WWW_ROOT);
    }
    const jsDir = `${WWW_ROOT}/js`;
    const cssDir = `${WWW_ROOT}/css`;
    if (!(await RNFS.exists(jsDir))) await RNFS.mkdir(jsDir);
    if (!(await RNFS.exists(cssDir))) await RNFS.mkdir(cssDir);

    // copy list
    const filesToCopy = [
      'viewer.html',
      'js/pdf.min.js',
      'js/pdf.worker.min.js',
      'css/pdf_viewer.min.css',
    ];

    for (const file of filesToCopy) {
      const destPath = `${WWW_ROOT}/${file}`;
      try {
        const exists = await RNFS.exists(destPath);
        if (exists) {
          console.log(`[server] already exists: ${destPath}`);
          continue;
        }

        // check in assets (Android) first
        try {
          // existsAssets is not in all RNFS versions, so try/catch
          const assetExists = typeof RNFS.existsAssets === 'function'
            ? await RNFS.existsAssets(file)
            : true; // if we can't check, attempt copy and catch

          if (!assetExists) {
            console.warn('[server] asset not found in APK assets:', file);
            continue;
          }
        } catch (inner) {
          // ignore and attempt copyFileAssets — will error if not present
        }

        console.log('[server] copying asset ->', destPath);
        await RNFS.copyFileAssets(file, destPath);
        console.log('[server] copied', file);
      } catch (copyErr) {
        console.warn('[server] failed to copy asset', file, copyErr);
      }
    }

    // list target folder for debugging
    try {
      const listing = await RNFS.readDir(WWW_ROOT);
      console.log('[server] WWW_ROOT listing:', listing.map(i => i.name));
    } catch (e) {
      console.warn('[server] could not list WWW_ROOT', e);
    }

    console.log('[server] copyViewerFiles done');
  } catch (err) {
    console.error('[server] copyViewerFiles top-level error', err);
  }
};

export const startServer = async () => {
  try {
    console.log('[server] startServer called');
    await copyViewerFiles();

    // sanity check: directory exists and is readable
    const rootExists = await RNFS.exists(WWW_ROOT);
    console.log('[server] WWW_ROOT exists?', rootExists);
    if (!rootExists) {
      console.warn('[server] WWW_ROOT not found. Trying DocumentDirectoryPath fallback.');
      const fallback = RNFS.DocumentDirectoryPath + '/www';
      if (!(await RNFS.exists(fallback))) await RNFS.mkdir(fallback);
      console.log('[server] using fallback root:', fallback);
      // assign fallback root
      server = new StaticServer(SERVER_PORT, fallback, { localOnly: true });
    } else {
      server = new StaticServer(SERVER_PORT, WWW_ROOT, { localOnly: true });
    }

    // attempt to start the server and log any native error
    try {
      const url = await server.start();
      console.log('[server] Local server started at', url);
      return url;
    } catch (nativeErr) {
      console.error('[server] Error starting server (native) ->', nativeErr);
      // If nativeErr has .toString or .stack, print it
      try { console.error('[server] nativeErr.stack?', nativeErr && (nativeErr as any).stack); } catch {}
      // try fallback: pick a random free port (0)
      try {
        console.log('[server] trying fallback start with port 0');
        server = new StaticServer(0, WWW_ROOT, { localOnly: true });
        const url2 = await server.start();
        console.log('[server] fallback server started at', url2);
        return url2;
      } catch (fallbackErr) {
        console.error('[server] fallback start failed', fallbackErr);
        throw nativeErr; // rethrow to let caller handle
      }
    }
  } catch (err) {
    console.error('[server] startServer top-level error', err);
    throw err;
  }
};

export const stopServer = () => {
  try {
    if (server) {
      server.stop();
      console.log('[server] Local server stopped');
      server = null;
    }
  } catch (err) {
    console.warn('[server] stopServer error', err);
  }
};
