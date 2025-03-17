import { AquaBase } from "./config/AquaBase.ts";

const db = new AquaBase().createDatabase('test')

db.createCollection('test', 'users')
