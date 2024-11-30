const request = require("supertest");
const app = require("../server/app");
const data = require("../db/data/test/index.js");
const seed = require("../db/seed/seed.js");
const db = require("../db/connection.js");

afterAll(() => {
  seed(data).then(() => {
    db.end();
  });
});

describe("app", () => {
  describe("/api/invalid-endpoint/", () => {
    test("404 - page not found", () => {
      return request(app)
        .get("/api/invalid-endpoint")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("page not found");
        });
    });
  });
  describe("/api/properties", () => {
    describe("happy path", () => {
      describe("GET", () => {
        test("200 - response with all properties", () => {
          return request(app)
            .get("/api/properties")
            .expect(200)
            .then(({ body: { properties } }) => {
              expect(Array.isArray(properties)).toBe(true);
              expect(properties.length).toBeGreaterThan(0);
              properties.forEach((p) => {
                expect(typeof p).toBe("object");
                expect(p).toHaveProperty("property_id");
                expect(p).toHaveProperty("property_name");
                expect(p).toHaveProperty("location");
                expect(p).toHaveProperty("price_per_night");
                expect(p).toHaveProperty("host");

                //should not include
                expect(p).not.toHaveProperty("host_id");
                expect(p).not.toHaveProperty("description");
              });
            });
        });
      });
      describe("POST", () => {
        test("201 - response with recently created property object", () => {
          const postData = {
            name: "test property",
            property_type: "Studio",
            location: "Cornwall, UK",
            price_per_night: 95.0,
            description: "Description of Seaside Studio Getaway.",
            host_id: 1,
          };
          return request(app)
            .post("/api/properties")
            .send(postData)
            .expect(201)
            .then(({ body: { property } }) => {
              expect(typeof property).toBe("object");
              expect(property).toHaveProperty("property_id", 12);
              expect(property).toHaveProperty("property_type", "Studio");
              expect(property).toHaveProperty("name", "test property");
              expect(property).toHaveProperty("location", "Cornwall, UK");
              expect(property).toHaveProperty("price_per_night", "95");
              expect(property).toHaveProperty("host_id", 1);
              expect(property).toHaveProperty("description");
            });
        });
      });
      describe("DELETE", () => {
        test("204 - no response", () => {
          return request(app).delete("/api/properties/12").expect(204);
        });
      });
      describe("PATCH", () => {
        test("200 - response with updated property object", () => {
          const updateData = {
            property_name: "newly created one prop",
            property_type: "Apartment",
            location: "York, UK",
            price_per_night: 94.0,
            description: "Description of Seaside Studio Getaway test.",
          };
          return request(app)
            .patch("/api/properties/11")
            .send(updateData)
            .expect(200)
            .then(({ body: { property } }) => {
              expect(typeof property).toBe("object");
              expect(property).toHaveProperty("property_id", 11);
              expect(property).toHaveProperty("property_type", "Apartment");
              expect(property).toHaveProperty("name", "newly created one prop");
              expect(property).toHaveProperty("location", "York, UK");
              expect(property).toHaveProperty("price_per_night", "94");
              expect(property).toHaveProperty("description");
              expect(property).toHaveProperty("host_id");
            });
        });
      });
    });
    describe("sad path", () => {
      describe("POST", () => {
        test("400 - returns bad request for missing fields", () => {
          const postData = {
            property_type: "Studio",
            host_id: 1,
          };
          return request(app)
            .post("/api/properties")
            .send(postData)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Bad Request.");
            });
        });
        test("400 - returns bad request for invalid fields", () => {
          const postData = {
            property_name: "test",
            property_type: "Studio",
            location: "Cornwall, UK",
            price_per_night: 95.0,
            description: "Description of Seaside Studio Getaway.",
            host_id: 1,
          };
          return request(app)
            .post("/api/properties")
            .send(postData)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Bad Request.");
            });
        });
        test("400 - returns bad request for invalid type fields", () => {
          const postData = {
            property_name: 1,
            property_type: "Studio",
            location: "Cornwall, UK",
            price_per_night: 95.0,
            description: "Description of Seaside Studio Getaway.",
            host_id: "1",
          };
          return request(app)
            .post("/api/properties")
            .send(postData)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Bad Request.");
            });
        });
        test("400 - returns bad request for invalid foreign key reference fields", () => {
          const postData = {
            property_name: 1,
            property_type: "Studio",
            location: "Cornwall, UK",
            price_per_night: 95.0,
            description: "Description of Seaside Studio Getaway.",
            host_id: 100000000000000,
          };
          return request(app)
            .post("/api/properties")
            .send(postData)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Bad Request.");
            });
        });
      });
      describe("DELETE", () => {
        test("400 - returns bad request for invalid id", () => {
          return request(app)
            .delete("/api/properties/invalid_id")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Invalid Id.");
            });
        });
        test("404 - returns not found when the property does not exist", () => {
          return request(app)
            .delete("/api/properties/1000")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("property doesn't exist.");
            });
        });
      });
    });
  });
});
