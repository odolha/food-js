import { equalTo, having } from "../../common/utils/predicate.mjs";

export const actionRoute = (actionCode, route) => ({
  on: having('actionCode', equalTo(actionCode)),
  route: ({ data }) => route(data, actionCode)
});

export const correlatedActionRoute = (actionCode, route) => ({
  on: having('actionCode', equalTo(actionCode)).and(having('correlationId')),
  route: async ({data, correlationId}) => ({ data: await route(data, actionCode, correlationId), correlationId })
});
