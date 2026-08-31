import { checkRole } from "@/utils/lib/checkRole";
export type AppScriptResponse<T = unknown> = {
  status: "success" | "error";
  message?: string;
  data?: T;
};
export async function handleAppScriptResponse<T>(
  response: Response,
  source = "unknown",
): Promise<AppScriptResponse<T>> {
  const profile = await checkRole();
  const text = await response.text();

  console.log("========== APPSCRIPT RESPONSE ==========");
  console.log("SOURCE:", source);
  console.log("STATUS:", response.status);
  console.log("CONTENT-TYPE:", response.headers.get("content-type"));

  console.log("NAME:", profile?.full_name, "EMAIL:", profile?.email);

  console.log("RESPONSE PREVIEW:", text.slice(0, 100));

  if (!response.ok) {
    throw new Error(
      `Apps Script request failed (${response.status}) from ${source}.`,
    );
  }

  let result: AppScriptResponse<T>;

  try {
    result = JSON.parse(text) as AppScriptResponse<T>;
  } catch {
    console.error("INVALID JSON FROM:", source);
    console.error("RESPONSE:", text.slice(0, 1000));

    throw new Error(`The server returned invalid JSON for ${source}.`);
  }

  if (result.status === "error") {
    throw new Error(result.message || "Operation failed.");
  }

  return result;
}
