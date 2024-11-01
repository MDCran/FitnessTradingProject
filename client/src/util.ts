import qs from "qs";
//
// HTTP stuff
//

type RequestConfig = {
  method: "GET" | "POST" | "PATCH" | "DELETE";
  endpoint: string;
  params?: Record<string, any>;
  body?: Record<string, any>;
};

type ApiShape = {
  error?: string;
  message?: string;
  data?: any;
};

async function fetchApi(config: RequestConfig): Promise<ApiShape> {
  const { method, endpoint, params = {}, body } = config;
  const pathString = endpoint + "?" + qs.stringify(params);
  const args: Record<string, any> = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body) {
    args["body"] = JSON.stringify(body);
  }
  try {
    const res = await fetch(pathString, args);
    const jsonified = await res.json();
    return jsonified;
  } catch (err) {
    return {
      error: `${method} request to ${pathString} failed. ${err}`,
    };
  }
}

export async function get(endpoint: string, params?: Record<string, any>) {
  return fetchApi({ method: "GET", endpoint, params });
}

export async function post(endpoint: string, body?: Record<string, any>) {
  return fetchApi({ method: "POST", endpoint, body });
}

export async function patch(endpoint: string, body?: Record<string, any>) {
  return fetchApi({ method: "PATCH", endpoint, body });
}

export async function del(endpoint: string, params?: Record<string, any>) {
  return fetchApi({ method: "DELETE", endpoint, params });
}
