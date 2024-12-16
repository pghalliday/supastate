export interface IEntityController {
    isExternal(): boolean;
    match(toMatch: IEntityController): boolean;
    drop(): string;
    create(): string;
    alterDrop(target: IEntityController): string;
    alterCreate(target: IEntityController): string;
    getDependencies(): string[];
}
