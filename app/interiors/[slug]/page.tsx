import { client } from '@/sanity/lib/client';
import ProjectDetailClient from './ProjectDetailClient';
import { notFound } from 'next/navigation';

export const revalidate = 60;

// 1. Update the type to expect a Promise
export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {

    // 2. Await the params to extract the actual string
    const resolvedParams = await params;
    const currentSlug = resolvedParams.slug;

    const query = `*[_type == "interiors" && slug.current == $slug][0]{
        title,
        description,
        location,
        dateCompleted,
        squareFootage,
        "coverPhoto": titlePhoto.asset->url,
        "images": gallery[].asset->url
    }`;

    // 3. Pass the resolved slug to Sanity
    const project = await client.fetch(query, { slug: currentSlug });

    if (!project) {
        notFound();
    }

    return <ProjectDetailClient project={project} />;
}