import type { LayoutBlock } from './types';
type RegistryType = {
    [K in LayoutBlock['type']]: React.FC<Extract<LayoutBlock, {
        type: K;
    }>['props']>;
};
export declare const blockRegistry: RegistryType;
export {};
//# sourceMappingURL=dynamicRegistry.d.ts.map