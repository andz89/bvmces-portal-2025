// Server side of the file-upload API routes (app/api/*/upload/route.js).
//
// File uploads go through plain API routes instead of server actions: some
// users' networks answered server-action POSTs with a 403 before they ever
// reached the app, which Next.js only surfaces as "An unexpected response
// was received from the server." Lesson plans moved to an API route first
// (app/api/lesson-plan/upload) and the problem went away.
//
// The handler is usually an existing action function (validation and
// permission checks stay in the feature's actions.js). Whatever it returns
// ({ error } or { success, ... }) is sent back as JSON for postForm() on
// the client.
export async function runFormRoute(request, handler, label) {
  try {
    const formData = await request.formData();
    const result = (await handler(formData)) ?? {};

    return Response.json(result, { status: result.error ? 400 : 200 });
  } catch (err) {
    console.error(`${label} upload failed:`, err);

    return Response.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Something went wrong while saving. Please try again.",
      },
      { status: 500 },
    );
  }
}
