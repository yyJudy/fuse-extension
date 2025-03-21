export interface ChainBscNetwork {
    chain: 'bsc';
    chain_id: 56;
    name: string;
    created: number; // ms
    rpc: string;
}

export const CHAIN_BSC_MAINNET: ChainBscNetwork = {
    chain: 'bsc',
    chain_id: 56,
    name: 'Bsc Mainnet',
    created: 0, // inner, means mainnet
    rpc: 'https://bsc-rpc.publicnode.com',
};
