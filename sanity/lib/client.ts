import { createClient } from 'next-sanity'

export const client = createClient({
    projectId: 'jvb00i6p', // Get this from your studio-strang folder (in sanity.config.ts or sanity.cli.ts)
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
})