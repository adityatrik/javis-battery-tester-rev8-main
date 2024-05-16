import React, { useEffect, useState } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  Alert,
  AlertTitle,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Modal
} from '@mui/material';
import logo from '../assets/logo_javis.png';
import '../assets/fonts.css';
import { Link, useNavigate } from 'react-router-dom';

import { styled } from '@mui/material/styles';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const ReportPage = () => {
  const navigate = useNavigate();

  const [modalSelesai, setModalSelesai] = useState(false);
  const [modalConfirmation, setModalConfirmation] = useState(false);

  const [waktuPengujian, setWaktuPengujian] = useState('');

  const [modelProduk, setModelProduk] = useState('');
  const [varian, setVarian] = useState('');
  const [versi, setVersi] = useState('');
  const [tegangan, setTegangan] = useState('');
  const [teganganPengisian, setTeganganPengisian] = useState('');
  const [kapasitas, setKapasitas] = useState('');
  const [kapasitasAh, setKapasitasAh] = useState('');
  const [jumlahCell, setJumlahCell] = useState('');
  const [tipeCell, setTipeCell] = useState('');
  const [com, setCom] = useState('');
  const [statusKomunikasi, setStatusKomunikasi] = useState('Tidak Terhubung');
  const [statusBaterai, setStatusBaterai] = useState('-');

  const [teganganBaterai, setTeganganBaterai] = useState('');
  const [pengosonganBaterai, setPengosonganBaterai] = useState('');
  const [pengisianBaterai, setPengisianBaterai] = useState('');
  const [kapasitasTersisa, setKapasitasTersisa] = useState('');
  const [kapasitasTersisaAh, setKapasitasTersisaAh] = useState('');
  const [cell1, setCell1] = useState('');
  const [cell2, setCell2] = useState('');
  const [cell3, setCell3] = useState('');
  const [cell4, setCell4] = useState('');
  const [cell5, setCell5] = useState('');
  const [cell6, setCell6] = useState('');
  const [cell7, setCell7] = useState('');
  const [cell8, setCell8] = useState('');
  const [rataRata, setRataRata] = useState('');
  const [selisih, setSelisih] = useState('');

  const [tahapPengujian1, setTahapPengujian1] = useState('TIDAK LULUS');
  const [tahapPengujian2, setTahapPengujian2] = useState('TIDAK LULUS');
  const [tahapPengujian3, setTahapPengujian3] = useState('TIDAK LULUS');
  const [tahapPengujian4, setTahapPengujian4] = useState('TIDAK LULUS');
  const [tahapPengujian5, setTahapPengujian5] = useState('TIDAK LULUS');
  const [tahapPengujian6, setTahapPengujian6] = useState('TIDAK LULUS');
  const [tahapPengujian7, setTahapPengujian7] = useState('TIDAK LULUS');
  const [tahapPengujian8, setTahapPengujian8] = useState('TIDAK LULUS');
  const [tahapPengujian9, setTahapPengujian9] = useState('TIDAK LULUS');
  const [tahapPengujian10, setTahapPengujian10] = useState('TIDAK LULUS');
  const [tahapPengujian11, setTahapPengujian11] = useState('TIDAK LULUS');
  const [tahapPengujian12, setTahapPengujian12] = useState('TIDAK LULUS');
  const [tahapPengujian13, setTahapPengujian13] = useState('TIDAK LULUS');
  const [tahapPengujian14, setTahapPengujian14] = useState('TIDAK LULUS');
  const [tahapPengujian15, setTahapPengujian15] = useState('TIDAK LULUS');

  const [hasilPengujian, setHasilPengujian] = useState('TIDAK LULUS');
  const [serialNumber, setSerialNumber] = useState('')

  const handlePrint = () => {
    setModalSelesai(false);
    setTimeout(() => {
      window.print();
    }, 300)
  };

  const handleToSetup = () => {
    navigate('/');
    window.electron.ipcRenderer.send('send-data', 'REFRESH COM');
  }

  const handleSelesai = () => {
    setModalSelesai(true);
  };

  const handleKeluar = () => {
    setModalConfirmation(true);
  };

  const handleCancelModal = () => {
    setModalSelesai(false);
    setModalConfirmation(false)
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const formattedTime = `${padZero(now.getDate())}/${padZero(now.getMonth() + 1)}/${now.getFullYear()} ${padZero(now.getHours())}:${padZero(now.getMinutes())}:${padZero(now.getSeconds())}`;
      setWaktuPengujian(formattedTime)
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const padZero = (num) => {
    return (num < 10 ? '0' : '') + num;
  };

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('id_user'))
    console.log('click : ',items.click);

    if (items.click === 2) {
      window.electron.ipcRenderer.send('query_history', items.sn);
    }

    setSerialNumber(items.sn);
    setCom(items.port);
    window.electron.ipcRenderer.send('query_model', items.model);
    console.log(items.sn);
  },[])

  useEffect(() => {
    window.electron.ipcRenderer.on('history-data', (event, data) => {
      setPengosonganBaterai(data.pengosongan_baterai);
      setPengisianBaterai(data.pengisian_baterai);
    });

    return () => {
      window.electron.ipcRenderer.removeAllListeners('history-data');
    };
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on('model-data', (event, data) => {
      console.log(data);
      setModelProduk(data.model_produk);
      setVarian(data.varian);
      setVersi(data.versi);
      setTegangan(data.tegangan);
      setTeganganPengisian(data.tegangan_pengisian);
      setKapasitas(data.kapasitas);
      setKapasitasAh(data.kapasitasAh);
      setJumlahCell(data.jumlah_cell);
      setTipeCell('IFP20100140A-26Ah')
    });

    return () => {
      window.electron.ipcRenderer.removeAllListeners('model-data');
    };
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on('basicParameterData', (event, data) => {
      setStatusBaterai('Terhubung');
      // console.log(data.vbat);
      setTeganganBaterai(`${data.vbat} V`);
      if (data.vbat >= 26.5) {
        setTahapPengujian1('LULUS');
      }else
      {
        setTahapPengujian1('TIDAK LULUS');
      }

      setPengosonganBaterai(`${data.dischargingCapacity} Wh`);
      if (data.dischargingCapacity >= parseInt(kapasitas)) {
        setTahapPengujian2('LULUS');
      }else
      {
        setTahapPengujian2('TIDAK LULUS');
      }

      setPengisianBaterai(`${data.chargingCapacity} Wh`);
      if (data.chargingCapacity >= parseInt(kapasitas)) {
        setTahapPengujian3('LULUS');
      }else
      {
        setTahapPengujian3('TIDAK LULUS');
      }

      setKapasitasTersisa(`${data.capacity} Wh`);
      if (data.capacity >= parseInt(kapasitas)) {
        setTahapPengujian4('LULUS');
      }else
      {
        setTahapPengujian4('TIDAK LULUS');
      }

      setKapasitasTersisaAh(`${data.capacityAh} Ah`);
      if (data.capacityAh >= parseInt(kapasitasAh)) {
        setTahapPengujian15('LULUS');
      }else
      {
        setTahapPengujian15('TIDAK LULUS');
      }

      setStatusKomunikasi('Terhubung');
      if (data.current < 0) {
        setStatusBaterai(`Discharging (${data.current}A)`)
      }else if (data.current == 0) {
        setStatusBaterai('Standby (0A)');
      }else
      {
        setStatusBaterai(`Charging (${data.current}A)`)
      }
    })
  },[kapasitas])

  useEffect(() => {
    window.electron.ipcRenderer.on('cellVoltageData', (event,data) => {
      console.log(data);
      setCell1(`${data.Cell1.toFixed(3)}V`);
      if (data.Cell1 >= 3.300) {
        setTahapPengujian5('LULUS');
      }else
      {
        setTahapPengujian5('TIDAK LULUS');
      }
      
      setCell2(`${data.Cell2.toFixed(3)} V`);
      if (data.Cell2 >= 3.300) {
        setTahapPengujian6('LULUS');
      }else
      {
        setTahapPengujian6('TIDAK LULUS');
      }

      setCell3(`${data.Cell3.toFixed(3)} V`);
      if (data.Cell3 >= 3.300) {
        setTahapPengujian7('LULUS');
      }else
      {
        setTahapPengujian7('TIDAK LULUS');
      }

      setCell4(`${data.Cell4.toFixed(3)} V`);
      if (data.Cell4 >= 3.300) {
        setTahapPengujian8('LULUS');
      }else
      {
        setTahapPengujian8('TIDAK LULUS');
      }

      setCell5(`${data.Cell5.toFixed(3)} V`);
      if (data.Cell5 >= 3.300) {
        setTahapPengujian9('LULUS');
      }else
      {
        setTahapPengujian9('TIDAK LULUS');
      }

      setCell6(`${data.Cell6.toFixed(3)} V`);
      if (data.Cell6 >= 3.300) {
        setTahapPengujian10('LULUS');
      }else
      {
        setTahapPengujian10('TIDAK LULUS');
      }

      setCell7(`${data.Cell7.toFixed(3)} V`);
      if (data.Cell7 >= 3.300) {
        setTahapPengujian11('LULUS');
      }else
      {
        setTahapPengujian11('TIDAK LULUS');
      }

      setCell8(`${data.Cell8.toFixed(3)} V`);
      if (data.Cell8 >= 3.300) {
        setTahapPengujian12('LULUS');
      }else
      {
        setTahapPengujian12('TIDAK LULUS');
      }

      setRataRata(`${data.avg} V`);
      if (data.Cell8 >= 3.300) {
        setTahapPengujian13('LULUS');
      }else
      {
        setTahapPengujian13('TIDAK LULUS');
      }

      setSelisih(`${data.selisih} V`);
      if (data.selisih < 0.200) {
        setTahapPengujian14('LULUS');
      }else
      {
        setTahapPengujian14('TIDAK LULUS');
      }
    })
  }, [])

  useEffect(() => {
    if (
      (tahapPengujian1 === 'LULUS') &&
      (tahapPengujian2 === 'LULUS') &&
      (tahapPengujian3 === 'LULUS') &&
      (tahapPengujian4 === 'LULUS') &&
      (tahapPengujian5 === 'LULUS') &&
      (tahapPengujian6 === 'LULUS') &&
      (tahapPengujian7 === 'LULUS') &&
      (tahapPengujian8 === 'LULUS') &&
      (tahapPengujian9 === 'LULUS') &&
      (tahapPengujian10 === 'LULUS') &&
      (tahapPengujian11 === 'LULUS') &&
      (tahapPengujian12 === 'LULUS') &&
      (tahapPengujian13 === 'LULUS') &&
      (tahapPengujian14 === 'LULUS') &&
      (tahapPengujian15 === 'LULUS')
      ) {
      setHasilPengujian('LULUS')
    }else
    {
      setHasilPengujian('TIDAK LULUS')
    }
  }, [tahapPengujian1,tahapPengujian2,tahapPengujian3,tahapPengujian4,tahapPengujian5,tahapPengujian6,tahapPengujian7,tahapPengujian8,tahapPengujian9,tahapPengujian10,tahapPengujian11,tahapPengujian12,tahapPengujian13,tahapPengujian14])
  return (
    <Container
      // maxWidth="xl"
    >
      <Box>
        <Box sx={{ textAlign: 'left' }}>
          <img src={logo} alt="Logo" style={{ height: 50, width: 'auto' }} />
        </Box>
        <Typography align="left" sx={{ fontFamily: 'Sony Sketch', fontSize: 23, fontWeight: 'bold' }}>
          Laporan Pengujian Charging Discharging dan Balancing
        </Typography>
        <Typography align="left" sx={{ fontFamily: 'Sony Sketch', fontSize: 23, fontWeight: 'bold' }}>
          Javis Lithium Battery
        </Typography>
        <Box>
          <hr style={{ border: '2px solid black' }} />
        </Box>
        <Box>
          <Typography align="right" sx={{ fontFamily: 'Bookman Old Style', fontSize: 10 }}><strong>Waktu Pengujian : </strong>{waktuPengujian}</Typography>
          <Typography sx={{ fontFamily: 'Bookman Old Style', fontWeight: 'bold', fontSize: 12 }}>IDENTITAS PRODUK</Typography>
        </Box>
        <div style={{ textAlign: "left", fontFamily: 'Bookman Old Style', fontSize: 10, marginTop: 5 }}>
          <table>
            <tbody>
              <tr>
                <th>Model Produk</th>
                <td>&ensp;:&ensp;</td>
                <td>{modelProduk}</td>
              </tr>
              <tr>
                <th>Varian</th>
                <td>&ensp;:&ensp;</td>
                <td>{varian}</td>
              </tr>
              <tr>
                <th>Versi</th>
                <td>&ensp;:&ensp;</td>
                <td>{versi}</td>
              </tr>
              <tr>
                <th>Tegangan</th>
                <td>&ensp;:&ensp;</td>
                <td>{tegangan}</td>
              </tr>
              <tr>
                <th>Tegangan Pengisian</th>
                <td>&ensp;:&ensp;</td>
                <td>{teganganPengisian}</td>
              </tr>
              <tr>
                <th>Kapasitas</th>
                <td>&ensp;:&ensp;</td>
                <td>{kapasitas}</td>
              </tr>
              <tr>
                <th>Jumlah Cell</th>
                <td>&ensp;:&ensp;</td>
                <td>{jumlahCell}</td>
              </tr>
              <tr>
                <th>Tipe Cell</th>
                <td>&ensp;:&ensp;</td>
                <td>{tipeCell}</td>
              </tr>
              <tr>
                <th>COM Port</th>
                <td>&ensp;:&ensp;</td>
                <td>{com}</td>
              </tr>
              <tr>
                <th>Status Komunikasi</th>
                <td>&ensp;:&ensp;</td>
                <td>{statusKomunikasi}</td>
              </tr>
              <tr>
                <th>Status Baterai</th>
                <td>&ensp;:&ensp;</td>
                <td>{statusBaterai}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <Typography sx={{ fontFamily: 'Bookman Old Style', fontWeight: 'bold', fontSize: 12 }}>PENGUJIAN</Typography>
        <TableContainer component={Paper}>
          <Table size="small" style={{ border: '2px solid black' }}>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10 }}>NO</TableCell>
                <TableCell align="center" sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10 }}>NAMA PENGUJIAN</TableCell>
                <TableCell align="center" sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10 }}>STANDAR KELULUSAN</TableCell>
                <TableCell align="center" sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10 }}>HASIL PENGUJIAN</TableCell>
                <TableCell align="center" sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10 }}>KETERANGAN</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell align="center" sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10 }}>1.</TableCell>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10 }}>Tegangan Baterai</TableCell>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10 }} align="center">V &gt; 26.5VDC</TableCell>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10 }} align="center">{teganganBaterai}</TableCell>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10, backgroundColor: tahapPengujian1 === 'TIDAK LULUS' ? 'white' : 'white'}} align="center">{tahapPengujian1}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10 }} align="center">2.</TableCell>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10 }} >Kapasitas Pengosongan Baterai Terakhir</TableCell>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10 }} align="center">Kapasitas ≥ {kapasitas}</TableCell>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10 }} align="center">{pengosonganBaterai}</TableCell>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10, backgroundColor: tahapPengujian2 === 'TIDAK LULUS' ? 'white' : 'white'}} align="center">{tahapPengujian2}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10 }} align="center">3.</TableCell>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10 }} >Kapasitas Pengisian Baterai Terakhir</TableCell>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10 }} align="center">Kapasitas ≥ {kapasitas}</TableCell>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10 }} align="center">{pengisianBaterai}</TableCell>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10, backgroundColor: tahapPengujian3 === 'TIDAK LULUS' ? 'white' : 'white' }} align="center">{tahapPengujian3}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10 }} align="center">4.</TableCell>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10 }} >Kapasitas Baterai Terukur (Wh)</TableCell>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10 }} align="center">Kapasitas ≥ {kapasitas}</TableCell>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10 }} align="center">{kapasitasTersisa}</TableCell>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10, backgroundColor: tahapPengujian4 === 'TIDAK LULUS' ? 'white' : 'white' }} align="center">{tahapPengujian4}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10 }} align="center">5.</TableCell>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10 }} >Kapasitas Baterai Terukur (Ah)</TableCell>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10 }} align="center">Kapasitas ≥ {kapasitasAh}</TableCell>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10 }} align="center">{kapasitasTersisaAh}</TableCell>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10, backgroundColor: tahapPengujian15 === 'TIDAK LULUS' ? 'white' : 'white' }} align="center">{tahapPengujian15}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10 }} align="center">6.</TableCell>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10 }} >Tegangan Cell Baterai 1</TableCell>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10 }} align="center">V ≥ 3.3 V</TableCell>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10 }} align="center">{cell1}</TableCell>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10, backgroundColor: tahapPengujian5 === 'TIDAK LULUS' ? 'white' : 'white' }} align="center">{tahapPengujian5}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10 }} align="center">7.</TableCell>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10 }} >Tegangan Cell Baterai 2</TableCell>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10 }} align="center">V ≥ 3.3 V</TableCell>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10 }} align="center">{cell2}</TableCell>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10, backgroundColor: tahapPengujian6 === 'TIDAK LULUS' ? 'white' : 'white' }} align="center">{tahapPengujian6}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10 }} align="center">8.</TableCell>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10 }} >Tegangan Cell Baterai 3</TableCell>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10 }} align="center">V ≥ 3.3 V</TableCell>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10 }} align="center">{cell3}</TableCell>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10, backgroundColor: tahapPengujian7 === 'TIDAK LULUS' ? 'white' : 'white' }} align="center">{tahapPengujian7}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10 }} align="center">9.</TableCell>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10 }} >Tegangan Cell Baterai 4</TableCell>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10 }} align="center">V ≥ 3.3 V</TableCell>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10 }} align="center">{cell4}</TableCell>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10, backgroundColor: tahapPengujian8 === 'TIDAK LULUS' ? 'white' : 'white' }} align="center">{tahapPengujian8}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10 }} align="center">10.</TableCell>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10 }} >Tegangan Cell Baterai 5</TableCell>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10 }} align="center">V ≥ 3.3 V</TableCell>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10 }} align="center">{cell5}</TableCell>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10, backgroundColor: tahapPengujian9 === 'TIDAK LULUS' ? 'white' : 'white' }} align="center">{tahapPengujian9}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10 }} align="center">11.</TableCell>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10 }} >Tegangan Cell Baterai 6</TableCell>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10 }} align="center">V ≥ 3.3 V</TableCell>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10 }} align="center">{cell6}</TableCell>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10, backgroundColor: tahapPengujian10 === 'TIDAK LULUS' ? 'white' : 'white' }} align="center">{tahapPengujian10}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10 }} align="center">12.</TableCell>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10 }} >Tegangan Cell Baterai 7</TableCell>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10 }} align="center">V ≥ 3.3 V</TableCell>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10 }} align="center">{cell7}</TableCell>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10, backgroundColor: tahapPengujian11 === 'TIDAK LULUS' ? 'white' : 'white' }} align="center">{tahapPengujian11}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10 }} align="center">13.</TableCell>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10 }} >Tegangan Cell Baterai 8</TableCell>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10 }} align="center">V ≥ 3.3 V</TableCell>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10 }} align="center">{cell8}</TableCell>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10, backgroundColor: tahapPengujian12 === 'TIDAK LULUS' ? 'white' : 'white' }} align="center">{tahapPengujian12}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10 }} align="center">14.</TableCell>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10 }} >Rata Rata Tegangan Cell Baterai</TableCell>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10 }} align="center">V ≥ 3.3 V</TableCell>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10 }} align="center">{rataRata}</TableCell>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10, backgroundColor: tahapPengujian13 === 'TIDAK LULUS' ? 'white' : 'white' }} align="center">{tahapPengujian13}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10 }} align="center">15.</TableCell>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10 }} >Selisih Tegangan Cell Baterai Tertinggi dan Terendah</TableCell>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10 }} align="center">V ≤ 0.200 V</TableCell>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10 }} align="center">{selisih}</TableCell>
                <TableCell sx={{ border: '2px solid rgba(0, 0, 0, 0.8)', fontFamily: 'Bookman Old Style', fontSize: 10, backgroundColor: tahapPengujian14 === 'TIDAK LULUS' ? 'white' : 'white' }} align="center">{tahapPengujian14}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Typography sx={{ fontFamily: 'Bookman Old Style', fontWeight: 'bold',fontSize: 12 }}>HASIL PENGUJIAN</Typography>
        <Typography sx={{ fontFamily: 'Bookman Old Style', fontSize: 10 }}>*Hasil Pengujian dinyatakan lulus, jika hasil seluruh tahapan pengujian lulus uji.</Typography>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={2}>
              <Box sx={{ backgroundColor: hasilPengujian === "LULUS" ? 'green' : 'red', textAlign: 'center', borderRadius: 2 }}>
                <Typography sx={{ color: 'white', fontFamily: 'Bookman Old Style', fontSize: 12 }}>{hasilPengujian}</Typography>
              </Box>  
            </Grid>
            <Grid item xs={10}>
              <Typography sx={{ fontFamily: 'Bookman Old Style', fontSize: 10 }}><strong>Serial Number </strong>: {serialNumber}</Typography>
            </Grid>
            <Grid item xs={10}>

            </Grid>
            <Grid item xs={2} sx={{ textAlign: 'center', marginTop: -5 }}>
              <Typography sx={{ fontSize: 10, fontFamily: 'Bookman Old Style' }}>Petugas QC</Typography>
              <Typography sx={{ fontSize: 10, fontFamily: 'Bookman Old Style', marginTop: 5 }}>(.........................)</Typography>
            </Grid>
          </Grid>
        </Box>
        <Button fullWidth variant="contained" onClick={handleSelesai} sx={{ fontSize: 10, marginTop: 5 }}>
          Print
        </Button>
        <Modal
          open={modalSelesai}
          onClose={handleCancelModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Button fullWidth variant="contained" onClick={handlePrint} sx={{ fontSize: 10 }}>
              Print
            </Button>
            <Button fullWidth variant="contained" onClick={handleKeluar} sx={{ fontSize: 10, marginTop:2 }}>
              KELUAR DARI PENGUJIAN
            </Button>
          </Box>
        </Modal>
        <Modal
          open={modalConfirmation}
          onClose={handleCancelModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography align='center' sx={{fontSize : 14}}>Apakah anda yakin untuk keluar dari halaman pengujian ?</Typography>
            <Typography align='center' sx={{fontSize : 14, fontWeight: 'bold', marginBottom: 2}}>SN:{serialNumber}</Typography>
            <Button fullWidth variant="contained" onClick={handleToSetup} sx={{ fontSize: 10 }}>
              Ya
            </Button>
            <Button fullWidth variant="contained" onClick={handleSelesai} sx={{ fontSize: 10, marginTop:2 }}>
              Batal
            </Button>
          </Box>
        </Modal>
      </Box>
    </Container>
  );
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  borderRadius: 5,
  width: 400,
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};



export default ReportPage;