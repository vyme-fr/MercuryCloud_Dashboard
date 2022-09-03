SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

CREATE TABLE `products` (
  `id` text NOT NULL,
  `category` text NOT NULL,
  `name` text NOT NULL,
  `description` text NOT NULL,
  `price` text NOT NULL,
  `configuration` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `roles` (
  `id` text NOT NULL,
  `name` text NOT NULL,
  `permissions` text NOT NULL DEFAULT 'NONE'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `services` (
  `id` text NOT NULL,
  `uuid` text NOT NULL,
  `name` text NOT NULL,
  `product_id` text NOT NULL,
  `price` text NOT NULL,
  `statut` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `users` (
  `uuid` text NOT NULL,
  `username` text NOT NULL,
  `mail` text NOT NULL,
  `token` text NOT NULL,
  `password` text NOT NULL,
  `role` text NOT NULL,
  `first_name` text NOT NULL,
  `last_name` text NOT NULL,
  `tel` text NOT NULL,
  `address_1` text NOT NULL,
  `address_2` text NOT NULL DEFAULT 'Aucune deuxième adresse définie',
  `city` text NOT NULL,
  `zip` text NOT NULL,
  `country` text NOT NULL,
  `state` text NOT NULL,
  `balance` float NOT NULL,
  `tickets` int(11) NOT NULL,
  `services` int(11) NOT NULL,
  `suspend_services` int(11) NOT NULL,
  `alerts` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `products`
  ADD UNIQUE KEY `id` (`id`) USING HASH;

ALTER TABLE `roles`
  ADD UNIQUE KEY `id` (`id`) USING HASH;

ALTER TABLE `services`
  ADD UNIQUE KEY `id` (`id`) USING HASH;

ALTER TABLE `users`
  ADD UNIQUE KEY `uuid` (`uuid`) USING HASH,
  ADD UNIQUE KEY `username` (`username`) USING HASH,
  ADD UNIQUE KEY `mail` (`mail`) USING HASH,
  ADD UNIQUE KEY `token` (`token`) USING HASH;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;