<template>
    <div class="article-wrapper">
        <!-- Error / Not Found -->
        <div v-if="hasError" class="status-message error">
            ❌ Bài viết không tồn tại hoặc đã bị xoá.
            <div class="back-link" @click="router.back()">Quay lại</div>
        </div>

        <!-- Main Article -->
        <div class="article-detail" v-else-if="article">
            <div class="back-link" @click="router.back()">&lt; Quay lại</div>

            <div class="meta">
                <span class="source">
                    <a :href="`https://${article.source}`" target="_blank">{{ article.source }}</a>
                </span>
                · <span class="date">{{ formatDate(article.published_at) }}</span>
            </div>

            <h1 class="title">{{ article.title }}</h1>

            <!-- Tag Filters -->
            <div class="tag-filters" v-if="article.tags?.length">
                <span class="tag-pill" :class="{ active: selectedTags.includes(tag) }" v-for="tag in article.tags"
                    :key="tag" @click="toggleTag(tag)">
                    {{ tag }}
                </span>
            </div>

            <!-- Summary -->
            <div class="summary-box">
                <ul>
                    <li v-for="(bullet, i) in filteredBullets" :key="i" class="sentiment-bullet">
                        <span class="sentiment-icon">{{ sentimentIcon(bullet.sentiment) }}</span>
                        {{ bullet.text }}
                    </li>
                </ul>
            </div>

            <!-- Full Content -->
            <div class="content">
                <template v-for="(block, i) in contentBlocks" :key="i">
                    <p v-if="block.type === 'text'" v-html="block.content"></p>
                    <img v-else-if="block.type === 'image'" :src="block.src" class="main-img" />
                </template>
            </div>

            <!-- Author -->
            <p class="author" v-if="authorName">
                <a :href="article.original_url" target="_blank">{{ authorName }}</a>
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();

const article = ref(null);
const contentBlocks = ref([]);
const isLoading = ref(true);
const hasError = ref(false);
const selectedTags = ref([]);

onMounted(async () => {
    try {
        const { data } = await axios.get(`/.netlify/functions/server/api/ai-news/${route.params.id}`);
        article.value = data;
        contentBlocks.value = processContent(data.content, data.image_urls);
    } catch (err) {
        console.error("❌ Error loading article:", err.message);
        hasError.value = true;
    } finally {
        isLoading.value = false;
    }
});

const formatDate = (iso) => {
    if (!iso) return 'Không rõ ngày';
    const d = new Date(iso);
    return d.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const sentimentIcon = (sentiment) => {
    return {
        positive: '🟢',
        neutral: '🟡',
        negative: '🔴',
    }[sentiment.toLowerCase()] || '⚪';
};

const processContent = (content, images) => {
    const parts = content.split('[[IMAGE]]');
    const result = [];

    parts.forEach((text, index) => {
        result.push({ type: 'text', content: text.trim() });
        if (index < images.length) {
            result.push({ type: 'image', src: images[index] });
        }
    });

    return result;
};

const authorName = computed(() => {
    if (!article.value?.author) return null;
    return article.value.author.trim();
});

const toggleTag = (tag) => {
    if (selectedTags.value.includes(tag)) {
        selectedTags.value = [];
    } else {
        selectedTags.value = [tag];
    }
};

const filteredBullets = computed(() => {
    if (!selectedTags.value.length) return article.value?.bullets || [];
    return article.value?.bullets.filter(bullet =>
        selectedTags.value.every(tag => bullet.tags.includes(tag))
    ) || [];
});
</script>

<style scoped>
.article-wrapper {
    max-width: 1100px;
    margin: 24px auto 24px auto;
    padding: 0 20px;
    font-family: 'Segoe UI', Arial, sans-serif;
}

.article-detail {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);
    padding: 32px 24px 24px 24px;
}

.status-message {
    text-align: center;
    font-size: 18px;
    color: #555;
    padding: 40px 0;
}

.status-message.error {
    color: #c62828;
}

.back-link {
    color: #1976d2;
    font-size: 15px;
    margin-bottom: 12px;
    cursor: pointer;
}

.meta {
    color: #888;
    font-size: 13px;
    margin-bottom: 4px;
}

.meta .source a {
    color: #1976d2;
    text-decoration: none;
}

.title {
    font-size: 2rem;
    font-weight: 700;
    margin: 8px 0 20px 0;
    color: #222;
}

.tag-filters {
    display: flex;
    gap: 10px;
    margin-bottom: 18px;
    margin-top: 2px;
    flex-wrap: wrap;
}

.tag-pill {
    padding: 6px 18px;
    border-radius: 16px;
    background: #f2f6fa;
    color: #1976d2;
    font-weight: 500;
    font-size: 13px;
    cursor: pointer;
    transition: background 0.25s ease, color 0.25s ease;
}

.tag-pill.active {
    background: #1976d2;
    color: #fff;
}

.summary-box {
    background: #e3f2fd;
    border-left: 4px solid #1976d2;
    border-radius: 6px;
    padding: 16px 20px;
    margin-bottom: 28px;
}

.summary-box ul {
    margin: 0;
    padding-left: 18px;
}

.sentiment-bullet {
    display: flex;
    align-items: flex-start;
    gap: 6px;
    margin-bottom: 7px;
    font-size: 15px;
    color: #1a237e;
}

.sentiment-icon {
    font-size: 1.1em;
    margin-top: 2px;
    flex-shrink: 0;
}

.content {
    font-size: 16px;
    color: #222;
    line-height: 1.7;
}

.content p {
    margin-bottom: 16px;
}

.main-img {
    display: block;
    max-width: 100%;
    margin: 18px auto 8px auto;
    border-radius: 8px;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06);
}

.author {
    margin-top: 32px;
    font-size: 15px;
    color: #444;
    text-align: right;
}

.author a {
    color: #1976d2;
    text-decoration: none;
}

@media (min-width: 1200px) {
    .article-wrapper {
        margin-top: 0;
    }

    .article-detail {
        padding: 24px 24px 24px 24px;
    }
}
</style>
