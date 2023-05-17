process.env.NODE_ENV = "test";

const request = require("supertest");
const { response } = require("../app");

const app = require("../app");

let items = require("../fakeDb")

let item = { name: "Green Tea", price: "$.99" }

beforeEach(async () => {
    items.push(item)
});

afterEach(async () => {
    items = [];
});


describe("GET /items", async function () {
    test("Get list of all items", async function () {
        const response = await request(app).get(`/items`);
        const { items } = response.body;
        expect(response.statusCode).toBe(200);
        expect(items).toHaveLength(1);
    });
});

describe("POST /item", async function () {
    test("Add item to the list", async function () {
        const response = await request(app)
            .post('/items')
            .send({
                name: "Soda",
                price: "2"
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.item).toHaveProperty("name");
        expect(response.body.item).toHaveProperty("price");
        expect(response.body.item.name).toEqual("Soda");
        expect(response.body.item.price).toEqual("2");

    });
});

describe("GET /item", async function () {
    test("Get a specific item from the list", async function () {
        const response = await response(app).get(`/items/${item.name}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.item).toEqual(item);
    })
    test("Failed request when item is not on the list", async function () {
        const response = await response(app).get(`/items/GreenT`);
        expect(response.statusCode).toBe(404)
    });
});


decribe("PATCH /items/:name", async function () {
    test("Update a specific item from the list", async function () {
        const response = await response(app)
            .patch(`/items/${item.name}`)
            .send({
                name: "Burrito"
            });
        expect(response.statusCode).toBe(200);
        expect(response.body.item).toEqual({
            name: "Burrito"
        });
    });
    test("Responds with 404 if can't find item", async function () {
        const response = await request(app).patch(`/items/0`);
        expect(response.statusCode).toBe(404);
    });
});


describe("DELETE /items/:name", async function () {
    test("Deletes and item off the list", async function () {
        const response = await request(app)
            .delete(`/items/${item.name}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ message: "Deleted " });
    });
});