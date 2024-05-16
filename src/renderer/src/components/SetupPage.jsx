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
  AlertTitle
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo_javis.png';

const SetupPage = () => 
{
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(false);
  const [serialNumber, setSerialNumber] = useState('');
  const [modelList, setModelList] = useState([]);
  const [model, setModel] = useState('');
  const [port, setPort] = useState([]);
  const [selectedPort, setSelectedPort] = useState('');
  const [showMulaiAlert, setShowMulaiAlert] = useState(false);
  const [showSnAlert, setShowSnAlert] = useState(false);
  const [showModelAlert, setShowModelAlert] = useState(false);
  const [showPortAlert, setShowPortAlert] = useState(false);

  const handleRefreshCom = () => {
    window.electron.ipcRenderer.send('send-data', 'REFRESH COM');
  };

  const handleMulaiPengujian = () => {
    console.log(serialNumber.length);
    console.log(model);
    console.log(selectedPort);
    if ((serialNumber.length >= 11) && (model !== '') && (selectedPort !== '')) {
      setShowSnAlert(false);
      setShowModelAlert(false);
      setShowPortAlert(false);
      let dataPengujian = [{
        sn: serialNumber,
        model: model,
        port: selectedPort,
        click: 1
      }]
      window.electron.ipcRenderer.send('init-test', dataPengujian);
    } else {
      if (serialNumber.length < 11) {
        setShowSnAlert(true);
      } else {
        setShowSnAlert(false);
      }

      if (model === '') {
        setShowModelAlert(true);
      } else {
        setShowModelAlert(false);
      }

      if (selectedPort === '') {
        setShowPortAlert(true);
      } else {
        setShowPortAlert(false);
      }

      console.log('Data Tidak Sesuai');
    }
  };

  const handleMelanjutkanPengujian = () => {
    console.log("Melanjutkan Pengujian");
    console.log(serialNumber.length);
    console.log(model);
    console.log(selectedPort);
    if ((serialNumber.length >= 11) && (model !== '') && (selectedPort !== '')) {
      setShowSnAlert(false);
      setShowModelAlert(false);
      setShowPortAlert(false);
      let dataPengujian = [{
        sn: serialNumber,
        model: model,
        port: selectedPort,
        click: 2
      }]
      window.electron.ipcRenderer.send('init-test', dataPengujian);
    } else {
      if (serialNumber.length < 11) {
        setShowSnAlert(true);
      } else {
        setShowSnAlert(false);
      }

      if (model === '') {
        setShowModelAlert(true);
      } else {
        setShowModelAlert(false);
      }

      if (selectedPort === '') {
        setShowPortAlert(true);
      } else {
        setShowPortAlert(false);
      }

      console.log('Data Tidak Sesuai');
    }
  };

  const handleSetModel = (event) => {
    console.log(event.target.value);
    setModel(event.target.value);
  };

  const handleSetPort = (event) => {
    setSelectedPort(event.target.value);
  };

  useEffect(() => {
    window.electron.ipcRenderer.send('send-data', 'REFRESH COM');
  }, [])

  useEffect(() => {
    window.electron.ipcRenderer.on('port-data', (event, data) => {
      // console.log(data[0].path);
      setPort(data)
    });

    return () => {
      window.electron.ipcRenderer.removeAllListeners('port-data');
    };
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on('model-data', (event, data) => {
      console.log(data);
      setModelList(data);
    });

    return () => {
      window.electron.ipcRenderer.removeAllListeners('model-data');
    };
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on('init-status', (event, data) => {
      console.log(data.sn);
      if (data === 'MELANJUTKAN') {
        setShowMulaiAlert(true);
      } else if (data === 'TIDAK TERHUBUNG') {
        setShowPortAlert(true);
      } else {
        setShowMulaiAlert(false);
        localStorage.setItem('id_user', JSON.stringify(data));
        navigate('/report');
      }
    });

    return () => {
      window.electron.ipcRenderer.removeAllListeners('init-status');
    };
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on('db-data', (event, data) => {
      console.log(data);
    });

    return () => {
      window.electron.ipcRenderer.removeAllListeners('db-data');
    };
  }, []);

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Box sx={{ textAlign: 'center' }}>
          <img src={logo} alt="Logo" style={{ height: 70, width: 'auto', marginBottom: 10 }} />
        </Box>
        <Typography variant="h5" component="h1" align="center" gutterBottom>
          JAVIS BATTERY TESTER V1.1
        </Typography>
        {showSnAlert && (
          <Alert severity="warning">
            <AlertTitle>Peringatan</AlertTitle>
            Nomor serial harus terdiri dari setidaknya 11 digit.
          </Alert>
        )}
        <TextField
          fullWidth
          label="Serial Number"
          value={serialNumber}
          onChange={(e) => {
            const re = /^[0-9\b]+$/;
            if (e.target.value === '' || re.test(e.target.value)) {
              setSerialNumber(e.target.value);
            }
          }}
          // margin="normal"
          sx={{ marginBottom: 3 }}
          inputProps={{ type: 'number' }}
        />
        {showModelAlert && (
          <Alert severity="warning">
            <AlertTitle>Peringatan</AlertTitle>
            Pilih salah satu Model yang disediakan
          </Alert>
        )}
        <FormControl fullWidth sx={{ marginBottom: 3 }}>
          <InputLabel id="selectModel">Model</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={model}
            label="Model"
            onChange={handleSetModel}
          >
            {modelList.map((modelItem) => (
              <MenuItem key={modelItem.id} value={modelItem.ID}>{modelItem.model_produk}</MenuItem>
            ))}
          </Select>
        </FormControl>
        {showPortAlert && (
          <Alert severity="warning">
            <AlertTitle>Peringatan</AlertTitle>
            {selectedPort} Tidak dapat Terhubung
          </Alert>
        )}
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Port</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectedPort}
                  label="Model"
                  onChange={handleSetPort}
                >
                  {port.map((portItem) => (
                    <MenuItem value={portItem}>{portItem}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <Button
                fullWidth
                sx={{ height: 55 }}
                variant="contained"
                color="primary"
                onClick={handleRefreshCom}
              >
                REFRESH
              </Button>
            </Grid>
          </Grid>
        </Box>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleMulaiPengujian}
          sx={{ mt: 3 }}
        >
          MULAI PENGUJIAN
        </Button>
        {showMulaiAlert && (
          <Alert severity="warning">
            <AlertTitle>Peringatan</AlertTitle>
            Serial Number telah terdaftar, Tekan tombol <strong>MELANJUTKAN PENGUJIAN</strong>
          </Alert>
        )}
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography>Atau</Typography>
        </Box>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleMelanjutkanPengujian}
            sx={{ mt: 3 }}
          >
            MELANJUTKAN PENGUJIAN
          </Button>
      </Box>
    </Container>
  );
};

export default SetupPage;
