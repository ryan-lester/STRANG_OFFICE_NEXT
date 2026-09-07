import { client } from '@/sanity/lib/client';
import InteriorsListClient from './InteriorsListClient';

export const revalidate = 60;

export default async function InteriorsPage() {
    // Optimized query: Only fetches what is needed for the list view, importantly the 'slug'
    const query = `*[_type == "interiors"] | order(_createdAt desc) {
        _id,
        title,
        location,
        slug,
        "coverPhoto": titlePhoto.asset->url
    }`;

    const projects = await client.fetch(query);

    return <InteriorsListClient projects={projects} />;
}