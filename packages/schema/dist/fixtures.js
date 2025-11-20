export const CASE_STUDIES_FIXTURE = [
    {
        id: 'cs-001',
        title: 'Unlocking Federal Grants for a Mid-Sized City',
        slug: 'federal-grants-mid-sized-city',
        client: 'City of Exampleton',
        sector: 'GovContracting',
        year: 2024,
        mechanisms: ['Grant'],
        jurisdictions: ['Local'],
        tags: ['grants', 'capacity', 'ops'],
        heroImageUrl: 'https://placehold.co/1200x600?text=Case+Study+Hero',
        summaryShort: 'Helped a mid-sized city triple their throughput on federal grants without adding headcount.',
        brief: 'We worked with finance and program teams...',
        outcomes: [
            {
                label: '3x grant throughput',
                description: 'Within 12 months, successful submissions tripled.',
                evidenceUrl: 'https://example.com/case-study-evidence',
            }
        ],
        evidence: [
            {
                label: 'OMB report',
                url: 'https://example.com/omb-report.pdf',
            }
        ],
        bodyMDX: '## Background\n\nMore detailed markdown/MDX body here.',
        sections: [
            {
                id: 'context',
                title: 'Context',
                bodyMDX: 'Exampleton had historically under-invested in centralized grants capacity...',
            },
            {
                id: 'approach',
                title: 'Approach',
                bodyMDX: 'We mapped current workflows, identified bottlenecks, and built a simple operating playbook...',
            },
            {
                id: 'results',
                title: 'Results',
                bodyMDX: 'Within a year, throughput tripled and coordination costs fell.',
            },
        ],
        attachments: [
            {
                label: 'Sample Playbook (PDF)',
                url: 'https://example.com/playbook.pdf',
                kind: 'pdf',
                internalOnly: false,
            },
            {
                label: 'Internal workshop deck',
                url: 'https://example.com/internal-deck',
                kind: 'ppt',
                internalOnly: true,
            },
        ],
        links: [
            {
                label: 'Client website',
                url: 'https://exampleton.gov',
                category: 'client',
                internalOnly: false,
            },
            {
                label: 'Grant tracking dashboard (internal)',
                url: 'https://example.com/internal-dashboard',
                category: 'impact',
                internalOnly: true,
            },
            {
                label: 'Related press coverage',
                url: 'https://news.example.com/exampleton-grants',
                category: 'press',
                internalOnly: false,
            },
        ],
        isFeaturedHome: true,
        isPublic: true,
    },
];
