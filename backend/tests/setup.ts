import { beforeAll, afterAll, afterEach } from "vitest";
import { db } from "../src/db/connection.js";

beforeAll(async () => {
    process.env.DATABASE_URL = process.env.TEST_DATABASE_URL as string;
});

afterEach(async () => {});

afterAll(async () => {

});