import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://donote.site';

    // 정적 페이지
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/widget`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/terms`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
    ];

    // 동적 크리에이터 페이지 (실제 DB에서 조회)
    let creatorRoutes: MetadataRoute.Sitemap = [];

    try {
        const { data: creators } = await supabase
            .from('creators')
            .select('handle, updated_at')
            .limit(100);

        if (creators) {
            creatorRoutes = creators.map(creator => ({
                url: `${baseUrl}/${creator.handle}`,
                lastModified: new Date(creator.updated_at),
                changeFrequency: 'weekly' as const,
                priority: 0.6,
            }));
        }
    } catch (error) {
        console.error('Sitemap 생성 중 에러:', error);
    }

    return [...staticRoutes, ...creatorRoutes];
}
