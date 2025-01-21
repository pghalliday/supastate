import {DateTime} from 'luxon';

const TIMESTAMP_FORMAT = 'yyyyMMddHHmmss';

function escapeRegex(string: string): string {
    return string.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
}

function suffix(name: string): string {
    return `_${name}.sql`;
}

function timestampedRegex(name: string): RegExp {
    return new RegExp(`^(\\d+)${escapeRegex(suffix(name))}$`);
}

export function now(): string {
    return DateTime.now().setZone('utc').toFormat(TIMESTAMP_FORMAT);
}

export function timestampedFileName(timestamp: string, name: string): string {
    return `${timestamp}${suffix(name)}`;
}

export function toISO(timestamp: string): string {
    return <string>DateTime.fromFormat(timestamp, TIMESTAMP_FORMAT, {zone: 'utc'}).toISO();
}

export function newerThan(timestamp: string, name: string): (filename: string) => boolean {
    const t = DateTime.fromFormat(timestamp, TIMESTAMP_FORMAT, {zone: 'utc'});
    const regex = timestampedRegex(name);
    return (filename: string) => {
        const found = filename.match(regex);
        return found != null && t < DateTime.fromFormat(found[1], TIMESTAMP_FORMAT, {zone: 'utc'});
    }
}
