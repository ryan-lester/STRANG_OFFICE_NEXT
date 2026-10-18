// app/prototype_homepage/page.tsx — prototype home page (server component)
// Uses the same Sanity data as /interiors.

import { client } from '@/sanity/lib/client';
import PrototypeHomepageClient from './PrototypeHomepageClient';

// Same fields as the interiors pages.
// heroVideo is optional: add a file field with that name to the interiors
// schema to show video in the hero (it's simply empty until then).
const query = `*[_type == "interiors"]{
  _id,
  title,
  slug,
  "coverPhoto": titlePhoto.asset->url,
  "images": gallery[]{ "url": asset->url },
  "heroVideo": heroVideo.asset->url
}`;

export const revalidate = 60;

export default async function PrototypeHomepage() {
    const projects = await client.fetch(query);
    return <PrototypeHomepageClient projects={projects ?? []} />;
}