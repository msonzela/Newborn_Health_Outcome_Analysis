
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  timeout: 15000,
});

export const getOverview = async (region = "") => {
  const response = await api.get("/api/overview", {
    params: region ? { region } : {},
  });
  return response.data;
};

export const getRegions = async () => {
  const response = await api.get("/api/regions");
  return response.data;
};

export const getOutcomes = async (region = "") => {
  const response = await api.get("/api/outcomes", {
    params: region ? { region } : {},
  });
  return response.data;
};

export const getModelPerformance = async () => {
  const response = await api.get("/api/model-performance");
  return response.data;
};

export const predictOutcome = async (payload) => {
  const response = await api.post("/api/predict", payload);
  return response.data;
};
