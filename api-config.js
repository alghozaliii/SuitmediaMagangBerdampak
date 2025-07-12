// API Configuration for Suitmedia Backend
class SuitmediaAPI {
    constructor() {
        this.baseURL = 'https://suitmedia-backend.suitdev.com/api';
        this.timeout = 10000; // 10 seconds
    }

    async fetchIdeas(params = {}) {
        const {
            page = 1,
            size = 10,
            sort = '-published_at'
        } = params;

        try {
            // Construct URL with proper parameters
            const url = new URL(`${this.baseURL}/ideas`);
            url.searchParams.append('page[number]', page);
            url.searchParams.append('page[size]', size);
            url.searchParams.append('append[]', 'small_image');
            url.searchParams.append('append[]', 'medium_image');
            url.searchParams.append('sort', sort);

            console.log('API Request URL:', url.toString());

            // Create abort controller for timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeout);

            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'User-Agent': 'SuitmediaLandingPage/1.0'
                },
                mode: 'cors',
                credentials: 'omit',
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            
            if (!data || !data.data) {
                throw new Error('Invalid API response structure');
            }

            return {
                success: true,
                data: data.data,
                meta: data.meta || {},
                message: 'Data loaded successfully'
            };

        } catch (error) {
            console.error('API Error:', error);
            
            return {
                success: false,
                error: error.message,
                data: null,
                meta: null
            };
        }
    }

    // Fallback sample data
    getSampleData(page = 1, size = 10, sort = '-published_at') {
        const sampleIdeas = [
            {
                id: 1,
                title: "Kenali Tingkatan Influencers berdasarkan Jumlah Followers",
                published_at: "2023-12-01T10:00:00Z",
                small_image: [{ url: "https://picsum.photos/300/200?random=1" }],
                medium_image: [{ url: "https://picsum.photos/400/250?random=1" }]
            },
            {
                id: 2,
                title: "Jangan Asal Pilih Influencer, Berikut Cara Menyusun Strategi Influencer Marketing yang Tepat",
                published_at: "2023-11-28T15:30:00Z",
                small_image: [{ url: "https://picsum.photos/300/200?random=2" }],
                medium_image: [{ url: "https://picsum.photos/400/250?random=2" }]
            },
            // ... more sample data
        ];

        // Sort and paginate
        const sorted = sort === 'published_at' 
            ? sampleIdeas.sort((a, b) => new Date(a.published_at) - new Date(b.published_at))
            : sampleIdeas.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));

        const startIndex = (page - 1) * size;
        const endIndex = startIndex + size;
        const paginatedData = sorted.slice(startIndex, endIndex);

        return {
            success: true,
            data: paginatedData,
            meta: {
                current_page: page,
                last_page: Math.ceil(sampleIdeas.length / size),
                per_page: size,
                total: sampleIdeas.length
            },
            message: 'Sample data loaded'
        };
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SuitmediaAPI;
} else {
    window.SuitmediaAPI = SuitmediaAPI;
}
