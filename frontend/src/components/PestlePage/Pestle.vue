<template>
    <div class="pestle-container">
        <div class="pestle-card">
            <div>
                <!-- User Input Section -->
                <details class="section user-input-section" open="">
                    <summary class="section-header">
                        <div class="section-title-container">
                            <div class="section-icon user-icon">
                                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                </svg>
                            </div>
                            <div class="section-title">
                                <div class="status-indicator"></div>
                                <h2>Đầu vào từ người dùng</h2>
                            </div>
                        </div>
                    </summary>
                    <div class="section-content">
                        <div class="form-group">
                            <label class="form-label">
                                Ngành đã chọn<span class="required">*</span>
                            </label>
                            <input type="text" class="form-input" :value="industry" readonly />
                        </div>
                    </div>
                </details>

                <!-- Initial Loading State -->
                <div v-if="initialLoading" class="initial-loading">
                    <div class="spinner"></div>
                    <p>Đang phân tích ngành {{ industry }}...</p>
                </div>

                <!-- Sequential Analysis Sections -->
                <div v-else>
                    <div v-for="(category, index) in orderedCategories" :key="category" class="analysis-section">
                        <AnalysisSection v-if="visibleCategories.includes(category)"
                            :ref="el => { if (el) sectionRefs[category] = el }"
                            :title="'Phân tích ' + getTranslatedTitle(category)"
                            :description="analysisResults[category]?.description || ''"
                            :sections="analysisResults[category]?.sections || []" :icon-path="getIconPath(category)"
                            :info-icon-path="getInfoIconPath()" :info-text="getInfoText(category)"
                            :loading="(currentCategory === category && !analysisResults[category]?.description) || regeneratingCategory === category"
                            @regenerate="regenerateCategory(category)" @copy="copyCategory(category)"
                            @section-complete="onSectionComplete(category)" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent, reactive, ref, watch, nextTick } from "vue";
import AnalysisSection from "./AnalysisSection.vue";
import { generateAndProcessRemainingPestleAnalysis, fetchPestleCategoryData, getPESTLECategories } from "./pestle.js";

export default defineComponent({
    name: "Pestle",
    components: {
        AnalysisSection,
    },
    props: {
        industry: {
            type: String,
            required: true,
        },
    },
    setup(props) {
        const orderedCategories = getPESTLECategories();
        const analysisResults = reactive({});
        const initialLoading = ref(true);
        const currentCategory = ref('');
        const visibleCategories = ref([]);
        const regeneratingCategory = ref(null);
        const sectionRefs = ref({});

        const scrollToSection = (category) => {
            nextTick(() => {
                const sectionElement = sectionRefs.value[category]?.$el;
                if (sectionElement) {
                    sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        };

        const startAnalysis = async () => {
            try {
                initialLoading.value = true;
                visibleCategories.value = [];
                // Clear previous results
                for (const cat of orderedCategories) {
                    delete analysisResults[cat];
                }
                sectionRefs.value = {};

                // Fetch and display the Political category first
                currentCategory.value = 'Political';
                const politicalResult = await fetchPestleCategoryData(props.industry, 'Political');
                analysisResults['Political'] = politicalResult;

                initialLoading.value = false;
                visibleCategories.value = ['Political'];

                // Asynchronously fetch the remaining categories in the background
                generateAndProcessRemainingPestleAnalysis(props.industry)
                    .then(remainingResults => {
                        Object.entries(remainingResults).forEach(([category, result]) => {
                            analysisResults[category] = {
                                description: result.summary,
                                sections: (result.sections || []).map(section => ({
                                    heading: section.heading || "Không có tiêu đề",
                                    items: (section.key_points || []).map(kp => ({
                                        highlight: kp.highlight || "",
                                        text: kp.text || "Không có nội dung"
                                    }))
                                }))
                            };
                        });
                    })
                    .catch(error => {
                        console.error("Error fetching remaining PESTLE categories:", error);
                        orderedCategories.forEach(cat => {
                            if (cat !== 'Political' && !analysisResults[cat]) {
                                analysisResults[cat] = { error: true, description: `Failed to load ${cat}.`, sections: [] };
                            }
                        });
                    });

            } catch (error) {
                console.error("Error in initial analysis (Political):", error);
                initialLoading.value = false;
                analysisResults['Political'] = { error: true, description: "Failed to load Political analysis.", sections: [] };
            }
        };

        const onSectionComplete = (completedCategory) => {
            const currentIndex = orderedCategories.indexOf(completedCategory);
            if (currentIndex < orderedCategories.length - 1) {
                const nextCategory = orderedCategories[currentIndex + 1];
                if (!visibleCategories.value.includes(nextCategory)) {
                    currentCategory.value = nextCategory; // Update for loading state and scrolling
                    visibleCategories.value.push(nextCategory);
                }
            }
        };

        const regenerateCategory = async (category) => {
            if (!category) return;
            currentCategory.value = category;
            regeneratingCategory.value = category;

            try {
                const result = await fetchPestleCategoryData(props.industry, category);
                // Ensure the specific category object exists before assigning properties
                if (!analysisResults[category]) {
                    analysisResults[category] = {};
                }
                // Reset the specific category data before assigning new results
                analysisResults[category].description = '';
                analysisResults[category].sections = []; // Changed from headings and items
                // Assign new results after a short delay to allow UI update
                await new Promise(resolve => setTimeout(resolve, 50)); // Small delay
                analysisResults[category] = result;
            } catch (error) {
                console.error(`Error regenerating ${category} analysis:`, error);
                alert(`Tạo lại phân tích ${category} thất bại. Vui lòng thử lại.`);
            } finally {
                regeneratingCategory.value = null; // Reset loading state after API call (success or fail)
            }
        };

        // Watch for the current category changing (sequential loading)
        watch(currentCategory, (newCategory) => {
            if (newCategory && !initialLoading.value) {
                scrollToSection(newCategory);
            }
        });

        // Watch for regeneration starting
        watch(regeneratingCategory, (newRegenCategory) => {
            if (newRegenCategory) {
                scrollToSection(newRegenCategory);
            }
        });

        const getIconPath = (category) => {
            const icons = {
                Political: "M4 10h3v7H4zm6.5 0h3v7h-3zM2 19h19v3H2zm13.5-9h3v7h-3zm-5-9L2 6v2h19V6z",
                Economic: "M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z",
                Social: "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z",
                Technological: "M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z",
                Legal: "M1 21h12v2H1zM5.24 8.07l-2.12 2.12 6.01 6.01 2.12-2.12zM8.07 5.24L5.95 7.36l6.01 6.01 2.12-2.12zM12.36 15.48l-6.01-6.01 2.12-2.12 6.01 6.01zM15.19 12.66l-6.01-6.01 2.12-2.12 6.01 6.01zM21.5 8.5L18 5l-3.54 3.54 3.5 3.5z",
                Environmental: "M17 12h2L12 2 5.05 12H7l-3.9 6h6.92v4h3.96v-4H21z"
            };
            return icons[category] || "";
        };

        const getInfoIconPath = () => {
            return "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z";
        };

        const getInfoText = (category) => {
            return `Phần này trình bày các yếu tố ${getTranslatedTitle(category).toLowerCase()} ảnh hưởng đến ngành ${props.industry}.`;
        };

        const getTranslatedTitle = (category) => {
            const translations = {
                Political: "Political - Chính trị",
                Economic: "Economic - Kinh tế",
                Social: "Social - Xã hội",
                Technological: "Technological - Công nghệ",
                Legal: "Legal - Pháp lý",
                Environmental: "Environmental - Môi trường",
            };
            return translations[category] || category;
        };

        const copyCategory = (category) => {
            const data = analysisResults[category];
            if (!data) return;

            const textToCopy = `## ${getTranslatedTitle(category)} Analysis\n\n${data.description || ''}\n\n` +
                (data.sections?.length > 0 ? data.sections.map(section =>
                    `### ${section.heading}\n${section.items.map(item =>
                        `• ${item.highlight ? `**${item.highlight}:** ` : ''}${item.text}`
                    ).join('\n')}`
                ).join('\n\n') : '');

            navigator.clipboard.writeText(textToCopy)
                .then(() => alert(`Phân tích ${getTranslatedTitle(category)} đã được sao chép vào clipboard!`))
                .catch(err => {
                    console.error('Lỗi sao chép văn bản: ', err);
                    alert(`Sao chép phân tích ${getTranslatedTitle(category)} thất bại.`);
                });
        };

        startAnalysis();

        return {
            orderedCategories,
            analysisResults,
            initialLoading,
            currentCategory,
            visibleCategories,
            regeneratingCategory,
            sectionRefs, // Expose refs
            onSectionComplete,
            regenerateCategory,
            getIconPath,
            getInfoIconPath,
            getInfoText,
            getTranslatedTitle,
            copyCategory,
        };
    },
});
</script>

<style scoped>
/* General Container */
.pestle-container {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #f9f9f9;
    max-width: 900px;
    margin: 20px auto;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.pestle-card {
    background-color: #ffffff;
    border-radius: 8px;
    padding: 25px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

/* Section Styling */
.section {
    margin-bottom: 25px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    overflow: hidden;
    /* Ensures content stays within borders */
    transition: box-shadow 0.3s ease;
}

.section:hover {
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.section-header {
    display: flex;
    align-items: center;
    padding: 15px 20px;
    background-color: #f5f7fa;
    /* Slightly different background for header */
    cursor: pointer;
    border-bottom: 1px solid #e0e0e0;
    transition: background-color 0.3s ease;
}

.section-header:hover {
    background-color: #e9edf1;
}

.section-title-container {
    display: flex;
    align-items: center;
    flex-grow: 1;
}

.section-icon {
    margin-right: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: #e3f2fd;
    /* Light blue background for icon */
    color: #1e88e5;
    /* Blue icon color */
}

.section-icon .icon {
    width: 20px;
    height: 20px;
}

.user-icon {
    background-color: #e8f5e9;
    /* Light green for user */
    color: #43a047;
}

.section-title {
    display: flex;
    align-items: center;
}

.section-title h2 {
    margin: 0;
    font-size: 1.15em;
    font-weight: 600;
    color: #333;
}

.status-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #ccc;
    /* Default grey */
    margin-right: 10px;
    transition: background-color 0.3s ease;
}

/* Add specific status colors if needed */

.section-content {
    padding: 20px;
    background-color: #ffffff;
}

/* Form Elements */
.form-group {
    margin-bottom: 15px;
}

.form-label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #555;
    font-size: 0.95em;
}

.form-input {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 1em;
    box-sizing: border-box;
    background-color: #fdfdfd;
}

.form-input:read-only {
    background-color: #f0f0f0;
    cursor: not-allowed;
}

.required {
    color: #e53935;
    /* Red color for required asterisk */
    margin-left: 4px;
}

/* Loading State */
.initial-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    text-align: center;
    color: #555;
}

.spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border-left-color: #1e88e5;
    /* Blue spinner */
    animation: spin 1s ease infinite;
    margin-bottom: 15px;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

/* Analysis Section specific margin */
.analysis-section {
    margin-bottom: 20px;
    /* Space between analysis sections */
}

/* Details marker */
details>summary {
    list-style: none;
    /* Remove default marker */
}

details>summary::-webkit-details-marker {
    display: none;
    /* Remove default marker for Chrome/Safari */
}

details>summary::before {
    content: '►';
    /* Collapsed state */
    margin-right: 8px;
    font-size: 0.8em;
    transition: transform 0.2s ease-in-out;
    display: inline-block;
}

details[open]>summary::before {
    transform: rotate(90deg);
    /* Expanded state */
}
</style>