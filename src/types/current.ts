import type { CurrentConnectedApps } from './connect';
import type { IdentityId } from './identity';
import type { CurrentChainNetwork, CurrentIdentityNetwork } from './network';

export interface CurrentInfo {
    current_identity: IdentityId;
    current_chain_network: CurrentChainNetwork;
    current_identity_network: CurrentIdentityNetwork;
    current_connected_apps: CurrentConnectedApps;
}
