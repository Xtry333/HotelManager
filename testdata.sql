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
    ('Michał', 'Woźniak', '12345678901', 'Reymonta', '84-120', 'Władysławowo', '511451702'),
	('Radosław', 'Kowalski', NULL, NULL, NULL, NULL, '1234567890'),
	('Andrzej', 'Męcik', NULL, NULL, NULL, NULL, '987654321'),
	('Damian', 'Marcinkowski', NULL, NULL, NULL, NULL, '1029384756'),
	('Jacek', 'Wąsik', NULL, NULL, NULL, NULL, '901278456'),
    ('Tadeusz', 'Bąk', '09876543211', 'Wąska', '12-345', 'Warszawa', '543543678'),
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

INSERT INTO `user` (`firstname`, `username`, `email`, `password`) VALUES
	('Admin', 'admin', 'admin@manager.com', '37a8eec1ce19687d132fe29051dca629d164e2c4958ba141d5f4133a33f0688f'),
	('Michał', 'xtry333', 'xtry333@gmail.com', '2ad6be3141bdc6b0bf76b53c4fc47dc66fc88d83f363b6c66e4a2870494a35ec');

