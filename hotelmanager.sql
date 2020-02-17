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
	`phoneNumber` VARCHAR(15),
	`streetName` VARCHAR(50),
	`houseNumber` VARCHAR(50),
	`city` VARCHAR(50),
	`postcode` VARCHAR(10),
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
	`email` VARCHAR(64) UNIQUE NOT NULL,
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
	`lastAccessed` DATETIME DEFAULT CURRENT_TIMESTAMP,
	
	PRIMARY KEY (`id`),
	FOREIGN KEY (`user`) REFERENCES `user`(`id`)
);

CREATE TABLE `settings` (
	`name` VARCHAR(256) NOT NULL,
	`value` VARCHAR(256) NOT NULL,

	PRIMARY KEY (`name`)
);
