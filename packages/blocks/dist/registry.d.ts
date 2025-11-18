import type { LayoutBlock } from './types';
type RegistryType = {
    [K in LayoutBlock['type']]: React.FC<Extract<LayoutBlock, {
        type: K;
    }>['props']>;
};
export declare const blockRegistry: RegistryType;
export {};
//# sourceMappingURL=registry.d.ts.map