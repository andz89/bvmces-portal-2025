import { handleAppScriptResponse } from "@/app/(protected)/lesson-plan/handleAppScriptResponse";
import { revalidatePath } from "next/cache";
export async function POST(request: Request) {
  console.log("========== LESSON PLAN UPLOAD START ==========");

  try {
    const formData = await request.formData();

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return Response.json(
        {
          status: "error",
          message: "No file was uploaded.",
        },
        { status: 400 },
      );
    }

    console.log("FILE RECEIVED:", file.name);
    console.log("FILE SIZE:", file.size);

    const buffer = Buffer.from(await file.arrayBuffer());

    console.log("ARRAYBUFFER DONE");

    const fileData = {
      fileName: file.name,
      mimeType: file.type,
      data: buffer.toString("base64"),
    };

    console.log("BASE64 DONE");
    console.log("BASE64 LENGTH:", fileData.data.length);

    const payload = {
      action: "addLessonPlan",
      formDataObj: {
        schoolYear: formData.get("schoolYear"),
        subject: formData.get("subject"),
        teacherName: formData.get("teacherName"),
        week: Number(formData.get("week")) || null,
        grade: formData.get("grade")?.toString() || null,
        term: Number(formData.get("term")) || null,
        teacher_id: formData.get("teacher_id"),
        fileData,
      },
    };

    console.log("BEFORE APPSCRIPT");

    const appScriptUrl = process.env.APPSCRIPT_URL;

    if (!appScriptUrl) {
      throw new Error("APPSCRIPT_URL is not configured.");
    }

    const response = await fetch(appScriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    console.log("AFTER APPSCRIPT:", response.status);

    //    const result =  await response.json();
    const result = await handleAppScriptResponse(response, "addLessonPlan");
    revalidatePath("/lesson-plan");
    return Response.json(result, {
      status: response.ok ? 200 : response.status,
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    return Response.json(
      {
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.",
      },
      { status: 500 },
    );
  }
}
