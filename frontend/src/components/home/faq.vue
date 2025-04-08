<template>
  <div class="py-12 sm:py-24 max-w-7xl mx-auto px-4 md:px-8">
    <h2 class="text-center text-2xl sm:text-4xl mb-8 sm:mb-16 font-semibold">
        Frequently Asked Questions
      </h2>
    <div>
      <UAccordion
        color="white"
        :items="faqList"
        size="xl"
        variant="ghost"
        :have-slot="false"
        :ui="{ item: { padding: '' } }"
      >
        <template #default="{ item, open }">
          <UButton
            variant="ghost"
            class="border-gray hover:border-primary-300 text-gray-700 my-2 border border-solid p-6"
            :class="[
              open && 'text-primary-600 border-primary-300 bg-primary-50',
            ]"
          >
            <div class="flex flex-col text-left items-start">
              <span class="text-sm sm:text-base font-medium">{{
                item.label
              }}</span>
              <span
                :class="[
                  'transition-all text-sm sm:text-base text-left duration-300 ease-in-out',
                  open ? 'mt-4 max-h-40 opacity-100' : 'mt-0 max-h-0 opacity-0',
                ]"
                class="overflow-hidden text-gray-700"
              >
                {{ item.answer }}
              </span>
            </div>
          </UButton>
          
        </template>
      </UAccordion>
    </div>
  </div>
</template>
<script setup lang="ts">
const faqList = ref([
  {
    id: "1",
    label:
      "Is FinBud free to use, or are there any subscription plans?",
    answer:
      `FinBud offers both a free package with basic features and a subscription plan for some advanced features. Let’s register to try all the free financial tools of FinBud before looking for more advanced options from us.`,
  },
  {
    id: "2",
    label:
      "What kind of questions can the FinBud chatbot solve?",
    answer:
      "The FinBud chatbot is designed to assist with a wide range of inquiries, covering both financial and non-financial topics. Additionally, the chatbot allows you to directly execute various commands within FinBud's financial management, investment, and educational features. For example, you can buy or sell stocks, manage your budget, or look up financial terms. Simply click on the chat icon and follow the guidance to explore the full capabilities of the FinBud chatbot.",
  },
  {
    id: "3",
    label: `Does FinBud support investment tracking and management?`,
    answer:
      "Yes, our Quant and Simulator pages provide an immersive experience for those exploring advanced finance. You can manage your investment portfolio, access in-depth stock analysis, and even practice real stock trading through our Simulator - perfect for beginners looking to gain hands-on investment experience.",
  },
  {
    id: "4",
    label: `Can I set financial goals with FinBud and track my progress`,
    answer:
      "Absolutely! With FinBud, you can set specific financial goals by defining details such as the category, target date, required amount, and current savings. On the Goal page, we help you stay on track by monitoring your daily transactions and providing detailed charts, ensuring you can reach each goal more effectively.",
  },
  {
    id: "5",
    label: `Is FinBud available on mobile devices, and does it sync across platforms?`,
    answer:
      "Yes, FinBud is available on both mobile devices and laptops. Simply log in to your account, and your data will automatically sync across all platforms for seamless access.",
  },
]);
</script>
