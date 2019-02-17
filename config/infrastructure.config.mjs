import { InfrastructureConfigObject } from "./support/infrastructure-config-object.mjs";

export const getInfrastructureConfig = async () => new InfrastructureConfigObject({
  internalIp: null
});
