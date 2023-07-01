import "@testing-library/jest-dom";
import { createMocks, RequestMethod } from "node-mocks-http";
import { NextApiRequest, NextApiResponse } from "next";
import handler from "../../../pages/api/behance/index";

describe("API endpoint test /api/behance ", () => {
  function mockRequestResponse(method: RequestMethod = "GET") {
    const { req, res }: { req: NextApiRequest; res: NextApiResponse } =
      createMocks({ method });
    req.headers = {
      "Content-Type": "application/json",
    };
    return { req, res };
  }

  it("should return 200 for GET /api/users", async () => {
    const { req, res } = mockRequestResponse();
    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.getHeaders()).toEqual({ "content-type": "application/json" });
    expect(res.statusMessage).toEqual("OK");
  });
});
