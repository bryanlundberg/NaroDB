import { Naro } from "./config/Naro.ts";
import { faker } from "@faker-js/faker/locale/en";

const db = new Naro("67d89f7d91e2ee84a95e4b0c");

// console.log(db.getAll("users"));
console.time("test");

db.add("users", { name: faker.word.sample(50), age: faker.number.int(50) });
db.add("test", { name: faker.word.sample(50), age: faker.number.int(50) });
db.add("tickets", { name: faker.word.sample(50), age: faker.number.int(50) });
// console.log(db.getAll("users"))
// const id = "67da1dd162d2360c1b5999c2"
// console.log(db.get("users/"+id));
// console.log(db.delete("users/"+id));
// console.log(db.get("users/"+id));
// console.log(db.add("users", { name: faker.word.sample(50), age: faker.number.int() }))
// console.log(db.getAll("users"));
// db.delete("users/67dac46096caf856607aac67");
// console.time("write");
db.writeToFile()
// console.timeEnd("write");
console.timeEnd("test");

