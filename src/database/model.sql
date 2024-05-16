CREATE TABLE `daftar_model` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `model_produk` VARCHAR(50) NOT NULL,
  `varian` VARCHAR(10) NOT NULL,
  `versi` VARCHAR(50) NOT NULL,
  `tegangan` VARCHAR(50) NOT NULL,
  `tegangan_pengisian` VARCHAR(50) NOT NULL,
  `kapasitas` VARCHAR(50) NOT NULL,
  `jumlah_cell` VARCHAR(50) NOT NULL
)

INSERT INTO daftar_model (model_produk, varian, versi, tegangan, tegangan_pengisian, kapasitas, jumlah_cell)
VALUES ('JB-120.40C.1B-L', 'Lithium Iron (LiFePO4)', '1.0', '25.6V', '29.2V', '120Ah', '40');

INSERT INTO daftar_model (model_produk, varian, versi, tegangan, tegangan_pengisian, kapasitas, jumlah_cell)
VALUES ('JB-50.16C.1B-L', 'Lithium Iron (LiFePO4)', '1.0', '25.6V', '29.2V', '50Ah', '16');

INSERT INTO daftar_model (model_produk, varian, versi, tegangan, tegangan_pengisian, kapasitas, jumlah_cell)
VALUES ('JB-80.32C.1B-L', 'Lithium Iron (LiFePO4)', '1.0', '25.6V', '29.2V', '80Ah', '32');