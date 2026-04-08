const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

export async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const contentType = response.headers.get("content-type") || "";

  if (!response.ok) {
    let errorMessage = `Error HTTP ${response.status}`;

    try {
      if (contentType.includes("application/json")) {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } else {
        const errorText = await response.text();
        errorMessage = errorText || errorMessage;
      }
    } catch {
      // dejamos el mensaje por defecto
    }

    throw new Error(errorMessage);
  }

  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

export default API_BASE_URL;