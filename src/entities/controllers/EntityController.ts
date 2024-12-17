export interface EntityController {
    isExternal(): boolean;
    match(toMatch: EntityController): boolean;
    drop(): string;
    create(): string;
    alterDrop(target: EntityController): string;
    alterCreate(current: EntityController): string;
    getDependencies(): string[];
}
