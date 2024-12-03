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
        test("200 - response with all properties where price per night greater than max price", () => {
          return request(app)
            .get("/api/properties?maxprice=90")
            .expect(200)
            .then(({ body: { properties } }) => {
              expect(Array.isArray(properties)).toBe(true);

              properties.forEach((p) => {
                expect(typeof p).toBe("object");
                expect(p).toHaveProperty("price_per_night");
                expect(p.price_per_night).toBeGreaterThanOrEqual(90);
              });
            });
        });
        test("200 - response with all properties where price per night less than min price", () => {
          return request(app)
            .get("/api/properties?minprice=90")
            .expect(200)
            .then(({ body: { properties } }) => {
              expect(Array.isArray(properties)).toBe(true);

              properties.forEach((p) => {
                expect(typeof p).toBe("object");
                expect(p).toHaveProperty("price_per_night");
                expect(p.price_per_night).toBeLessThan(90);
              });
            });
        });
        test("200 - response with all properties where price per night between maxprice and minprice", () => {
          return request(app)
            .get("/api/properties?minprice=90&&maxprice=10")
            .expect(200)
            .then(({ body: { properties } }) => {
              expect(Array.isArray(properties)).toBe(true);

              properties.forEach((p) => {
                expect(typeof p).toBe("object");
                expect(p).toHaveProperty("price_per_night");
                expect(p.price_per_night).toBeGreaterThanOrEqual(10);
                expect(p.price_per_night).toBeLessThan(90);
              });
            });
        });
        test("200 - response with all properties sortby valid field(price_per_night)", () => {
          return request(app)
            .get("/api/properties?sort=price_per_night")
            .expect(200)
            .then(({ body: { properties } }) => {
              expect(Array.isArray(properties)).toBe(true);
              expect(properties.length).toBeGreaterThan(0);
              expect(properties).toBeSortedBy("price_per_night");
            });
        });
        test("200 - response with all properties sortby valid field(popularity)", () => {
          return request(app)
            .get("/api/properties?sort=popularity")
            .expect(200)
            .then(({ body: { properties } }) => {
              expect(Array.isArray(properties)).toBe(true);
              expect(properties.length).toBeGreaterThan(0);
              expect(properties).toBeSortedBy("popularity");
            });
        });
        test("200 - response with all properties by valid order", () => {
          return request(app)
            .get("/api/properties?order=desc")
            .expect(200)
            .then(({ body: { properties } }) => {
              expect(Array.isArray(properties)).toBe(true);
              expect(properties.length).toBeGreaterThan(0);
              expect(properties).toBeSortedBy("property_name", {
                descending: true,
              });
            });
        });
        test("200 - response with all properties filter by host", () => {
          return request(app)
            .get("/api/properties?host=1")
            .expect(200)
            .then(({ body: { properties } }) => {
              expect(Array.isArray(properties)).toBe(true);
              expect(properties.length).toBeGreaterThan(0);
              properties.forEach((p) => {
                expect(p).toHaveProperty("host", "Alice Johnson");
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
          return request(app).delete("/api/properties/11").expect(204);
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
            .patch("/api/properties/10")
            .send(updateData)
            .expect(200)
            .then(({ body: { property } }) => {
              expect(typeof property).toBe("object");
              expect(property).toHaveProperty("property_id", 10);
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
      describe("GET", () => {
        test("400 - returns bad request for invalid type query", () => {
          return request(app)
            .get("/api/properties?maxprice=not_a_number")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Bad Request.");
            });
        });
        test("400 - returns bad request for invalid sort fields", () => {
          return request(app)
            .get("/api/properties?sort=invalid_sort")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Oops! Invalid either sort or order.");
            });
        });
        test("400 - returns bad request for invalid order passed", () => {
          return request(app)
            .get("/api/properties?order=invalid_order")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Oops! Invalid either sort or order.");
            });
        });
        test("404 - returns not found when host didn't exist", () => {
          return request(app)
            .get("/api/properties?host=10000")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("no record found.");
            });
        });
      });
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
      describe("PATCH", () => {
        test("400 - returns bad request for invalid fields", () => {
          const updateData = {
            propertyname: "test",
            propertytype: "Studio",
            location: "Cornwall, UK",
            pricepernight: 95.0,
            desc: "Description of Seaside Studio Getaway.",
          };
          return request(app)
            .patch("/api/properties/10")
            .send(updateData)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Bad Request.");
            });
        });
        test("400 - returns bad request for invalid type in foreign key fields", () => {
          const updateData = {
            property_name: "1",
            property_type: 1,
            location: "Cornwall, UK",
            price_per_night: "95.0",
            description: 12,
          };
          return request(app)
            .patch("/api/properties/10")
            .send(updateData)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Bad Request.");
            });
        });
        test("400 - returns bad request for invalid id", () => {
          const updateData = {
            property_name: "newly created one prop",
            property_type: "Apartment",
            location: "York, UK",
            price_per_night: 94.0,
            description: "Description of Seaside Studio Getaway test.",
          };
          return request(app)
            .patch("/api/properties/invalid_id")
            .send(updateData)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Invalid Id.");
            });
        });
        test("404 - returns not found when the property does not exist", () => {
          return request(app)
            .patch("/api/properties/1000")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("property doesn't exist, no record updated.");
            });
        });
      });
    });
  });
  describe("/api/properties/:id/favourite", () => {
    describe("POST", () => {
      describe("happy path", () => {
        test("201 - response with recently created property's favourite object", () => {
          const postData = {
            guest_id: 1,
          };
          return request(app)
            .post("/api/properties/1/favourite")
            .send(postData)
            .expect(201)
            .then(({ body: { favourite } }) => {
              expect(typeof favourite).toBe("object");
              expect(favourite).toHaveProperty("favourite_id");
              expect(favourite).toHaveProperty("msg");
              expect(favourite.msg).toBe("Property favourited successfully.");
            });
        });
      });
      describe("sad path", () => {
        test("405 - method not allowed [patch or put]", () => {
          const invalidMethods = ["patch", "put"];

          return Promise.all(
            invalidMethods.map((method) => {
              return request(app)
                [method]("/api/properties/1/favourite")
                .expect(405)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe("method not allowed");
                });
            })
          );
        });
        test("400 - returns bad request for missing fields", () => {
          return request(app)
            .post("/api/properties/1/favourite")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Bad Request.");
            });
        });
        test("400 - returns bad request for invalid fields", () => {
          const postData = {
            guestid: 1,
          };
          return request(app)
            .post("/api/properties/1/favourite")
            .send(postData)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Bad Request.");
            });
        });
        test("400 - returns bad request for invalid foreign key reference fields - guest_id", () => {
          const postData = {
            guest_id: 10000000,
          };
          return request(app)
            .post("/api/properties/1/favourite")
            .send(postData)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Bad Request.");
            });
        });
        test("400 - returns bad request for invalid foreign key reference fields - property_id", () => {
          const postData = {
            guest_id: 1,
          };
          return request(app)
            .post("/api/properties/100000/favourite")
            .send(postData)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Bad Request.");
            });
        });
        test("400 - returns bad request for invalid type of property_id is passing in url", () => {
          const postData = {
            guest_id: 1,
          };
          return request(app)
            .post("/api/properties/invalid_id/favourite")
            .send(postData)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("invalid property id passed in url.");
            });
        });
      });
    });
  });
});
