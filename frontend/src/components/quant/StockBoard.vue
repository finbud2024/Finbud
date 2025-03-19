<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-dropdown
        trigger="click"
        :options="marketOptions"
        :render-label="renderLabel"
        @select="handleSelect"
    >
      <n-button class="market-button">
        <span>Market</span>
        <img
            :src="`https://s3-symbol-logo.tradingview.com/country/${selectedKey}.svg`"
            class="country-icon"
        />
        <span class="selected-flag">{{ selectedKey }}</span>
        <n-icon class="selected-icon" size="20">
          <img src="@/assets/ChevronArrowDown.svg" alt="" />
        </n-icon>
      </n-button>
    </n-dropdown>
    <n-data-table
        :columns="columns"
        :data="stocks"
        :bordered="true"
        :loading="loading"
        :max-height="600"
        :scroll-x="`${width < 820 ? 1600 : 0}`"
    />
    <div
        class="pagination"
        :class="`${width < 600 ? 'justify-center' : 'justify-end'}`"
    >
      <n-pagination
          v-model:page="paginationReactive.page"
          v-model:page-size="paginationReactive.pageSize"
          :page-count="paginationReactive.pageCount"
          :page-sizes="paginationReactive.pageSizes"
          :page-slot="pageSlot"
          @update:page="fetchStocks"
          @update:page-size="handlePageSizeChange"
          :show-size-picker="showSizePicker"
          :show-quick-jumper="showQuickJumper"
      />
    </div>
  </n-config-provider>
</template>

<script>
import { ref, reactive, computed, h, onMounted } from "vue";
import axios from "axios";
import {
  NConfigProvider,
  NDataTable,
  NPagination,
  NIcon,
  NDropdown,
  NButton,
} from "naive-ui";
import { useWindowSize } from "@vueuse/core";
import SearchIcon from "@/assets/Search.svg";
import CloseIcon from "@/assets/Close.svg";
import AscIcon from "@/assets/ArrowUp.svg";
import DescIcon from "@/assets/ArrowDown.svg";
import DefaultSortIcon from "@/assets/ArrowDown.svg";

export default {
  components: {
    NConfigProvider,
    NDataTable,
    NPagination,
    NIcon,
    NDropdown,
    NButton,
  },
  data() {
    return {
      themeOverrides: {
        common: {
          primaryColor: "#007bff",
          primaryColorHover: "#3A36ADFF",
          primaryColorPressed: "#3A36ADFF",
        },
      },
      stocks: [],
      loading: true,
      searchMode: false,
      searchQuery: "",
      selectedMarket: "india",
      selectedKey: "IN",
      sortOrder: null,
      sortBy: null,
      paginationReactive: reactive({
        page: 1,
        pageSize: 10,
        pageCount: 10,
        pageSizes: [5, 10, 20, 35, 50],
        totalCount: 0,
      }),
      marketOptions: [
        { label: "USA", market: "america", key: "US" },
        { label: "India", market: "india", key: "IN" },
        { label: "Germany", market: "germany", key: "GE" },
        { label: "Japan", market: "japan", key: "JP" },
        { label: "Canada", market: "canada", key: "CA" },
        { label: "Hong Kong, China", market: "hongkong", key: "HK" },
        { label: "United Kingdom", market: "uk", key: "UK" },
      ],
    };
  },
  computed: {
    width() {
      return useWindowSize().width;
    },
    pageSlot() {
      return this.width < 600 ? 3 : 7;
    },
    showSizePicker() {
      return this.width >= 600;
    },
    showQuickJumper() {
      return this.width >= 600;
    },
    columns() {
      return [
        {
          title: this.searchMode
              ? h("div", { class: "search-stock-input" }, [
                h("img", {
                  src: SearchIcon,
                  class: "icon",
                  onClick: () => (this.searchMode = true),
                }),
                h("input", {
                  type: "text",
                  placeholder: "Search.svg...",
                  onInput: (e) => (this.searchQuery = e.target.value),
                  onKeyup: (e) => e.key === "Enter" && this.handleSearch(),
                }),
                h("img", {
                  src: CloseIcon,
                  class: "icon",
                  onClick: () => {
                    this.searchQuery = "";
                    this.searchMode = false;
                    this.handleSearch();
                  },
                }),
              ])
              : h("div", { class: "search-stock-header" }, [
                h("img", {
                  src: SearchIcon,
                  class: "icon",
                  onClick: () => (this.searchMode = true),
                }),
                h(
                    "span",
                    {},
                    `Stock Ticker / ${this.paginationReactive.totalCount}`
                ),
                h("img", {
                  src:
                      this.sortOrder === "asc"
                          ? AscIcon
                          : this.sortOrder === "desc"
                              ? DescIcon
                              : DefaultSortIcon,
                  class: "icon sort-icon",
                  onClick: this.toggleSort,
                }),
              ]),
          key: "name",
          align: "left",
          fixed: "left",
          width: this.width < 600 ? 200 : 300,
          sortable: false,
          render: (row) =>
              h("div", { class: "flex items-center" }, [
                row.logo
                    ? h("img", {
                      src: `https://s3-symbol-logo.tradingview.com/${row.logo}.svg`,
                      alt: row.name,
                      class: "stock-logo",
                    })
                    : h("span", { class: "stock-logo logo-invalid" }),
                h("span", { class: "stock-ticker-name" }, row.name),
              ]),
        },
        {
          title: "Close",
          key: "close",
          align: "right",
          sortable: true,
          sorter: (a, b) => a.close - b.close,
          render: (row) => `${row.close} ${row.priceCurrency}`,
        },
        {
          title: "Change %",
          key: "priceChange",
          align: "right",
          sortable: true,
          sorter: (a, b) => a.priceChange - b.priceChange,
          render(row) {
            return h(
                "span",
                {
                  style: `color: ${row.priceChange < 0 ? "red" : "green"}`,
                },
                `${row.priceChange < 0 ? "" : "+"}${(
                    row.priceChange * 100
                ).toFixed(2)} %`
            );
          },
        },
        {
          title: "Relative Volume",
          key: "relativeVolume",
          align: "right",
          sortable: true,
          sorter: (a, b) => a.relativeVolume - b.relativeVolume,
          render: (row) =>
              row.relativeVolume ? row.relativeVolume.toFixed(2) : "-",
        },
        {
          title: "P/E Ratio TTM",
          key: "PERatio",
          align: "right",
          sortable: true,
          sorter: (a, b) => a.PERatio - b.PERatio,
          render: (row) => (row.PERatio ? row.PERatio.toFixed(2) : "-"),
        },
        {
          title: "EPS Diluted TTM",
          key: "EPS",
          align: "right",
          sortable: true,
          sorter: (a, b) => a.EPS - b.EPS,
          render: (row) =>
              row.EPS ? `${row.EPS.toFixed(2)} ${row.priceCurrency}` : "-",
        },
        {
          title: "Div Yield % TTM",
          key: "dividendYield",
          align: "right",
          sortable: true,
          sorter: (a, b) => a.dividendYield - b.dividendYield,
          render: (row) =>
              row.dividendYield ? `${row.dividendYield.toFixed(2)}%` : "-",
        },
        {
          title: "Sector",
          key: "sector",
          align: "left",
          sortable: true,
          sorter: (a, b) => a.sector.localeCompare(b.sector),
          render(row) {
            return h(
                "a",
                {
                  href: "#",
                  target: "_blank",
                  style: "text-decoration: none; color: blue",
                },
                row.sector
            );
          },
        },
      ];
    },
  },
  methods: {
    handleSelect(key) {
      const selected = this.marketOptions.find((item) => item.key === key);
      if (selected) {
        this.selectedMarket = selected.market;
        this.selectedKey = selected.key;
        this.fetchStocks();
      }
    },
    toggleSort() {
      if (this.sortOrder === "asc") {
        this.sortBy = "name";
        this.sortOrder = "desc";
      } else if (this.sortOrder === "desc") {
        this.sortBy = null;
        this.sortOrder = null;
      } else {
        this.sortBy = "name";
        this.sortOrder = "asc";
      }
      this.fetchStocks();
    },
    handlePageSizeChange(pageSize) {
      this.paginationReactive.pageSize = pageSize;
      this.paginationReactive.page = 1;
      this.fetchStocks();
    },
    handleSearch() {
      console.log(this.searchQuery);
      this.fetchStocks();
    },
    async fetchStocks() {
      this.loading = true;
      try {
        const api = `${process.env.VUE_APP_DEPLOY_URL}/api/stocks`
        const response = await axios.get(api, {
          params: {
            page: this.paginationReactive.page,
            pageSize: this.paginationReactive.pageSize,
            search: this.searchQuery,
            markets: this.selectedMarket,
            sortBy: this.sortBy,
            sortOrder: this.sortOrder,
          },
        });

        this.stocks = response.data.stocks;
        this.paginationReactive.pageCount = response.data.totalPages;
        this.paginationReactive.totalCount = response.data.totalCount;
      } catch (error) {
        console.error("Error fetching stocks:", error);
      } finally {
        this.loading = false;
      }
    },
    renderLabel(option) {
      return h(
          "div",
          { style: "display: flex; align-items: center; gap: 8px" },
          [
            h("img", {
              style: "width: 24px; height: 24px; border-radius: 50%",
              src: `https://s3-symbol-logo.tradingview.com/country/${option.key}.svg`,
            }),
            h("span", {}, option.label),
          ]
      );
    },
  },
  mounted() {
    this.fetchStocks();
  },
};
</script>


<style scoped>
:deep(.flex) {
  display: flex;
}
:deep(.items-center) {
  align-items: center;
}
.justify-center {
  justify-content: center;
}
.justify-end {
  justify-content: end;
}
:deep(.stock-logo) {
  width: 24px;
  height: 24px;
  margin-right: 8px;
  border-radius: 50%;
}
:deep(.stock-logo.logo-invalid) {
  background-color: #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
}
:deep(.n-data-table-tr:hover .stock-ticker-name) {
  background-color: #007bff;
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
}
:deep(.stock-ticker-name) {
  font-weight: 600;
  background-color: #eeeeee;
  color: #000;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.3s, color 0.3s;
}
:deep(.n-data-table-thead .n-data-table-th) {
  height: 4rem;
  color: #6e6e6e;
}
:deep(.n-data-table-th:not(:first-child) .n-base-icon) {
  visibility: hidden;
  transition: all 0.2s;
  opacity: 0;
  color: #999;
}
:deep(.n-data-table-th:hover .n-base-icon) {
  visibility: visible;
  opacity: 1;
}
:deep(.n-data-table-th .n-base-icon:hover) {
  color: #007bff;
}
:deep(.n-data-table-th:hover) {
  background-color: rgb(245, 245, 245) !important;
  transition: background 0.3s;
}
:deep(.n-data-table-table .n-data-table-tr) {
  font-weight: 600;
}
.search-stock-header {
  display: flex;
  align-items: center;
  gap: 6px;
}
.search-stock-header .icon {
  width: 1.25rem;
  cursor: pointer;
}
:deep(.search-stock-header .sort-icon) {
  width: 1rem;
}
.search-stock-input {
  width: 100%;
  padding: 0;
  display: flex;
  border-radius: 8px;
  border: 2px solid;
  background: #fff;
}
:deep(.search-stock-input input) {
  width: 100%;
  padding: 0.25rem 0;
  outline: none;
  border: none;
}
:deep(.search-stock-input .icon) {
  width: 1.25rem;
  padding: 0.25rem 0.5rem;
}
:deep(.search-stock-input:focus-within) {
  border-color: #007bff;
}
.market-button {
  margin-bottom: 8px;
}
.market-button .country-icon {
  border-radius: 50%;
  width: 24px;
  height: 24px;
}
.market-button .country-icon,
.selected-flag {
  margin-left: 8px;
}
:deep(.n-icon.selected-icon) {
  margin-left: 8px;
}
:deep(.n-dropdown-otpion .select-option) {
  display: flex;
  align-items: center;
  gap: 8px;
}
.pagination {
  margin-top: 8px;
  display: flex;
}
</style>
