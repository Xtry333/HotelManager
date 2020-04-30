import { Sequelize } from "sequelize-typescript";
import { Guest } from "models/GuestDBO";
import { Reservation } from "models/ReservationDBO";
import { Room } from "models/RoomDBO";
import { User } from "models/UserDBO";
import { Address } from "models/AddressDBO";
import { Payment } from "models/PaymentDBO";

import * as dotenv from 'dotenv';
dotenv.config();

export default new Sequelize({
    dialect: 'mysql',
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DB_NAME,
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PW,
    models: [Address, Guest, Room, User,Reservation, Payment]
});