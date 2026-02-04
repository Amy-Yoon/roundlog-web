export * from './database.types';

// UI Helper Types
export interface NavItem {
    label: string;
    path: string;
    icon: React.ReactNode;
}

export interface SelectOption {
    value: string;
    label: string;
}
