const request = require("supertest");
const app = require("../server/app");
const data = require("../db/data/test/index.js");
const seed = require("../db/seed/seed.js");
const db = require("../db/connection.js");

beforeEach(async () => {
  await seed(data);
});

afterAll(() => {
  db.end();
});

describe("app", () => {
  describe("/api/invalid-endpoint/", () => {
    test("404 - page not found", () => {
      return request(app)
        .get("/api/invalid-endpoint")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Page not found.");
        });
    });
  });
  describe("/api/property_types", () => {
    describe("HAPPY PATH", () => {
      describe("GET", () => {
        test("200 - response with all property_types", () => {
          return request(app)
            .get("/api/property_types")
            .expect(200)
            .then(({ body: { property_types } }) => {
              expect(Array.isArray(property_types)).toBe(true);
              expect(property_types.length).toBeGreaterThan(0);
              property_types.forEach((p) => {
                expect(typeof p).toBe("object");
                expect(p).toHaveProperty("property_type");
                expect(p).toHaveProperty("description");
              });
            });
        });
      });
    });
  });
  describe("/api/properties", () => {
    describe("HAPPY PATH", () => {
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
                expect(p).toHaveProperty("property_type");
                expect(p).toHaveProperty("location");
                expect(p).toHaveProperty("price_per_night");
                expect(p).toHaveProperty("host");
                expect(p).toHaveProperty("image");

                //should not include
                expect(p).not.toHaveProperty("host_id");
                expect(p).not.toHaveProperty("description");
              });
            });
        });
        test.skip("200 - response with all properties where price per night greater than max price", () => {
          return request(app)
            .get("/api/properties?maxprice=90")
            .expect(200)
            .then(({ body: { properties } }) => {
              properties.forEach((p) => {
                expect(p).toHaveProperty("price_per_night");
                expect(p.price_per_night).t(90);
              });
            });
        });
        test.skip("200 - response with all properties where price per night less than min price", () => {
          return request(app)
            .get("/api/properties?minprice=90")
            .expect(200)
            .then(({ body: { properties } }) => {
              properties.forEach((p) => {
                expect(p).toHaveProperty("price_per_night");
                expect(p.price_per_night).toBeLessThan(90);
              });
            });
        });
        test("200 - response with all properties where price per night between maxprice and minprice", () => {
          return request(app)
            .get("/api/properties?minprice=10&&maxprice=90")
            .expect(200)
            .then(({ body: { properties } }) => {
              properties.forEach((p) => {
                expect(p).toHaveProperty("price_per_night");
                expect(p.price_per_night).toBeGreaterThanOrEqual(10);
                expect(p.price_per_night).toBeLessThanOrEqual(90);
              });
            });
        });
        test("200 - response with all properties default sortby valid field(popularity) and order(descending)", () => {
          return request(app)
            .get("/api/properties")
            .expect(200)
            .then(({ body: { properties } }) => {
              expect(properties.length).toBeGreaterThan(0);
              expect(properties).toBeSortedBy("popularity", {
                descending: true,
              });
            });
        });
        test("200 - response with all properties sortby valid field(price_per_night) and order(ascending)", () => {
          return request(app)
            .get("/api/properties?sort=price_per_night&&order=asc")
            .expect(200)
            .then(({ body: { properties } }) => {
              expect(properties.length).toBeGreaterThan(0);
              expect(properties).toBeSortedBy("price_per_night");
            });
        });
        test("200 - response with all properties filter by host", () => {
          return request(app)
            .get("/api/properties?host=1")
            .expect(200)
            .then(({ body: { properties } }) => {
              expect(properties.length).toBeGreaterThan(0);
              properties.forEach((p) => {
                expect(p).toHaveProperty("host", "Alice Johnson");
              });
            });
        });
        test("200 - response with all properties filter by property_type", () => {
          return request(app)
            .get("/api/properties?property_type=House")
            .expect(200)
            .then(({ body: { properties } }) => {
              expect(properties.length).toBeGreaterThan(0);
              properties.forEach((p) => {
                expect(p).toHaveProperty("property_type", "House");
              });
            });
        });
        test.skip("200 - response with all properties set default limit - 10 and page - 1", () => {
          return request(app)
            .get("/api/properties?limit=10&&page=1")
            .expect(200)
            .then(({ body: { properties } }) => {
              expect(properties).toHaveLength(10);
            });
        });
        test.skip("200 - response with all properties pass optional page - 2", () => {
          return request(app)
            .get("/api/properties?limit=10&&page=2")
            .expect(200)
            .then(({ body: { properties } }) => {
              expect(properties).toHaveLength(1);
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
    });
    describe("SAD PATH", () => {
      describe("GET", () => {
        test("400 - returns bad request for invalid type query(maxprice)", () => {
          return request(app)
            .get("/api/properties?maxprice=not_a_number")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Invalid input type.");
            });
        });
        test("400 - returns bad request for invalid type query(minprice)", () => {
          return request(app)
            .get("/api/properties?minprice=not_a_number")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Invalid input type.");
            });
        });
        test("400 - returns bad request for invalid type query(sort)", () => {
          return request(app)
            .get("/api/properties?sort=invalid_sort")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Oops! Invalid either sort or order.");
            });
        });
        test("400 - returns bad request for invalid type query(order)", () => {
          return request(app)
            .get("/api/properties?order=invalid_order")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Oops! Invalid either sort or order.");
            });
        });
        test("400 - returns bad request for invalid type query(page)", () => {
          return request(app)
            .get("/api/properties?page=invalid_page")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Oops! Invalid page number.");
            });
        });
        test("404 - returns not found for non-existent - host", () => {
          return request(app)
            .get("/api/properties?host=10000")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("No record found.");
            });
        });
        test("404 - returns not found for non-existent - property_type", () => {
          return request(app)
            .get("/api/properties?property_type=non-existent_property_type")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("No record found.");
            });
        });
        test.skip("404 - returns not found for non-existent - page", () => {
          return request(app)
            .get("/api/properties?page=10000")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("No record found.");
            });
        });
      });
      describe("POST", () => {
        test("400 - returns bad request for missing field - name", () => {
          const postData = {
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
              expect(msg).toBe("Bad request.");
            });
        });
        test("400 - returns bad request for missing field - property_type", () => {
          const postData = {
            name: "test property",
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
              expect(msg).toBe("Bad request.");
            });
        });
        test("400 - returns bad request for missing field - location", () => {
          const postData = {
            name: "test property",
            property_type: "Studio",
            price_per_night: 95.0,
            description: "Description of Seaside Studio Getaway.",
            host_id: 1,
          };
          return request(app)
            .post("/api/properties")
            .send(postData)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Bad request.");
            });
        });
        test("400 - returns bad request for missing field - price_per_night", () => {
          const postData = {
            name: "test property",
            property_type: "Studio",
            location: "Cornwall, UK",
            description: "Description of Seaside Studio Getaway.",
            host_id: 1,
          };
          return request(app)
            .post("/api/properties")
            .send(postData)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Bad request.");
            });
        });
        test("400 - returns bad request for missing field - host_id", () => {
          const postData = {
            name: "test property",
            property_type: "Studio",
            location: "Cornwall, UK",
            price_per_night: 95.0,
            description: "Description of Seaside Studio Getaway.",
          };
          return request(app)
            .post("/api/properties")
            .send(postData)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Bad request.");
            });
        });
        test("400 - returns bad request for invalid field - name", () => {
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
              expect(msg).toBe("Bad request.");
            });
        });
        test("400 - returns bad request for invalid field - property_type", () => {
          const postData = {
            name: "test",
            propertytype: "Studio",
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
              expect(msg).toBe("Bad request.");
            });
        });
        test("400 - returns bad request for invalid field - location", () => {
          const postData = {
            name: "test",
            property_type: "Studio",
            loc: "Cornwall, UK",
            price_per_night: 95.0,
            description: "Description of Seaside Studio Getaway.",
            host_id: 1,
          };
          return request(app)
            .post("/api/properties")
            .send(postData)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Bad request.");
            });
        });
        test("400 - returns bad request for invalid field - price_per_night", () => {
          const postData = {
            name: "test",
            property_type: "Studio",
            location: "Cornwall, UK",
            pricepernight: 95.0,
            description: "Description of Seaside Studio Getaway.",
            host_id: 1,
          };
          return request(app)
            .post("/api/properties")
            .send(postData)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Bad request.");
            });
        });
        test("400 - returns bad request for invalid field - host_id", () => {
          const postData = {
            name: "test",
            property_type: "Studio",
            location: "Cornwall, UK",
            price_per_night: 95.0,
            description: "Description of Seaside Studio Getaway.",
            hostid: 1,
          };
          return request(app)
            .post("/api/properties")
            .send(postData)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Bad request.");
            });
        });
        test("400 - returns bad request for invalid type field - host_id", () => {
          const postData = {
            name: "test property",
            property_type: "Studio",
            location: "Cornwall, UK",
            price_per_night: "invalid_price_per_night",
            description: "Description of Seaside Studio Getaway.",
            host_id: "invalid_hostid",
          };
          return request(app)
            .post("/api/properties")
            .send(postData)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Invalid input type.");
            });
        });
        test("404 - returns not found for non-existent foreign key - property_type", () => {
          const postData = {
            name: "test property",
            property_type: "Studio11",
            location: "Cornwall, UK",
            price_per_night: 95.0,
            description: "Description of Seaside Studio Getaway.",
            host_id: 1,
          };
          return request(app)
            .post("/api/properties")
            .send(postData)
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("foreign key reference not found.");
            });
        });
        test("404 - returns not found for non-existent foreign key - hostid", () => {
          const postData = {
            name: 1,
            property_type: "Studio",
            location: "Cornwall, UK",
            price_per_night: 95.0,
            description: "Description of Seaside Studio Getaway.",
            host_id: 99999,
          };
          return request(app)
            .post("/api/properties")
            .send(postData)
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("foreign key reference not found.");
            });
        });
      });
    });
  });
  describe("/api/properties/:id", () => {
    describe("HAPPY PATH", () => {
      describe("GET", () => {
        test("200 - response with single property object", () => {
          return request(app)
            .get("/api/properties/1")
            .expect(200)
            .then(({ body: { property } }) => {
              expect(typeof property).toBe("object");
              expect(property).toHaveProperty("property_id", 1);
              expect(property).toHaveProperty(
                "property_name",
                "Modern Apartment in City Center"
              );
              expect(property).toHaveProperty("location", "London, UK");
              expect(property).toHaveProperty("price_per_night", 120);
              expect(property).toHaveProperty(
                "description",
                "Description of Modern Apartment in City Center."
              );
              expect(property).toHaveProperty("host", "Alice Johnson");
              expect(property).toHaveProperty(
                "host_avatar",
                "https://example.com/images/alice.jpg"
              );

              expect(property).toHaveProperty("favourite_count");
              expect(property.favourite_count).toBeGreaterThan(0);

              expect(property).toHaveProperty("images");
              expect(property).not.toHaveProperty("host_id");
              expect(property).not.toHaveProperty("guest_id");
              expect(property).not.toHaveProperty("favourite_id");
            });
        });
        test("200 - response with single property object filter by user", () => {
          return request(app)
            .get("/api/properties/1?user_id=1")
            .expect(200)
            .then(({ body: { property } }) => {
              expect(property).toHaveProperty("property_id", 1);
              expect(property).toHaveProperty("favourited", false);
            });
        });
      });
      describe("DELETE", () => {
        test("204 - no response for recently deleted property", () => {
          return request(app).delete("/api/properties/11").expect(204);
        });
      });
      describe("PATCH", () => {
        test("200 - response with recently updated property object", () => {
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
    describe("SAD PATH", () => {
      describe("GET", () => {
        test("400 - returns bad request for invalid field - property_id", () => {
          return request(app)
            .get("/api/properties/invalid_id")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Invalid input type.");
            });
        });
        test("400 - returns bad request for invalid type query(user_id)", () => {
          return request(app)
            .get("/api/properties/1?user_id=invalid_id")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Invalid input type.");
            });
        });
        test("404 - returns not found for non-existent - property_id", () => {
          return request(app)
            .get("/api/properties/9999999")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("No record found.");
            });
        });
      });
      describe("DELETE", () => {
        test("400 - returns bad request for invalid field - property_id", () => {
          return request(app)
            .delete("/api/properties/invalid_id")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Invalid input type.");
            });
        });
        test("404 - returns not found for non-existent - property_id", () => {
          return request(app)
            .delete("/api/properties/1000")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("property doesn't exist, no record deleted.");
            });
        });
      });
      describe("PATCH", () => {
        test("400 - returns bad request for invalid type field - price_per_night", () => {
          const updateData = {
            property_name: "property_test",
            property_type: "studio",
            location: "Cornwall, UK",
            price_per_night: "invalid_price_per_night",
            description: "desc",
          };
          return request(app)
            .patch("/api/properties/10")
            .send(updateData)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Invalid input type.");
            });
        });
        test("404 - returns not found for invalid foreign key reference field - property_type", () => {
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
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("foreign key reference not found.");
            });
        });
        test("400 - returns bad request for invalid field - property_id", () => {
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
              expect(msg).toBe("Invalid input type.");
            });
        });
        test("404 - returns not found for non-existent - property_id", () => {
          return request(app)
            .patch("/api/properties/99999")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("property doesn't exist, no record updated.");
            });
        });
      });
    });
  });
  describe("/api/properties/:id/favourite", () => {
    describe("HAPPY PATH", () => {
      describe("POST", () => {
        test("201 - response with recently created favourite object", () => {
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
    });
    describe("SAD PATH", () => {
      describe("POST", () => {
        test("400 - returns bad request for missing field - guest_id", () => {
          return request(app)
            .post("/api/properties/1/favourite")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Bad request.");
            });
        });
        test("400 - returns bad request for invalid field - guest_id", () => {
          const postData = {
            guestid: 1,
          };
          return request(app)
            .post("/api/properties/1/favourite")
            .send(postData)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Bad request.");
            });
        });
        test("400 - returns bad request for invalid type field - guest_id", () => {
          const postData = {
            guest_id: "invalid_guestid",
          };
          return request(app)
            .post("/api/properties/1/favourite")
            .send(postData)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Invalid input type.");
            });
        });
        test("404 - returns not found  for invalid foreign key reference field - guest_id", () => {
          const postData = {
            guest_id: 99999,
          };
          return request(app)
            .post("/api/properties/1/favourite")
            .send(postData)
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("foreign key reference not found.");
            });
        });
        test("404 - returns not found  for invalid foreign key reference field - property_id", () => {
          const postData = {
            guest_id: 1,
          };
          return request(app)
            .post("/api/properties/99999/favourite")
            .send(postData)
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("foreign key reference not found.");
            });
        });
        test("400 - returns bad request for invalid field - property_id", () => {
          const postData = {
            guest_id: 1,
          };
          return request(app)
            .post("/api/properties/invalid_id/favourite")
            .send(postData)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Invalid input type.");
            });
        });
      });
    });
  });
  describe("/api/favourites/:id", () => {
    describe("HAPPY PATH", () => {
      describe("DELETE", () => {
        test("204 - no response for recently deleted favourite", () => {
          return request(app).delete("/api/favourites/1").expect(204);
        });
      });
    });
    describe("SAD PATH", () => {
      test("405 - method not allowed [patch or put] for favourite", () => {
        const invalidMethods = ["patch", "put"];

        return Promise.all(
          invalidMethods.map((method) => {
            return request(app)
              [method]("/api/favourites/1")
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("Method not allowed.");
              });
          })
        );
      });
      describe("DELETE", () => {
        test("400 - returns bad request for invalid field - favourite_id", () => {
          return request(app)
            .delete("/api/favourites/invalid_id")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Invalid input type.");
            });
        });
        test("404 - returns not found for non-existent - favourite_id", () => {
          return request(app)
            .delete("/api/favourites/10000000")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe(
                "property's favourite doesn't exist, no record deleted."
              );
            });
        });
      });
    });
  });
  describe("/api/properties/:id/reviews", () => {
    describe("HAPPY PATH", () => {
      describe("GET", () => {
        test("200 - response with all reviews of the perticular property", () => {
          return request(app)
            .get("/api/properties/1/reviews")
            .expect(200)
            .then(({ body }) => {
              const { reviews } = body;
              expect(Array.isArray(reviews)).toBe(true);
              expect(reviews.length).toBeGreaterThan(0);
              reviews.forEach((r) => {
                expect(typeof r).toBe("object");
                expect(r).toHaveProperty("review_id");
                expect(r).toHaveProperty("comment");
                expect(r).toHaveProperty("rating");
                expect(r).toHaveProperty("created_at");
                expect(r).toHaveProperty("guest");
                expect(r).toHaveProperty("guest_avatar");

                expect(r).not.toHaveProperty("guest_id");
              });
              expect(body).toHaveProperty("average_rating");
            });
        });
        test("200 - empty response for no reviews on the perticular property", () => {
          return request(app).get("/api/properties/10/reviews").expect(200);
        });
      });
      describe("POST", () => {
        describe("HAPPY PATH", () => {
          test("201 - response with recently created review object", () => {
            const postData = {
              guest_id: 1,
              rating: 4,
              comment: "test comment",
            };
            return request(app)
              .post("/api/properties/1/reviews")
              .send(postData)
              .expect(201)
              .then(({ body: { review } }) => {
                expect(typeof review).toBe("object");
                expect(review).toHaveProperty("review_id");
                expect(review).toHaveProperty("property_id");
                expect(review).toHaveProperty("guest_id");
                expect(review).toHaveProperty("guest_id");
                expect(review).toHaveProperty("comment");
                expect(review).toHaveProperty("created_at");
              });
          });
        });
      });
    });
    describe("SAD PATH", () => {
      describe("GET", () => {
        test("400 - returns bad request for invalid field - property id", () => {
          return request(app)
            .get("/api/properties/invalid_id/reviews")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Invalid input type.");
            });
        });
        test("404 - returns not found for non-existent - property id", () => {
          return request(app)
            .get("/api/properties/99999/reviews")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("No record found.");
            });
        });
      });
      describe("POST", () => {
        test("400 - returns bad request for missing field - guest_id", () => {
          const postData = {
            rating: 4,
            comment: "test comment",
          };
          return request(app)
            .post("/api/properties/1/reviews")
            .send(postData)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Bad request.");
            });
        });
        test("400 - returns bad request for missing field - rating", () => {
          const postData = {
            guest_id: 1,
            comment: "test comment",
          };
          return request(app)
            .post("/api/properties/1/reviews")
            .send(postData)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Bad request.");
            });
        });
        test("400 - returns bad request for invalid field - guest_id", () => {
          const postData = {
            guestid: 1,
            rating: 4,
            comment: "test comment",
          };
          return request(app)
            .post("/api/properties/1/reviews")
            .send(postData)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Bad request.");
            });
        });
        test("400 - returns bad request for invalid field - rating", () => {
          const postData = {
            guest_id: 1,
            rat: 4,
            comment: "test comment",
          };
          return request(app)
            .post("/api/properties/1/reviews")
            .send(postData)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Bad request.");
            });
        });
        test("400 - returns bad request for invalid type field - guest_id", () => {
          const postData = {
            guest_id: "invalid_guestid",
            rating: 4,
            comment: "test comment",
          };
          return request(app)
            .post("/api/properties/1/reviews")
            .send(postData)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Invalid input type.");
            });
        });
        test("400 - returns bad request for invalid type field - rating", () => {
          const postData = {
            guest_id: 1,
            rating: "invalid_rating",
            comment: "test comment",
          };
          return request(app)
            .post("/api/properties/1/reviews")
            .send(postData)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Invalid input type.");
            });
        });
        test("404 - returns not found  for invalid foreign key reference field - guest_id", () => {
          const postData = {
            guest_id: 10000,
            rating: 4,
            comment: "test comment",
          };
          return request(app)
            .post("/api/properties/1/reviews")
            .send(postData)
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("foreign key reference not found.");
            });
        });
        test("404 - returns not found  for invalid foreign key reference field - property_id", () => {
          const postData = {
            guest_id: 1,
            rating: 4,
            comment: "test comment",
          };
          return request(app)
            .post("/api/properties/99999/reviews")
            .send(postData)
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("foreign key reference not found.");
            });
        });
        test("400 - returns bad request for invalid field - property_id", () => {
          const postData = {
            guest_id: 1,
            rating: 4,
            comment: "test comment",
          };
          return request(app)
            .post("/api/properties/invalid_id/reviews")
            .send(postData)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Invalid input type.");
            });
        });
      });
    });
  });
  describe("/api/reviews/:id", () => {
    describe("HAPPY PATH", () => {
      describe("DELETE", () => {
        test("204 - no response for recently deleted reviews", () => {
          return request(app).delete("/api/reviews/1").expect(204);
        });
      });
    });
    describe("SAD PATH", () => {
      test("405 - method not allowed [patch or put] for review", () => {
        const invalidMethods = ["patch", "put"];

        return Promise.all(
          invalidMethods.map((method) => {
            return request(app)
              [method]("/api/reviews/1")
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("Method not allowed.");
              });
          })
        );
      });
      describe("DELETE", () => {
        test("400 - returns bad request for invalid field - review_id", () => {
          return request(app)
            .delete("/api/reviews/invalid_id")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Invalid input type.");
            });
        });
        test("404 - returns not found for non-existent - review id", () => {
          return request(app)
            .delete("/api/reviews/100000")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe(
                "property's review doesn't exist, no record deleted."
              );
            });
        });
      });
    });
  });
  describe("/api/users/:id", () => {
    describe("HAPPY PATH", () => {
      describe("GET", () => {
        test("200 - response with specific user object", () => {
          return request(app)
            .get("/api/users/1")
            .expect(200)
            .then(({ body: { user } }) => {
              expect(typeof user).toBe("object");
              expect(user).toHaveProperty("user_id", 1);
              expect(user).toHaveProperty("first_name", "Alice");
              expect(user).toHaveProperty("surname", "Johnson");
              expect(user).toHaveProperty("email", "alice@example.com");
              expect(user).toHaveProperty("phone_number", "+44 7000 111111");
              expect(user).toHaveProperty(
                "avatar",
                "https://example.com/images/alice.jpg"
              );
              expect(user).toHaveProperty("created_at");
            });
        });
      });
      describe("PATCH", () => {
        test("200 - response with updated user object", () => {
          const updateData = {
            first_name: "Alicetest",
            surname: "Johnsontest",
            email: "alice@exampletest.com",
            phone: "+44 7000 111122",
            avatar: "https://example.com/images/bob.jpg",
          };
          return request(app)
            .patch("/api/users/1")
            .send(updateData)
            .expect(200)
            .then(({ body: { user } }) => {
              expect(typeof user).toBe("object");
              expect(user).toHaveProperty("user_id", 1);
              expect(user).toHaveProperty("first_name", "Alicetest");
              expect(user).toHaveProperty("surname", "Johnsontest");
              expect(user).toHaveProperty("email", "alice@exampletest.com");
              expect(user).toHaveProperty("phone_number", "+44 7000 111122");
              expect(user).toHaveProperty(
                "avatar",
                "https://example.com/images/bob.jpg"
              );
              expect(user).toHaveProperty("created_at");
            });
        });
      });
    });
    describe("SAD PATH", () => {
      test("405 - method not allowed [delete] for user", () => {
        const invalidMethods = ["delete"];

        return Promise.all(
          invalidMethods.map((method) => {
            return request(app)
              [method]("/api/users/1")
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("Method not allowed.");
              });
          })
        );
      });
      describe("GET", () => {
        test("400 - returns bad request for invalid field - user_id", () => {
          return request(app)
            .get("/api/users/invalid_id")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Invalid input type.");
            });
        });
        test("404 - returns not found for non-existent - user_id", () => {
          return request(app)
            .get("/api/users/99999")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("No record found.");
            });
        });
      });
      describe("PATCH", () => {
        test("400 - returns bad request for invalid field - user_id", () => {
          const updateData = {
            first_name: "Alicetest",
            surname: "Johnsontest",
            email: "alice@exampletest.com",
            phone: "+44 7000 111122",
            avatar: "https://example.com/images/bob.jpg",
          };
          return request(app)
            .patch("/api/users/invalid_id")
            .send(updateData)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Invalid input type.");
            });
        });
        test("404 - returns not found for non-existent - user_id", () => {
          return request(app)
            .patch("/api/users/99999")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("user doesn't exist, no record updated.");
            });
        });
      });
    });
  });
  describe("/api/users", () => {
    describe("HAPPY PATH", () => {
      describe("POST", () => {
        test("201 - response with recently created user object", () => {
          const postData = {
            first_name: "Alicetest",
            surname: "Johnsontest",
            email: "alice@exampletest.com",
            phone: "+44 7000 111122",
            role: "host",
            avatar: "https://example.com/images/bob.jpg",
          };
          return request(app)
            .post("/api/users")
            .send(postData)
            .expect(201)
            .then(({ body: { user } }) => {
              expect(typeof user).toBe("object");
              expect(user).toHaveProperty("user_id", 7);
              expect(user).toHaveProperty("first_name", "Alicetest");
              expect(user).toHaveProperty("surname", "Johnsontest");
              expect(user).toHaveProperty("email", "alice@exampletest.com");
              expect(user).toHaveProperty("phone_number", "+44 7000 111122");
              expect(user).toHaveProperty("role", "host");
              expect(user).toHaveProperty(
                "avatar",
                "https://example.com/images/bob.jpg"
              );
              expect(user).toHaveProperty("created_at");
            });
        });
      });
    });
    describe("SAD PATH", () => {
      describe("POST", () => {
        test("400 - returns bad request for missing field - first_name", () => {
          const postData = {
            surname: "Johnsontest",
            email: "alice@exampletest.com",
            phone: "+44 7000 111122",
            role: "host",
            avatar: "https://example.com/images/bob.jpg",
          };
          return request(app)
            .post("/api/users")
            .send(postData)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Bad request.");
            });
        });
        test("400 - returns bad request for missing field - surname", () => {
          const postData = {
            first_name: "Alicetest",
            email: "alice@exampletest.com",
            phone: "+44 7000 111122",
            role: "host",
            avatar: "https://example.com/images/bob.jpg",
          };
          return request(app)
            .post("/api/users")
            .send(postData)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Bad request.");
            });
        });
        test("400 - returns bad request for missing field - email", () => {
          const postData = {
            first_name: "Alicetest",
            surname: "Johnsontest",
            phone: "+44 7000 111122",
            role: "host",
            avatar: "https://example.com/images/bob.jpg",
          };
          return request(app)
            .post("/api/users")
            .send(postData)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Bad request.");
            });
        });
        test("400 - returns bad request for invalid field - first_name", () => {
          const postData = {
            firstname: "Alicetest",
            surname: "Johnsontest",
            email: "alice@exampletest.com",
            phone: "+44 7000 111122",
            role: "host",
            avatar: "https://example.com/images/bob.jpg",
          };
          return request(app)
            .post("/api/users")
            .send(postData)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Bad request.");
            });
        });
        test("400 - returns bad request for invalid field - surname", () => {
          const postData = {
            first_name: "Alicetest",
            surrrrname: "Johnsontest",
            email: "alice@exampletest.com",
            phone: "+44 7000 111122",
            role: "host",
            avatar: "https://example.com/images/bob.jpg",
          };
          return request(app)
            .post("/api/users")
            .send(postData)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Bad request.");
            });
        });
        test("400 - returns bad request for invalid field - email", () => {
          const postData = {
            first_name: "Alicetest",
            surname: "Johnsontest",
            emaillss: "alice@exampletest.com",
            phone: "+44 7000 111122",
            role: "host",
            avatar: "https://example.com/images/bob.jpg",
          };
          return request(app)
            .post("/api/users")
            .send(postData)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Bad request.");
            });
        });
      });
    });
  });
  describe("/api/properties/:id/bookings", () => {
    describe("HAPPY PATH", () => {
      describe("POST", () => {
        test("201 - response with recently created booking object for property", () => {
          const postData = {
            guest_id: 2,
            check_in_date: "2025-12-01",
            check_out_date: "2025-12-05",
          };
          return request(app)
            .post("/api/properties/1/bookings")
            .send(postData)
            .expect(201)
            .then(({ body: { booking } }) => {
              expect(booking).toHaveProperty("booking_id", 11);
              expect(booking).toHaveProperty("msg", "Booking successful");
            });
        });
      });
      describe("GET", () => {
        test("200 - response with all the bookings of specific property", () => {
          return request(app)
            .get("/api/properties/1/bookings")
            .expect(200)
            .then(({ body }) => {
              const { bookings } = body;
              expect(Array.isArray(bookings)).toBe(true);
              expect(bookings.length).toBeGreaterThan(0);
              bookings.forEach((b) => {
                expect(typeof b).toBe("object");
                expect(b).toHaveProperty("booking_id");
                expect(b).toHaveProperty("check_in_date");
                expect(b).toHaveProperty("check_out_date");
                expect(b).toHaveProperty("created_at");

                expect(b).not.toHaveProperty("property_id");
                expect(b).not.toHaveProperty("guest_id");
              });
            });
        });
        test("200 - empty response for the no bookings of specific property", () => {
          return request(app).get("/api/properties/11/bookings").expect(200);
        });
      });
    });
    describe("SAD PATH", () => {
      describe("POST", () => {
        test("400 - returns bad request for missing field - guest_id", () => {
          const postData = {
            check_in_date: "2025-12-01",
            check_out_date: "2025-12-05",
          };
          return request(app)
            .post("/api/properties/1/bookings")
            .send(postData)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Bad request.");
            });
        });
        test("400 - returns bad request for missing field - check_in_date", () => {
          const postData = {
            guest_id: 1,
            check_out_date: "2025-12-05",
          };
          return request(app)
            .post("/api/properties/1/bookings")
            .send(postData)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Bad request.");
            });
        });
        test("400 - returns bad request for missing field - check_out_date", () => {
          const postData = {
            guest_id: 1,
            check_in_date: "2025-12-01",
          };
          return request(app)
            .post("/api/properties/1/bookings")
            .send(postData)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Bad request.");
            });
        });
        test("400 - returns bad request for invalid field - guest_id", () => {
          const postData = {
            guestid: 2,
            check_in_date: "2025-12-01",
            check_out_date: "2025-12-05",
          };
          return request(app)
            .post("/api/properties/1/bookings")
            .send(postData)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Bad request.");
            });
        });
        test("400 - returns bad request for invalid field - check_in_date", () => {
          const postData = {
            guest_id: 2,
            checkindate: "2025-12-01",
            check_out_date: "2025-12-05",
          };
          return request(app)
            .post("/api/properties/1/bookings")
            .send(postData)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Bad request.");
            });
        });
        test("400 - returns bad request for invalid field - check_out_date", () => {
          const postData = {
            guest_id: 2,
            check_in_date: "2025-12-01",
            checkoutdate: "2025-12-05",
          };
          return request(app)
            .post("/api/properties/1/bookings")
            .send(postData)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Bad request.");
            });
        });
        test("400 - returns bad request for invalid type field - guest_id", () => {
          const postData = {
            guest_id: "invalid_guestid",
            check_in_date: "2025-12-01",
            check_out_date: "2025-12-05",
          };
          return request(app)
            .post("/api/properties/1/bookings")
            .send(postData)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Invalid input type.");
            });
        });
        test("400 - returns bad request for invalid type field - check_in_date", () => {
          const postData = {
            guest_id: 1,
            check_in_date: "invalid_check_in_date",
            check_out_date: "2025-12-05",
          };
          return request(app)
            .post("/api/properties/1/bookings")
            .send(postData)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Invalid date format.");
            });
        });
        test("400 - returns bad request for invalid type field - check_out_date", () => {
          const postData = {
            guest_id: 1,
            check_in_date: "2025-12-0",
            check_out_date: "invalid_check_out_date",
          };
          return request(app)
            .post("/api/properties/1/bookings")
            .send(postData)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Invalid date format.");
            });
        });
        test("400 - returns bad request for invalid field - property_id", () => {
          const postData = {
            guest_id: 2,
            check_in_date: "2025-12-01",
            check_out_date: "2025-12-05",
          };
          return request(app)
            .post("/api/properties/invalid_id/bookings")
            .send(postData)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Invalid input type.");
            });
        });
        test("404 - returns not found  for invalid foreign key reference field - guest_id", () => {
          const postData = {
            guest_id: 99999,
            check_in_date: "2025-12-01",
            check_out_date: "2025-12-05",
          };
          return request(app)
            .post("/api/properties/1/bookings")
            .send(postData)
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("foreign key reference not found.");
            });
        });
        test("404 - returns not found  for invalid foreign key reference field - property_id", () => {
          const postData = {
            guest_id: 2,
            check_in_date: "2025-12-01",
            check_out_date: "2025-12-05",
          };
          return request(app)
            .post("/api/properties/99999/bookings")
            .send(postData)
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("foreign key reference not found.");
            });
        });
      });
      describe("GET", () => {
        test("400 - returns bad request for invalid field - property_id", () => {
          return request(app)
            .get("/api/properties/invalid_id/bookings")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Invalid input type.");
            });
        });
        test("404 - returns not found for non-existent - property_id", () => {
          return request(app)
            .get("/api/properties/99999/bookings")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("No bookings yet.");
            });
        });
      });
    });
  });
  describe("/api/bookings/:id", () => {
    describe("HAPPY PATH", () => {
      describe("PATCH", () => {
        test("200 - response with recently updated booking object", () => {
          const updateData = {
            check_in_date: "2024-12-26T10:00:00.000Z",
            check_out_date: "2024-12-28T10:00:00.000Z",
          };
          return request(app)
            .patch("/api/bookings/1")
            .send(updateData)
            .expect(200)
            .then(({ body: { booking } }) => {
              expect(typeof booking).toBe("object");
              expect(Object.keys(booking)).toHaveLength(6);
              expect(booking).toHaveProperty("booking_id", 1);
              expect(booking).toHaveProperty("property_id", 1);
              expect(booking).toHaveProperty("guest_id", 2);
              expect(booking).toHaveProperty(
                "check_in_date",
                "2024-12-26T00:00:00.000Z"
              );
              expect(booking).toHaveProperty(
                "check_out_date",
                "2024-12-28T00:00:00.000Z"
              );
              expect(booking).toHaveProperty("created_at");
            });
        });
      });
      describe("DELETE", () => {
        test("204 - no response for recently deleted booking", () => {
          return request(app).delete("/api/bookings/1").expect(204);
        });
      });
    });
    describe("SAD PATH", () => {
      describe("PATCH", () => {
        test("400 - returns bad request for invalid type field - check_in_date", () => {
          const updateData = {
            check_in_date: "invalid_check_in_date",
            check_out_date: "2025-12-05",
          };
          return request(app)
            .patch("/api/bookings/1")
            .send(updateData)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Invalid date format.");
            });
        });
        test("400 - returns bad request for invalid type field - check_out_date", () => {
          const updateData = {
            check_in_date: "2025-12-0",
            check_out_date: "invalid_check_out_date",
          };
          return request(app)
            .patch("/api/bookings/1")
            .send(updateData)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Invalid date format.");
            });
        });
        test("400 - returns bad request for invalid field - booking_id", () => {
          const updateData = {
            check_in_date: "2025-12-01",
            check_out_date: "2025-12-05",
          };
          return request(app)
            .patch("/api/bookings/invalid_id")
            .send(updateData)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Invalid input type.");
            });
        });
        test("404 - returns not found for non-existent - booking_id", () => {
          return request(app)
            .patch("/api/bookings/99999")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("booking doesn't exist, no record updated.");
            });
        });
      });
      describe("DELETE", () => {
        test("400 - returns bad request for invalid feild - booking_id", () => {
          return request(app)
            .delete("/api/bookings/invalid_id")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Invalid input type.");
            });
        });
        test("404 - returns not found for non-existent - booking_id", () => {
          return request(app)
            .delete("/api/bookings/99999")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("booking doesn't exist, no record deleted.");
            });
        });
      });
    });
  });
  describe("/api/users/:id/bookings", () => {
    describe("HAPPY PATH", () => {
      describe("GET", () => {
        test("200 - response with all the bookings of specific user", () => {
          return request(app)
            .get("/api/users/2/bookings")
            .expect(200)
            .then(({ body: { bookings } }) => {
              expect(Array.isArray(bookings)).toBe(true);
              expect(bookings.length).toBeGreaterThan(0);
              bookings.forEach((b) => {
                expect(typeof b).toBe("object");
                expect(b).toHaveProperty("booking_id");
                expect(b).toHaveProperty("check_in_date");
                expect(b).toHaveProperty("check_out_date");
                expect(b).toHaveProperty("property_id");
                expect(b).toHaveProperty("property_name");
                expect(b).toHaveProperty("host");
                expect(b).toHaveProperty("image");
              });
            });
        });
        test("200 - empty response for no booking of specific user", () => {
          return request(app).get("/api/users/1/bookings").expect(200);
        });
      });
    });
    describe("SAD PATH", () => {
      describe("GET", () => {
        test("400 - returns bad request for invalid field - user_id", () => {
          return request(app)
            .get("/api/users/invalid_id/bookings")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Invalid input type.");
            });
        });
        test("404 - returns not found for non-existent - user_id", () => {
          return request(app)
            .get("/api/users/99999/bookings")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("No bookings found.");
            });
        });
      });
    });
  });
  describe("/api/users/:id/favourites", () => {
    describe("HAPPY PATH", () => {
      describe("GET", () => {
        test("200 - response with all the favourites of specific user", () => {
          return request(app)
            .get("/api/users/2/favourites")
            .expect(200)
            .then(({ body: { favourites } }) => {
              expect(Array.isArray(favourites)).toBe(true);
              expect(favourites.length).toBeGreaterThan(0);
              favourites.forEach((f) => {
                expect(typeof f).toBe("object");
                expect(f).toHaveProperty("property_id");
                expect(f).toHaveProperty("property_name");
                expect(f).toHaveProperty("location");
                expect(f).toHaveProperty("price_per_night");
                expect(f).toHaveProperty("host");
                expect(f).toHaveProperty("image");
              });
            });
        });
        test("200 - empty response for no favourites of specific user", () => {
          return request(app).get("/api/users/5/favourites").expect(200);
        });
      });
    });
    describe("SAD PATH", () => {
      describe("GET", () => {
        test("400 - returns bad request for invalid field - user_id", () => {
          return request(app)
            .get("/api/users/invalid_id/favourites")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Invalid input type.");
            });
        });
        test("404 - returns not found for non-existent - user_id", () => {
          return request(app)
            .get("/api/users/99999/favourites")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("No record found.");
            });
        });
      });
    });
  });
});
