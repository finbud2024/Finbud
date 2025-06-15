<template>
    <div class="swot-container">
        <div class="swot-card">
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
                                Công ty đã chọn<span class="required">*</span>
                            </label>
                            <input type="text" class="form-input" :value="company" readonly />
                        </div>
                    </div>
                </details>

                <!-- Initial Loading State -->
                <div v-if="initialLoading" class="initial-loading">
                    <div class="spinner"></div>
                    <p>Đang phân tích công ty {{ company }}...</p>
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
                            :paused="paused" :cancelled="cancelled"
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
import { generateAndProcessRemainingSwotAnalysis, fetchSwotCategoryData, getSWOTCategories } from "./swot.js";

export default defineComponent({
    name: "Swot",
    components: {
        AnalysisSection,
    },
    props: {
        company: {
            type: String,
            required: true,
        },
        paused: {
            type: Boolean,
            default: false,
        },
        cancelled: {
            type: Boolean,
            default: false,
        },
    },
    setup(props) {
        const orderedCategories = getSWOTCategories();
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

                // Fetch and display the Strengths category first
                currentCategory.value = 'Strengths';
                const strengthsResult = await fetchSwotCategoryData(props.company, 'Strengths');
                analysisResults['Strengths'] = strengthsResult;

                initialLoading.value = false;
                visibleCategories.value = ['Strengths'];

                // Asynchronously fetch the remaining categories in the background
                generateAndProcessRemainingSwotAnalysis(props.company)
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
                        console.error("Error fetching remaining SWOT categories:", error);
                        orderedCategories.forEach(cat => {
                            if (cat !== 'Strengths' && !analysisResults[cat]) {
                                analysisResults[cat] = { error: true, description: `Failed to load ${cat}.`, sections: [] };
                            }
                        });
                    });

            } catch (error) {
                console.error("Error in initial analysis (Strengths):", error);
                initialLoading.value = false;
                analysisResults['Strengths'] = { error: true, description: "Failed to load Strengths analysis.", sections: [] };
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
                const result = await fetchSwotCategoryData(props.company, category);
                // Ensure the specific category object exists before assigning properties
                if (!analysisResults[category]) {
                    analysisResults[category] = {};
                }
                // Reset the specific category data before assigning new results
                analysisResults[category].description = '';
                analysisResults[category].sections = [];
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
                Strengths: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
                Weaknesses: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z",
                Opportunities: "M12 2l2.09 6.26L20 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
                Threats: "M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"
            };
            return icons[category] || "";
        };

        const getInfoIconPath = () => {
            return "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z";
        };

        const getTranslatedTitle = (category) => {
            const translations = {
                Strengths: "Điểm mạnh",
                Weaknesses: "Điểm yếu",
                Opportunities: "Cơ hội",
                Threats: "Thách thức"
            };
            return translations[category] || category;
        };

        const getInfoText = (category) => {
            const infoTexts = {
                Strengths: "Điểm mạnh của công ty - những yếu tố nội tại giúp công ty có lợi thế cạnh tranh.",
                Weaknesses: "Điểm yếu của công ty - những yếu tố nội tại cần được cải thiện.",
                Opportunities: "Cơ hội từ môi trường bên ngoài - những yếu tố có thể giúp công ty phát triển.",
                Threats: "Thách thức từ môi trường bên ngoài - những yếu tố có thể gây rủi ro cho công ty."
            };
            return infoTexts[category] || "";
        };

        const copyCategory = (category) => {
            const result = analysisResults[category];
            if (result && result.description) {
                let textToCopy = `${getTranslatedTitle(category)} - ${props.company}\n\n`;
                textToCopy += `${result.description}\n\n`;
                
                if (result.sections && result.sections.length > 0) {
                    result.sections.forEach(section => {
                        textToCopy += `${section.heading}\n`;
                        if (section.items && section.items.length > 0) {
                            section.items.forEach(item => {
                                textToCopy += `• ${item.highlight ? item.highlight + ': ' : ''}${item.text}\n`;
                            });
                        }
                        textToCopy += '\n';
                    });
                }

                navigator.clipboard.writeText(textToCopy).then(() => {
                    alert(`Đã sao chép phân tích ${getTranslatedTitle(category)} vào clipboard`);
                }).catch(err => {
                    console.error('Could not copy text: ', err);
                });
            }
        };

        // Watch for company changes
        watch(() => props.company, (newCompany) => {
            if (newCompany) {
                startAnalysis();
            }
        }, { immediate: true });

        // Watch for cancelled state
        watch(() => props.cancelled, (newCancelled) => {
            if (newCancelled) {
                handleCancellation();
            }
        });

        const handleCancellation = () => {
            // Reset all states
            initialLoading.value = false;
            visibleCategories.value = [];
            currentCategory.value = '';
            regeneratingCategory.value = null;
            
            // Clear analysis results
            for (const cat of orderedCategories) {
                delete analysisResults[cat];
            }
            
            // Emit cancellation event
            nextTick(() => {
                // Small delay to ensure UI updates
                setTimeout(() => {
                    // Emit event to parent
                }, 100);
            });
        };

        return {
            orderedCategories,
            analysisResults,
            initialLoading,
            currentCategory,
            visibleCategories,
            regeneratingCategory,
            sectionRefs,
            onSectionComplete,
            regenerateCategory,
            getIconPath,
            getInfoIconPath,
            getTranslatedTitle,
            getInfoText,
            copyCategory
        };
    },
});
</script>

<style scoped>
.swot-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

.swot-card {
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

.section {
    border-bottom: 1px solid #e2e8f0;
}

.section:last-child {
    border-bottom: none;
}

.section-header {
    display: flex;
    align-items: center;
    padding: 1.5rem 2rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.section-header:hover {
    background-color: #f8fafc;
}

.section-title-container {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.section-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: #f8fafc;
    color: #4a5568;
}

.user-icon {
    background: #e6fffa;
    color: #38b2ac;
}

.icon {
    width: 24px;
    height: 24px;
}

.section-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.status-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #48bb78;
}

.section-title h2 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: #2d3748;
}

.section-content {
    padding: 0 2rem 2rem 2rem;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #4a5568;
}

.required {
    color: #e53e3e;
}

.form-input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 0.875rem;
    color: #4a5568;
    background: #f8fafc;
}

.initial-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    color: #4a5568;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #e2e8f0;
    border-top: 4px solid #3182ce;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.analysis-section {
    margin-bottom: 1rem;
}

@media (max-width: 768px) {
    .swot-container {
        padding: 1rem;
    }

    .section-header {
        padding: 1rem;
    }

    .section-content {
        padding: 0 1rem 1rem 1rem;
    }

    .section-title h2 {
        font-size: 1.125rem;
    }
}
</style> 