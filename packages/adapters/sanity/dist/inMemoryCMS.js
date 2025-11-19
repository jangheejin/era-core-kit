import { CASE_STUDIES_FIXTURE,
//} from '../../schema/src';
 } from '@kit/schema';
function matchesFilter(cs, filter) {
    if (!filter)
        return true;
    if (filter.sector && cs.sector !== filter.sector)
        return false;
    if (filter.tags && filter.tags.length) {
        const tagSet = new Set(cs.tags);
        if (!filter.tags.every((t) => tagSet.has(t)))
            return false;
    }
    if (filter.mechanisms && filter.mechanisms.length) {
        const mechSet = new Set(cs.mechanisms);
        if (!filter.mechanisms.some((m) => mechSet.has(m)))
            return false;
    }
    if (filter.yearRange) {
        const { min, max } = filter.yearRange;
        if (cs.year !== undefined) {
            if (min !== undefined && cs.year < min)
                return false;
            if (max !== undefined && cs.year > max)
                return false;
        }
    }
    if (filter.text) {
        const q = filter.text.toLowerCase();
        const haystack = [
            cs.title,
            cs.summaryShort,
            cs.client ?? '',
            cs.tags.join(' '),
        ]
            .join(' ')
            .toLowerCase();
        if (!haystack.includes(q))
            return false;
    }
    return true;
}
export function createInMemoryCMS() {
    const people = []; // fill later if you want
    return {
        async getCaseStudies({ filter, limit = 20, cursor, sort = 'newest' }) {
            const startIndex = cursor ? parseInt(cursor, 10) || 0 : 0;
            let items = CASE_STUDIES_FIXTURE.filter((cs) => matchesFilter(cs, filter)).filter((cs) => cs.isPublic);
            if (sort === 'newest') {
                items = items.slice().sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
            }
            else if (sort === 'alpha') {
                items = items.slice().sort((a, b) => a.title.localeCompare(b.title));
            }
            const page = items.slice(startIndex, startIndex + limit);
            const nextCursor = startIndex + limit < items.length
                ? String(startIndex + limit)
                : undefined;
            return { items: page, nextCursor };
        },
        async getCaseStudyBySlug(slug) {
            return (CASE_STUDIES_FIXTURE.find((cs) => cs.slug === slug && cs.isPublic) ?? null);
        },
        async getPeople() {
            return people;
        },
        async getPersonBySlug(_slug) {
            return null;
        },
        async getHomeFeaturedCaseStudies(limit) {
            return CASE_STUDIES_FIXTURE.filter((cs) => cs.isPublic && cs.isFeaturedHome).slice(0, limit);
        },
    };
}
