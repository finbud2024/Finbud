// src/composables/useInvestPackages.js
import { reactive, ref } from "vue";
import Ajv from "ajv";
import { GPTService } from "@/services/gptServices";

/* ---------- JSON schema we expect from the model ---------- */
const pkgSchema = {
  type: "array",
  minItems: 3,
  maxItems: 3,
  items: {
    type: "object",
    required: ["key", "name", "desc", "stocks"],
    properties: {
      key: { type: "string", enum: ["bao", "khi", "rua"] },
      name: { type: "string" },
      desc: { type: "string" },
      stocks: {
        type: "array",
        minItems: 7,
        maxItems: 10,
        items: { type: "string" }
      }
    }
  }
};

/* ---------- reactive state ---------- */
const investPackages  = reactive([]);
const loadingPackages = ref(false);
const activePackage   = ref(null);

/* initialise AJV once */
const validate = new Ajv({ allErrors: true }).compile(pkgSchema);

/* ---------- fetch packages from GPT ---------- */
async function loadInvestPackages () {
  loadingPackages.value = true;
  const today = new Date().toISOString().split("T")[0];

  try {
    /* Use Gemini directly – avoids OpenAI 400 problem, keeps schema check */
    const raw = await GPTService.generateStructuredJson({
      provider    : "gemini",
      messages    : [
        {
          role   : "system",
          content: `Bạn là AutoTrade AI. Hãy xuất JSON thuần gồm 3 gói 'bao','khi','rua'` +
                   ` với key,name,desc và stocks (7-10 mã CP) theo mức rủi ro. Ngày: ${today}.`
        }
      ],
      json_schema : pkgSchema          // Gemini supports this
    });

    const data = typeof raw === "string" ? JSON.parse(raw) : raw;

    if (!validate(data)) {
      console.warn("❌ JSON trả về sai schema:", validate.errors);
      return;                           // keep list empty, UI sẽ hiển thị “Đang tải…”
    }

    investPackages.splice(0, investPackages.length, ...data);
    console.info("✅ Investment packages loaded:", data);
  } catch (err) {
    console.error("Không lấy được gói đầu tư từ GPT:", err);
  } finally {
    loadingPackages.value = false;
  }
}

/* ---------- selection helper ---------- */
function selectPackage (key) {
  activePackage.value =
    activePackage.value === key ? null : key;
  return (
    investPackages.find(p => p.key === activePackage.value) ||
    null
  );
}

/* ---------- composable API ---------- */
export function useInvestPackages () {
  return {
    investPackages,
    loadingPackages,
    activePackage,
    loadInvestPackages,
    selectPackage
  };
}
