import { AquaBase } from "./config/AquaBase.ts";
import { faker } from "@faker-js/faker/locale/en";

const db = new AquaBase("67d89f7d91e2ee84a95e4b0c");

// console.log(db.add("users", { name: faker.word.sample(50), age: faker.number.int() }))
// console.log(db.getAll("users"));
console.time("add");
console.log(db.get("users/67d8f4ab12b23fc77fcafa67"));
console.log(db.delete("users/67d8f4ab12b23fc77fcafa67"));
console.log(db.get("users/67d8f4ab12b23fc77fcafa67"));
for (let i = 0; i < 1000000; i++) {
  db.add("users", { name: faker.word.sample(50), age: faker.number.int() });
}

db.writeToFile()

console.timeEnd("add");
