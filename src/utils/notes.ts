import type { CollectionEntry } from "astro:content";

type Note = CollectionEntry<"notes">;

export const isRevised = (note: Note): note is Note & { data: { revised: Date } } => !!note.data.revised;

export const dateOf = (note: Note) => isRevised(note) ? note.data.revised : note.data.date;

export const byDateDesc = (a: Note, b: Note) => dateOf(b).valueOf() - dateOf(a).valueOf();

export const hasTag = (tag: string) => {
    return (note: Note) => note.data.tags?.includes(tag);
}