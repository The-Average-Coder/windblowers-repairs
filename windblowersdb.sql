-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: bfasfuzmwn5odj4hub9k-mysql.services.clever-cloud.com:3306
-- Generation Time: Aug 22, 2023 at 03:24 PM
-- Server version: 8.0.22-13
-- PHP Version: 8.2.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bfasfuzmwn5odj4hub9k`
--

-- --------------------------------------------------------

--
-- Table structure for table `calendar_events`
--

CREATE TABLE `calendar_events` (
  `id` int NOT NULL,
  `repair_id` int NOT NULL,
  `title` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `color` varchar(10) COLLATE utf8mb4_general_ci NOT NULL,
  `time` int NOT NULL,
  `start` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `end` varchar(20) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `calendar_events`
--

INSERT INTO `calendar_events` (`id`, `repair_id`, `title`, `color`, `time`, `start`, `end`) VALUES
(107, 49, 'B♭. 2330001 2 Hr 0 Mins', 'gray', 120, '2023-08-16', '2023-08-18');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` int NOT NULL,
  `surname` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `firstname` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `telephone` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `address` varchar(250) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `surname`, `firstname`, `telephone`, `email`, `address`) VALUES
(9, 'Smith', 'Walter', '07493817632', '', '17 Fake Road'),
(10, 'Doe', 'John', '07748271643', 'johndoe@gmail.com', ''),
(11, 'Cox', 'Joshua', '07796593187', 'joshuajosephcox@gmail.com', ''),
(12, 'Hello', 'hELLO', '12374789', 'shdfa', 'sjkfghjh');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int NOT NULL,
  `repair_id` int NOT NULL,
  `title` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `instrument` varchar(30) COLLATE utf8mb4_general_ci NOT NULL,
  `job_number` varchar(10) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `repair_id`, `title`, `instrument`, `job_number`) VALUES
(14, 59, 'Job Ready To Be Signed Off', 'alto flute', '2334001');

-- --------------------------------------------------------

--
-- Table structure for table `repairers`
--

CREATE TABLE `repairers` (
  `id` int NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `repairers`
--

INSERT INTO `repairers` (`id`, `name`) VALUES
(4, 'Purple');

-- --------------------------------------------------------

--
-- Table structure for table `repairs`
--

CREATE TABLE `repairs` (
  `id` int NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `job_number` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `customer_id` int NOT NULL,
  `instrument` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `manufacturer` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `model` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `serial_number` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `notes` text COLLATE utf8mb4_general_ci NOT NULL,
  `has_been_assessed` int NOT NULL DEFAULT '0',
  `expected_time` int DEFAULT NULL,
  `cost_for_time` int DEFAULT NULL,
  `materials_notes` text COLLATE utf8mb4_general_ci,
  `materials_cost_us` int DEFAULT NULL,
  `materials_cost_customer` int DEFAULT NULL,
  `misc_notes` text COLLATE utf8mb4_general_ci,
  `has_been_allocated` int NOT NULL DEFAULT '0',
  `repairer_id` int DEFAULT NULL,
  `deadline` date DEFAULT NULL,
  `timer` int NOT NULL DEFAULT '0',
  `unallocated_time_calendar` int NOT NULL DEFAULT '0',
  `has_been_updated` int NOT NULL DEFAULT '0',
  `updated_expected_time` int NOT NULL DEFAULT '0',
  `updated_cost_for_time` int DEFAULT NULL,
  `updated_materials_cost_us` int DEFAULT NULL,
  `updated_materials_cost_customer` int DEFAULT NULL,
  `open_job_notes` text COLLATE utf8mb4_general_ci,
  `has_been_requested_finished` int NOT NULL DEFAULT '0',
  `date_created` datetime NOT NULL,
  `date_finished` datetime DEFAULT NULL,
  `date_collected` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `repairs`
--

INSERT INTO `repairs` (`id`, `status`, `job_number`, `customer_id`, `instrument`, `manufacturer`, `model`, `serial_number`, `notes`, `has_been_assessed`, `expected_time`, `cost_for_time`, `materials_notes`, `materials_cost_us`, `materials_cost_customer`, `misc_notes`, `has_been_allocated`, `repairer_id`, `deadline`, `timer`, `unallocated_time_calendar`, `has_been_updated`, `updated_expected_time`, `updated_cost_for_time`, `updated_materials_cost_us`, `updated_materials_cost_customer`, `open_job_notes`, `has_been_requested_finished`, `date_created`, `date_finished`, `date_collected`) VALUES
(49, 'collected', '2330001', 9, 'b♭ clarinet', 'Buffet Crampon', 'Légende', 'ABC123', '', 1, 240, 160, '', 6, 10, '', 1, 4, '2023-08-02', 0, 120, 0, 0, 0, 0, 0, NULL, 1, '2023-07-27 13:28:26', '2023-08-14 09:52:56', '2023-08-14 09:54:19'),
(50, 'collected', '2330002', 10, 'bass saxophone', 'Selmer', 'SA80/II', 'DEF456', '', 1, 750, 500, '', 100, 150, '', 1, 4, '2023-08-04', 0, 750, 0, 0, 0, 0, 0, NULL, 1, '2023-07-27 13:29:11', '2023-08-14 09:54:52', '2023-08-14 09:55:57'),
(51, 'collected', '2330003', 9, 'bassoon', 'Fox', '201D', 'GHI789', '', 1, 840, 560, '', 0, 0, '', 1, 4, '2023-08-10', 0, 840, 0, 0, 0, 0, 0, NULL, 1, '2023-07-27 13:30:03', '2023-08-14 09:56:17', '2023-08-22 11:51:47'),
(52, 'collected', '2330004', 0, 'concert flute', 'Pearl', 'Elegante Primo', '123ABC', '', 1, 210, 140, '', 5, 8, '', 1, 4, '2023-08-01', 3, 210, 0, 0, 0, 0, 0, NULL, 1, '2023-07-27 13:36:39', '2023-07-27 13:37:59', '2023-08-08 10:02:20'),
(53, 'collected', '2330005', 9, 'concert flute', 'Yamaha', 'YFL 212', '456DEF', '', 1, 495, 330, '', 20, 24, '', 1, 4, '2023-07-29', 0, 495, 0, 0, 0, 0, 0, NULL, 1, '2023-07-27 13:38:24', '2023-07-27 13:39:43', '2023-08-08 10:02:37'),
(54, 'collected', '2330006', 10, 'concert flute', 'Yamaha', 'YFL 312 GL', 'ABC123', '', 1, 240, 160, '', 10, 12, '', 1, 4, '2023-08-09', 15, 240, 0, 0, 0, 0, 0, NULL, 1, '2023-07-27 13:41:58', '2023-07-27 14:40:53', '2023-08-08 10:02:17'),
(55, 'collected', '2330007', 11, 'concert flute', 'Yamaha', 'YFL 312 GL', 'ABC123', 'hh', 1, 240, 160, 'guyu', 2, 3, '', 1, 4, '2023-08-11', 0, 240, 0, 0, 0, 0, 0, NULL, 1, '2023-07-27 14:16:54', '2023-08-08 09:48:49', '2023-08-08 09:48:52'),
(56, 'complete', '2332001', 9, 'a clarinet', 'sdfg', 'sdfg', 'sdfg', 'sdfg', 1, 780, 520, '', 0, 0, '', 1, 4, '2023-08-24', 0, 780, 0, 0, 0, 0, 0, NULL, 1, '2023-08-08 10:02:46', '2023-08-14 09:56:09', NULL),
(57, 'collected', '2333001', 10, 'piccolo', 'hjk', 'gfh', 'fgh', '', 1, 300, 200, '', 0, 0, '', 1, 4, '2023-08-27', 0, 300, 0, 0, 0, 0, 0, NULL, 1, '2023-08-14 08:48:51', '2023-08-14 08:51:51', '2023-08-14 08:51:55'),
(58, 'assessment / quote', '2333002', 10, 'bass flute', '3456', '3456', '3456', '', 0, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, 0, 0, 0, 0, 0, 0, 0, NULL, 0, '2023-08-14 11:29:58', NULL, NULL),
(59, 'open', '2334001', 10, 'alto flute', '1234', '1234', '1234', '', 1, 150, 100, 'hello', 4, 8, '', 0, NULL, NULL, 0, 0, 0, 0, NULL, NULL, NULL, NULL, 1, '2023-08-22 11:16:16', NULL, NULL),
(60, 'collected', '2334002', 12, 'piccolo', '124', '1234', '1234', '1234', 1, 285, 190, '', 0, 0, '', 1, 4, '2023-08-11', 13, 285, 1, 1185, 790, 0, 0, NULL, 1, '2023-08-22 11:23:01', '2023-08-22 11:52:31', '2023-08-22 11:52:38');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `calendar_events`
--
ALTER TABLE `calendar_events`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `repairers`
--
ALTER TABLE `repairers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `repairs`
--
ALTER TABLE `repairs`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `calendar_events`
--
ALTER TABLE `calendar_events`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=108;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `repairers`
--
ALTER TABLE `repairers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `repairs`
--
ALTER TABLE `repairs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
