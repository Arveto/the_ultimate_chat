CREATE TABLE `messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content` mediumtext NOT NULL,
  `sender_id` mediumint(9) unsigned DEFAULT NULL,
  `room_id` smallint(6) unsigned DEFAULT NULL,
  `timestamp` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8;

CREATE TABLE `rooms` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(25) NOT NULL,
  `n_users` smallint(5) unsigned DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

CREATE TABLE `users` (
  `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `pseudo` varchar(25) NOT NULL,
  `password` varchar(25) NOT NULL,
  `socket_id` varchar(20) DEFAULT NULL,
  `room_id` smallint(5) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `pseudo_UNIQUE` (`pseudo`),
  UNIQUE KEY `socketio_id_UNIQUE` (`socket_id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8;
