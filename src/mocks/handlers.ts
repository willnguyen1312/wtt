import { http, HttpResponse } from "msw";

export const handlers = [
  http.post("/api/message", async ({ request }) => {
    const data = (await request.json()) as { name: string };

    return HttpResponse.json({
      message: `Hello ${data.name}`,
    });
  }),
];
