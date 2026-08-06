export type AppScriptResponse<T = unknown> = {
  status: "success" | "error";
  message?: string;
  data?: T;
};

export async function handleAppScriptResponse<T>(
  response: Response,
): Promise<AppScriptResponse<T>> {
  if (!response.ok) {
    if (response.status >= 500) {
      throw new Error(
        "The request reached the server, but an internal server error occurred.",
      );
    }

    if (response.status >= 400) {
      throw new Error("The request could not be processed. Please try again.");
    }

    throw new Error("Unexpected server response.");
  }

  const result = (await response.json()) as AppScriptResponse<T>;

  if (result.status === "error") {
    throw new Error(result.message || "Operation failed.");
  }

  return result;
}
