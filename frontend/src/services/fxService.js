// frontend/src/services/fxServices.js
import axios from "axios";

export function getAllFxRates() {
  return axios.get("/api/fx")
              .then(r => r.data);
}

// if you want to fetch a single pair:
export function getFxRate(from, to) {
  return axios.get("/api/fx", {
    params: { fromCurrency: from, toCurrency: to }
  }).then(r => r.data);
}
