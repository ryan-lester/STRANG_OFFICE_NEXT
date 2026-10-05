import { client } from '@/sanity/lib/client';
import ProjectDetailClient from './ProjectDetailClient';
import { notFound } from 'next/navigation';

export const revalidate = 60;

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const currentSlug = resolvedParams.slug;

    // Each gallery image now comes with its aspect ratio (Sanity stores it
    // automatically on upload), so the gallery can size rows without cropping.
    const query = `*[_type == "interiors" && slug.current == $slug][0]{
        title,
        description,
        location,
        dateCompleted,
        squareFootage,
        "coverPhoto": titlePhoto.asset->url,
        "images": gallery[]{
            "url": asset->url,
            "aspectRatio": asset->metadata.dimensions.aspectRatio
        }
    }`;

    const project = await client.fetch(query, { slug: currentSlug });

    if (!project) {
        notFound();
    }

    return <ProjectDetailClient project={project} />;
}