/*------------------------------------------
-----------------STRUCTURE------------------
------------------------------------------*/

CREATE TABLE `floor` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`color` VARCHAR(25) NOT NULL,
	`caption` TEXT,
	
	PRIMARY KEY (`id`),
	UNIQUE (`color`)
);

CREATE TABLE `room` (
    `id` INT NOT NULL AUTO_INCREMENT,
	`number` INT NOT NULL,
	`floor` INT NOT NULL,
	`spots` INT NOT NULL,

	PRIMARY KEY (`id`),
	FOREIGN KEY (`floor`) REFERENCES `floor`(`id`),
	UNIQUE (`number`, `floor`)
);

CREATE TABLE `roomMeta` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`room` INT NOT NULL,
	`bedsSmall` INT,
	`bedsDouble` INT,
	`balcony` BOOLEAN,
	`fridge` BOOLEAN,
	`tv` BOOLEAN,
	`bathroom` BOOLEAN,
	`kettle` BOOLEAN,
	
	PRIMARY KEY (`id`),
	FOREIGN KEY (`room`) REFERENCES `room`(`id`)
);

CREATE TABLE `roomImages` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`room` INT NOT NULL,
	`imageLink` VARCHAR(255),
	`default` BOOLEAN NULL DEFAULT NULL,
	`created` DATETIME DEFAULT CURRENT_TIMESTAMP,
	`added` DATETIME DEFAULT CURRENT_TIMESTAMP,
	
    UNIQUE(`default`, `room`),
	PRIMARY KEY (`id`),
	FOREIGN KEY (`room`) REFERENCES `room`(`id`)
);

CREATE TABLE `guest` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`firstname` VARCHAR(50),
	`lastname` VARCHAR(50) NOT NULL,
	`pesel` VARCHAR(11) UNIQUE,
	`email` VARCHAR(64) UNIQUE,
	`streetName` VARCHAR(50),
	`postcode` VARCHAR(10),
	`city` VARCHAR(50),
	`phoneNumber` VARCHAR(15),
	`added` DATETIME DEFAULT CURRENT_TIMESTAMP,
	`additionalGuestInfo` TEXT,
	
	PRIMARY KEY (`id`)
);

CREATE TABLE `reservation` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`room` INT NOT NULL,
	`guest` INT NOT NULL,
	`numberOfPeople` INT NOT NULL,
	`pricePerDay` DECIMAL(15,2) NOT NULL,
    `token` CHAR(128) UNIQUE,
	`added` DATETIME DEFAULT CURRENT_TIMESTAMP,
	`start` DATE NOT NULL,
	`end` DATE NOT NULL,
	`deleted` BOOLEAN DEFAULT 0,
	`additionalResInfo` TEXT,
	
	PRIMARY KEY (`id`),
	FOREIGN KEY (`room`) REFERENCES `room`(`id`),
	FOREIGN KEY (`guest`) REFERENCES `guest`(`id`)
);

CREATE TABLE `payment` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`reservation` INT NOT NULL,
	`type` VARCHAR(30) NOT NULL,
	`amount` DECIMAL(15,2) NOT NULL,
	`added` DATETIME DEFAULT CURRENT_TIMESTAMP,
	`returned` BOOLEAN DEFAULT 0,
	`deleted` BOOLEAN DEFAULT 0,
	
	PRIMARY KEY (`id`),
	FOREIGN KEY (`reservation`) REFERENCES `reservation`(`id`)
);

CREATE OR REPLACE VIEW `depositView` AS
	SELECT `reservation`.`id` AS `reservation`, sum(`payment`.`amount`) AS `amount`
	FROM `reservation` RIGHT JOIN `payment` ON `reservation`.`id` = `payment`.`reservation` WHERE `payment`.`type` = 'deposit' GROUP BY `payment`.`reservation`;

CREATE OR REPLACE VIEW `resSummary` AS
	SELECT `res`.`id` AS `resID`, `res`.`room` AS `roomID`, `res`.`guest` AS `guestID`, `res`.`token` AS `resToken`, `g`.`firstname` AS `guestFirstname`, `g`.`lastname` AS `guestLastname`, `g`.`phoneNumber` AS `guestPhoneNumber`, `res`.`numberOfPeople` AS `numberOfPeople`, `res`.`pricePerDay` AS `pricePerDay`, `res`.`added` AS `resAdded`, `res`.`start` AS `resStart`, `res`.`end` AS `resEnd`, `d`.`amount` AS `depoAmount`, `r`.`spots` AS `roomSpots`, `res`.`additionalResInfo` AS `additionalResInfo`
	FROM `reservation` AS `res` LEFT JOIN `guest` AS `g` ON `res`.`guest` = `g`.`id` JOIN `room` AS `r` ON `res`.`room` = `r`.`id` LEFT JOIN `depositView` AS `d` ON `d`.`reservation` = `res`.`id` WHERE `res`.`deleted` = 0 ORDER BY `res`.`start` ASC;
	    
CREATE OR REPLACE VIEW `defaultRoomImagesView` AS
    SELECT * FROM `roomImages` WHERE `default` = 1;

CREATE OR REPLACE VIEW `roomView` AS
    SELECT `r`.`id` AS `roomID`, `r`.`number` AS `roomNumber`, `r`.`floor` AS `floorNumber`, `r`.`spots` AS `spots`, `f`.`color` AS `floorColor`, `f`.`caption` AS `floorCaption`, `i`.`imageLink` AS `defaultImageLink`
	FROM `room` `r` LEFT JOIN `floor` AS `f` ON `r`.`floor` = `f`.`id` LEFT JOIN `defaultRoomImagesView` AS `i` ON `r`.`id` = `i`.`room`;

CREATE TABLE `user` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`firstname` VARCHAR(50) NOT NULL,
	`lastname` VARCHAR(50),
	`username` VARCHAR(25) UNIQUE NOT NULL,
	`password` VARCHAR(256) NOT NULL,
	`created` DATETIME DEFAULT CURRENT_TIMESTAMP,
	`additionalInfo` TEXT,
	
	PRIMARY KEY (`id`)
);

CREATE TABLE `token` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`token` VARCHAR(64) NOT NULL,
	`userAgent` VARCHAR(512),
	`user` INT NOT NULL,
	`created` DATETIME DEFAULT CURRENT_TIMESTAMP,
	`accessed` DATETIME DEFAULT CURRENT_TIMESTAMP,
	
	PRIMARY KEY (`id`),
	FOREIGN KEY (`user`) REFERENCES `user`(`id`)
);

CREATE TABLE `settings` (
	`name` VARCHAR(256) NOT NULL,
	`value` VARCHAR(256) NOT NULL,

	PRIMARY KEY (`name`)
);

/*------------------------------------------
-----------------TEST DATA------------------
------------------------------------------*/

INSERT INTO `floor` (`color`, `caption`) VALUES
	('#7f3f00', 'parter'),
	('#00ff00', 'I piętro'),
	('#ff0000', 'II piętro'),
	('#cece00', 'I nowy'),
	('#db00cc', 'II nowy');

INSERT INTO `room` (`number`, `floor`, `spots`) VALUES
	(1, 2, 3),
	(2, 2, 4),
	(5, 2, 5),
	(1, 3, 4),
	(2, 3, 4),
	(3, 3, 3),
	(4, 3, 3),
	(5, 3, 3),
	(6, 3, 5),
	(1, 4, 3),
	(2, 4, 4),
	(3, 4, 3),
	(4, 4, 3),
	(5, 4, 3),
	(1, 5, 3),
	(2, 5, 3),
	(1, 1, 4),
	(2, 1, 4);

INSERT INTO `guest` (`firstname`, `lastname`, `pesel`, `streetName`, `postcode`, `city`, `phoneNumber`) VALUES
	('Radosław', 'Kowalski', NULL, NULL, NULL, NULL, '1234567890'),
	('Andrzej', 'Męcik', NULL, NULL, NULL, NULL, '987654321'),
	('Damian', 'Marcinkowski', NULL, NULL, NULL, NULL, '1029384756'),
	('Jacek', 'Wąsik', NULL, NULL, NULL, NULL, '901278456'),
	('Marcin', 'Rak', NULL, NULL, NULL, NULL, '5647382910'),
	('Adrian', 'Kloc', NULL, NULL, NULL, NULL, '1647382905'),
	('Agnieszka', 'Drwęc', NULL, NULL, NULL, NULL, '581230983'),
	('Jan', 'Zając', NULL, NULL, NULL, NULL, '581230984');

INSERT INTO `reservation` (`room`, `guest`, `numberOfPeople`, `pricePerDay`, `added`, `start`, `end`, `token`) VALUES
	(1, 1, 3, '120.00', '2019-08-02 00:34:57', '2019-08-15', '2019-08-20', '42Tf6M3tX79JuYGKk6CDuo'),
	(1, 2, 3, '130.00', '2019-08-03 00:34:57', '2019-08-20', '2019-08-24', '5NGG2ZX6Vw6PQBqq3B36Hz'),
	(6, 3, 2, '150.00', '2019-08-03 01:50:37', '2019-08-08', '2019-08-28', '3pmBV2YGAZ8S4VFG6pgKBf'),
	(14, 2, 2, '160.00', '2019-08-02 01:30:35', '2019-08-08', '2019-08-20', 'Z2Tf6M3GAZ8STcBaq3CLNx'),
	(3, 4, 2, '100.00', '2019-08-03 01:51:44', '2019-08-03', '2019-08-11', 'XSwnB4zm9RY4danD5cwUuX'),
	(4, 1, 2, '200.00', '2019-08-05 01:31:56', '2019-07-31', '2019-08-01', 'TKy4CpcALXpHfwMifNjfLE'),
	(13, 3, 3, '200.00', '2019-08-05 01:31:56', '2019-06-29', '2019-07-03', '7fXzCnp5WaiHp8JDgaP9ix'),
	(18, 5, 4, '175.00', '2019-08-06 17:13:02', '2019-08-05', '2019-08-09', 'Focq8jFWrSv22jDEFyBo14');
	
INSERT INTO `payment` (`reservation`, `amount`, `type`, `added`) VALUES
	(3, '2850.00', 'payment', '2019-08-05 20:20:42'),
	(1, '200.00', 'deposit', '2019-08-03 14:18:13'),
	(3, '155.00', 'deposit', '2019-08-05 20:17:27'),
	(7, '230.00', 'deposit', '2019-08-06 17:13:19');

INSERT INTO `user` (`firstname`, `username`, `password`) VALUES
	('Admin', 'admin', '37a8eec1ce19687d132fe29051dca629d164e2c4958ba141d5f4133a33f0688f'),
	('Michał', 'xtry333', '2ad6be3141bdc6b0bf76b53c4fc47dc66fc88d83f363b6c66e4a2870494a35ec');

