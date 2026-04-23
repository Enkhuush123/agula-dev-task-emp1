const API_BASE_URL = window.location.protocol.startsWith("http")
  ? "/api"
  : "http://127.0.0.1:5050/api";

async function apiRequest(endpoint, options = {}) {
  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

function showMessage(type, text) {
  const messageBox = document.getElementById("messageBox");
  if (!messageBox) return;

  messageBox.innerHTML = `<div class="message ${type}">${text}</div>`;

  setTimeout(() => {
    messageBox.innerHTML = "";
  }, 3000);
}
