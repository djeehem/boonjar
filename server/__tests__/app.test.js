import request from "supertest";
import app from "../app";

// In the terminal run: yarn test
describe("GET /api/books", () => {
  it("responds with JSON and status code 200", async () => {
    const response = await request(app).get("/api/books");
    expect(response.status).toBe(200);
    expect(response.type).toBe("application/json");
  });
});

// TEST FOR Github Olivier
const test = 79;
