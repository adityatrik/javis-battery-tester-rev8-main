CREATE TABLE `riwayat_pengujian` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `sn` varchar(50) DEFAULT NULL,
  `model_id` int(11) DEFAULT NULL,
  `tipe_cell` varchar(100) DEFAULT NULL,
  `tegangan` varchar(20) DEFAULT NULL,
  `arus` varchar(20) DEFAULT NULL,
  `pengosongan_baterai` varchar(20) DEFAULT NULL,
  `pengisian_baterai` varchar(20) DEFAULT NULL,
  `kapasitas_baterai` varchar(20) DEFAULT NULL,
  `cell_1` varchar(20) DEFAULT NULL,
  `cell_2` varchar(20) DEFAULT NULL,
  `cell_3` varchar(20) DEFAULT NULL,
  `cell_4` varchar(20) DEFAULT NULL,
  `cell_5` varchar(20) DEFAULT NULL,
  `cell_6` varchar(20) DEFAULT NULL,
  `cell_7` varchar(20) DEFAULT NULL,
  `cell_8` varchar(20) DEFAULT NULL,
  `rata-rata-cell` varchar(20) DEFAULT NULL,
  `selisih-cell` varchar(20) DEFAULT NULL,
)

INSERT INTO riwayat_pengujian (sn, model_id, tipe_cell) VALUES ();
