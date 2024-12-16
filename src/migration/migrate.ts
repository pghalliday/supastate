import _ from "lodash";
import type {EntityControllers} from "../controllers/EntityControllers.js";
import assert from "node:assert";
const {omitBy, keys, forEach, forEachRight, remove, mapValues, pullAll} = _;

function sortIdsByDependencies(entityControllers: EntityControllers): string[] {
    const sortedIds: string[] = [];
    const dependencies = mapValues(
        entityControllers,
        entityController => entityController.getDependencies()
    );
    let idsToSort = keys(dependencies);
    while (idsToSort.length > 0) {
        const noDependencies = remove(idsToSort, id => dependencies[id].length === 0);
        // if there are no entries with no dependencies then we have a circular dependency
        assert(noDependencies.length > 0, 'Circular dependency detected');
        sortedIds.push(...noDependencies);
        // remove the noDependencies ids from the dependency lists
        forEach(idsToSort, (id) => {
            pullAll(dependencies[id], noDependencies);
        });
    }
    return sortedIds;
}

export function migrate(current: EntityControllers, target: EntityControllers): string {
    let sql = '';
    const neCurrent = omitBy(
        current,
        entityController => entityController.isExternal()
    );
    const neTarget = omitBy(
        target,
        entityController => entityController.isExternal()
    );
    const drops: Record<string, string> = {};
    const creates: Record<string, string> = {};
    const createIds = keys(neTarget);
    forEach(keys(neCurrent), (dropId) => {
        const alterIds = remove(
            createIds,
            createId => neCurrent[dropId].match(neTarget[createId])
        )
        if (alterIds.length > 0) {
            assert(alterIds.length === 1);
            const createId = alterIds[0];
            drops[dropId] = neCurrent[dropId].alterDrop(neTarget[createId]);
            creates[createId] = neCurrent[dropId].alterCreate(neTarget[createId]);
        } else {
            drops[dropId] = neCurrent[dropId].drop();
        }
    });
    forEach(createIds, (createId) => {
        creates[createId] = neTarget[createId].create();
    });
    // drop dependents first
    forEachRight(sortIdsByDependencies(current), (dropId) => {
        const drop = drops[dropId];
        if (typeof drop === 'string') {
            sql += drop;
        }
    })
    // create dependencies first
    forEach(sortIdsByDependencies(target), (createId) => {
        const create = creates[createId];
        if (typeof create === 'string') {
            sql += create;
        }
    })
    return sql;
}
