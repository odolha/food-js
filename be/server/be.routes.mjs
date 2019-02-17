import { pingRoute } from "./routes/ping.route.mjs";

export const beRoutes = [
  { on: 'ping', route: pingRoute },
  // actionRoute('sync', syncRoute),
  // actionRoute('boot', bootRoute),
  // correlatedActionRoute('fetchAllUnits', fetchAllUnitsRoute),
];
