import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  timeout: 90000
});

export async function getVoices() {
  const { data } = await api.get("/voices");
  return data.voices;
}

export async function generateSpeech(payload) {
  const { data } = await api.post("/tts", payload);
  return data;
}
