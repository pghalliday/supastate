import assert from "node:assert";
import {now} from "./timestamp.js";
import type {Entities} from "../entities/models/Entities.js";

const CURRENT_VERSION = 0;

export interface Serialized {
    timestamp: string;
    version: number;
    entities: any;
}

export function serialize(entities: Entities): Serialized {
    return {
        timestamp: now(),
        version: CURRENT_VERSION,
        entities,
    }
}

export function deserialize(serialized: Serialized): Entities {
    assert(serialized.version === CURRENT_VERSION);
    return serialized.entities;
}
