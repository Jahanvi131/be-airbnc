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
          expect(msg).toBe("Page not found.");
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
              properties.forEach((p) => {
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
              properties.forEach((p) => {
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
              properties.forEach((p) => {
                expect(p).toHaveProperty("price_per_night");
                expect(p.price_per_night).toBeGreaterThanOrEqual(10);
                expect(p.price_per_night).toBeLessThan(90);
              });
            });
        });
        test("200 - response with all properties default sortby valid field(popularity)", () => {
          return request(app)
            .get("/api/properties?sort=popularity")
            .expect(200)
            .then(({ body: { properties } }) => {
              expect(properties.length).toBeGreaterThan(0);
              expect(properties).toBeSortedBy("popularity");
            });
        });
        test("200 - response with all properties sortby valid field(price_per_night)", () => {
          return request(app)
            .get("/api/properties?sort=price_per_night")
            .expect(200)
            .then(({ body: { properties } }) => {
              expect(properties.length).toBeGreaterThan(0);
              expect(properties).toBeSortedBy("price_per_night");
            });
        });
        test("200 - response with all properties by valid order", () => {
          return request(app)
            .get("/api/properties?order=desc")
            .expect(200)
            .then(({ body: { properties } }) => {
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
              expect(msg).toBe("No record found.");
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
              expect(msg).toBe("Bad request.");
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
              expect(msg).toBe("Bad request.");
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
              expect(msg).toBe("Bad request.");
            });
        });
        test("404 - returns not found for in-existent foreign key - host id", () => {
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
        test("400 - returns bad request for invalid id", () => {
          return request(app)
            .get("/api/properties/invalid_id")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Invalid input type.");
            });
        });
        test("400 - returns bad request for invalid type query", () => {
          return request(app)
            .get("/api/properties/1?user_id=invalid_id")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Invalid input type.");
            });
        });
        test("404 - returns not found for non-existent property_id", () => {
          return request(app)
            .get("/api/properties/9999999")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("No record found.");
            });
        });
      });
      describe("DELETE", () => {
        test("400 - returns bad request for invalid id", () => {
          return request(app)
            .delete("/api/properties/invalid_id")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Invalid input type.");
            });
        });
        test("404 - returns not found when the property does not exist", () => {
          return request(app)
            .delete("/api/properties/1000")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("property doesn't exist, no record deleted.");
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
              expect(msg).toBe("Bad request.");
            });
        });
        test("404 - returns not found for invalid foreign key reference fields - property_type", () => {
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
              expect(msg).toBe("Invalid input type.");
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
        test("405 - method not allowed [patch or put] for favourite", () => {
          const invalidMethods = ["patch", "put"];

          return Promise.all(
            invalidMethods.map((method) => {
              return request(app)
                [method]("/api/properties/1/favourite")
                .expect(405)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe("Method not allowed.");
                });
            })
          );
        });
        test("400 - returns bad request for missing fields", () => {
          return request(app)
            .post("/api/properties/1/favourite")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Bad request.");
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
              expect(msg).toBe("Bad request.");
            });
        });
        test("404 - returns not found  for invalid foreign key reference fields - guest_id", () => {
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
        test("404 - returns not found  for invalid foreign key reference fields - property_id", () => {
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
        test("400 - returns bad request for invalid id", () => {
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
      describe("DELETE", () => {
        test("400 - returns bad request for invalid id", () => {
          return request(app)
            .delete("/api/favourites/invalid_id")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Invalid input type.");
            });
        });
        test("404 - returns not found for non-existent favourite id", () => {
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
        test("400 - returns bad request for invalid property id", () => {
          return request(app)
            .get("/api/properties/invalid_id/reviews")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Invalid input type.");
            });
        });
        test("404 - returns not found for non-existent property id", () => {
          return request(app)
            .get("/api/properties/99999/reviews")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("No record found.");
            });
        });
      });
      describe("POST", () => {
        test("405 - method not allowed [patch or put] for review", () => {
          const invalidMethods = ["patch", "put"];

          return Promise.all(
            invalidMethods.map((method) => {
              return request(app)
                [method]("/api/properties/1/reviews")
                .expect(405)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe("Method not allowed.");
                });
            })
          );
        });
        test("400 - returns bad request for missing fields", () => {
          const postData = {
            rating: 4,
            comment: "test comment",
          };
          return request(app)
            .post("/api/properties/1/reviews")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Bad request.");
            });
        });
        test("400 - returns bad request for invalid fields", () => {
          const postData = {
            guestid: 1,
            rat: 4,
            cmt: "test comment",
          };
          return request(app)
            .post("/api/properties/1/reviews")
            .send(postData)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Bad request.");
            });
        });
        test("404 - returns not found  for invalid foreign key reference fields - guest_id", () => {
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
        test("404 - returns not found  for invalid foreign key reference fields - property_id", () => {
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
        test("400 - returns bad request for invalid id", () => {
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
      describe("DELETE", () => {
        test("400 - returns bad request for invalid id", () => {
          return request(app)
            .delete("/api/reviews/invalid_id")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Invalid input type.");
            });
        });
        test("404 - returns not found for non-existent review id", () => {
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
});
