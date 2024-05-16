import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { SerialPort } from 'serialport';
import path from 'path';
import { AsyncLocalStorage } from 'async_hooks';

const dbPath = path.resolve('javis-battery-tester-rev6.mdb');
const ADODB = require('node-adodb');
const connectionDb = ADODB.open(`Provider=Microsoft.Jet.OLEDB.4.0;Data Source=${dbPath};Persist Security Info=False;`);

var bufferPort = Buffer.from([]);
var stateBufferFull = 2;

// Local Storage
const Store = require('electron-store');
const store = new Store();
const dataModel = [
  {
    ID: 1,
    model_produk: 'JB-120.40C.1B-L',
    varian: 'Lithium Iron (LiFePO4)',
    versi: '1.0',
    tegangan_pengisian: '29.2V',
    kapasitas: '3072Wh',
    kapasitasAh: '120Ah',
    jumlah_cell: '40',
    tegangan: '25.6V'
  },
  {
    ID: 2,
    model_produk: 'JB-50.16C.1B-L',
    varian: 'Lithium Iron (LiFePO4)',
    versi: '1.0',
    tegangan_pengisian: '29.2V',
    kapasitas: '1280Wh',
    kapasitasAh: '50Ah',
    jumlah_cell: '16',
    tegangan: '25.6V'
  },
  {
    ID: 3,
    model_produk: 'JB-80.24C.1B-L',
    varian: 'Lithium Iron (LiFePO4)',
    versi: '1.0',
    tegangan_pengisian: '29.2V',
    kapasitas: '2048Wh',
    kapasitasAh: '80Ah',
    jumlah_cell: '24',
    tegangan: '25.6V'
  }
];
store.set('model', dataModel);

const retrievedData = store.get('12345678901234');
console.log(retrievedData);

var port;
var statePengujian = false;
var index = 0;

var testedSerialNumber;
var testedModel;
var testedPort;
var testedClick;

var batteryVoltage;
var currentBattery = 0.0;
var newCurrentBattery = 0.0;
var nominalCapacity;
var nominalCapacityAh;
var dischargingCapacity = 0.0;
var chargingCapacity = 0.0;
var fullCapacity;
var cellVoltage = [];
var averageCellVoltage = 0;

var selisihCellVoltage = 0;
var nilaiTertinggiCell = 0;
var nilaiTerendahCell = 4;

var stateStatus = 'standby';

const queryBasic = ['DD', 'A5', '03', '00', 'FF', 'FD', '77']
const queryCell = ['DD', 'A5', '04', '00', 'FF', 'FC', '77']

function kirimDataHexa(hexString) {
  const buffer = Buffer.from(hexString, 'hex');

  // console.log(buffer);

  port.write(buffer, (err) => {
      if (err) {
          return console.log('Error:', err.message);
      }
  });
}

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    icon: icon,
    // show: false,
    autoHideMenuBar: true,
    // ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      contextIsolation: false, // Diperlukan jika nodeIntegration diaktifkan
      preload: join(__dirname, '../preload/index.js'),
      asar: false,
      sandbox: false
    }
  })

  function parseBasic(array) {
    batteryVoltage = array[2] / 100;
    newCurrentBattery = (array[3] / 100);
    nominalCapacity = array[4] / 100;
    nominalCapacityAh = (array[4] / 100).toFixed(2);
    fullCapacity = array[5] / 100;
    if (newCurrentBattery > 500) {
        newCurrentBattery = (newCurrentBattery - 655.3).toFixed(3);
        if (newCurrentBattery < -1.00) {
            dischargingCapacity = fullCapacity - (array[4]/100);
            dischargingCapacity = (dischargingCapacity*25.6).toFixed(2);
        }
        stateStatus = 'discharge';
    } else if (newCurrentBattery === 0) {
        
    } else {
        stateStatus = 'charge';
        chargingCapacity = array[4] / 100;
        chargingCapacity = (chargingCapacity*25.6).toFixed(2)
    }
  
    console.log('======================= BASIC PARAMETER ==============================');
    console.log(`TEGANGAN BATERAI : ${batteryVoltage} V`);
    console.log(`ARUS BATERAI : ${newCurrentBattery} A`);
    console.log(`CHARGING CAPACITY : ${chargingCapacity}`);
    console.log(`DISCHARGING CAPACITY : ${dischargingCapacity}`);
    console.log(`KAPASITAS SAAT INI : ${nominalCapacity} Ah`);
    console.log(`KAPASITAS PENUH : ${fullCapacity} Ah`);
    console.log('======================================================================');
    console.log();

    
  
    let basicParameterData = {
      'vbat': batteryVoltage, 
      'current': newCurrentBattery, 
      'chargingCapacity': chargingCapacity, 
      'dischargingCapacity': dischargingCapacity, 
      'capacity': (nominalCapacity*25.6).toFixed(2),
      'capacityAh': nominalCapacityAh
    }
    const saveHistory =
    {
      sn: testedSerialNumber,
      model: testedModel,
      port: testedPort,
      click: testedClick,
      pengosongan_baterai: dischargingCapacity,
      pengisian_baterai: chargingCapacity
    }
    console.log(saveHistory);
    store.set(testedSerialNumber, saveHistory);
    // const updateQuery = `UPDATE riwayat_pengujian SET tegangan = '${batteryVoltage}', pengosongan_baterai = '${dischargingCapacity}', pengisian_baterai = '${chargingCapacity}' WHERE sn = '${testedSerialNumber}'`;

    // connectionDb
    //   .query(updateQuery)
    //   .then(updateResults => {
    //     console.log('Data berhasil diupdate ke database.');
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });
    // console.log(basicParameterData);
    mainWindow.webContents.send('basicParameterData', basicParameterData);
  }
  
  function parseCellVoltage(array) {
    console.log('======================== TEGANGAN CELL ===============================');
    for (let nCell = 1; nCell < 9; nCell++) {
        averageCellVoltage += (array[nCell + 1]);
        cellVoltage[nCell] = array[nCell + 1] / 1000;
        if (nilaiTertinggiCell < cellVoltage[nCell]) {
            nilaiTertinggiCell = cellVoltage[nCell];
        }
        if (nilaiTerendahCell > cellVoltage[nCell]) {
            nilaiTerendahCell = cellVoltage[nCell];
        }
    }
    averageCellVoltage = averageCellVoltage / 8;
    averageCellVoltage = (averageCellVoltage / 1000).toFixed(3);
  
    selisihCellVoltage = nilaiTertinggiCell - nilaiTerendahCell;
    selisihCellVoltage = selisihCellVoltage.toFixed(3)
    nilaiTerendahCell = 4;
    nilaiTertinggiCell = 0;
  
    console.log(`AVERAGE CELL VOLTAGE : ${averageCellVoltage} V`);
    let cellVoltageData = {
      'Cell1': cellVoltage[1], 
      'Cell2': cellVoltage[2], 
      'Cell3': cellVoltage[3], 
      'Cell4': cellVoltage[4], 
      'Cell5': cellVoltage[5], 
      'Cell6': cellVoltage[6], 
      'Cell7': cellVoltage[7], 
      'Cell8': cellVoltage[8],
      'avg': averageCellVoltage,
      'selisih': selisihCellVoltage 
    }
    console.log(cellVoltageData);
    mainWindow.webContents.send('cellVoltageData',cellVoltageData);
    averageCellVoltage = 0;
  }  

  SerialPort.list().then((ports) => {
    console.log(ports);
    mainWindow.webContents.send('serial-data',ports)
  });

  ipcMain.on('query_model', (event, data) => {
    console.log('Query Model :',data);
    const retrievedModel = store.get('model');
    const selectedModel = retrievedModel.find(item => item.ID === data);
    console.log(selectedModel);
    mainWindow.webContents.send('model-data',selectedModel);

  })

  ipcMain.on('query_history', (event, data) => {
    console.log('Query Model :',data);
    const retrievedHistory = store.get(data);
    console.log(retrievedHistory);
    mainWindow.webContents.send('history-data',retrievedHistory)
    dischargingCapacity = retrievedHistory.pengosongan_baterai;
    chargingCapacity = retrievedHistory.pengisian_baterai;
    statePengujian = true;
  })

  // Menerima pesan dari renderer process (komponen React)
  ipcMain.on('send-data', (event, data) => {
    console.log(`Data FE Rx : ${data}`);
    if (data === 'REFRESH COM') {
      mainWindow.webContents.send('db-data',dbPath);
      if (port) {
        port.close((err) => {
          if (err) {
            console.error('Gagal menutup port serial:', err);
          } else {
            console.log('Port serial berhasil ditutup.');
          }
        });
      }
      statePengujian = false;
      const retrievedModel = store.get('model');
      mainWindow.webContents.send('model-data',retrievedModel);
      SerialPort.list().then((ports) => {
        let portsList = ports.map(element => element.path);
        mainWindow.webContents.send('port-data',portsList)
      });
    }
  });

  // Menerima pesan dari renderer process (komponen React)
  ipcMain.on('init-test', (event, data) => {
    console.log(data[0]);
    console.log(data[0].port);

    const selectedPort = data[0].port;
    statePengujian = true;

    // Buat koneksi baru dengan COM Port yang dipilih
    port = new SerialPort({
      path: selectedPort,
      baudRate: 9600, // Sesuaikan dengan baud rate yang dibutuhkan
    }, (err) => {
      if (err) {
        console.log(err);
        statePengujian = false;
        mainWindow.webContents.send('init-status','TIDAK TERHUBUNG');
        console.log('PORT TIDAK TERHUBUNG');
      }else
      {
        port.on('data', function (data) {
          const asciiData = data;
          // console.log(data);
          // Buffer pertama
          // const buffer1 = Buffer.from([0xdd, 0x03, 0x00, 0x26, 0x0a, 0x05, 0x00, 0x00, 0x02, 0xfa, 0x21, 0x34, 0x00, 0x00, 0x30, 0x74, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x25, 0x09, 0x03, 0x08, 0x03, 0x0b, 0xd5, 0x0b, 0xc6, 0x0b, 0xc4, 0x00, 0x00, 0x00, 0x21, 0x34, 0x02, 0xfa, 0x00, 0x00, 0xf9, 0xc9, 0x77]);

          // // Buffer kedua, contoh ini membuat buffer baru yang memiliki beberapa data
          // const buffer2 = Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05]);

          // let testData = Buffer.concat([asciiData,bufferPort]);

          // console.log(testData);
          // bufferPort = asciiData;

          if (stateBufferFull === 2) {
            bufferPort = asciiData;
            stateBufferFull = 1;
          }

          console.log(asciiData[asciiData.length-1]);

          let lastChar = asciiData[asciiData.length-1];

          if (lastChar !== 119) {
            if (stateBufferFull === 0) {
              bufferPort = Buffer.concat([bufferPort,asciiData]);
            }
            if (stateBufferFull === 1) {
              stateBufferFull = 0;
            }
          }else
          {
            if (stateBufferFull === 0) {
              bufferPort = Buffer.concat([bufferPort,asciiData]);
            }
            stateBufferFull = 2;
            console.log(bufferPort);

            const hexArray = []; 
            for (let i = 0; i < bufferPort.length; i += 2) {
                hexArray.push(parseInt(bufferPort.slice(i, i + 2).toString('hex'), 16));
            }

            if ((hexArray[1] == 27) || (hexArray[1] == 38)) {
              parseBasic(hexArray)
            }else if (hexArray[1] == 16) {
              parseCellVoltage(hexArray)
            }

            // switch (hexArray[1]) {
            //   case 38:
            //       parseBasic(hexArray)
            //       break;
            //   case 16:
            //       parseCellVoltage(hexArray)
            //       break;
            // }
          }


          // const hexArray = [];
          // for (let i = 0; i < asciiData.length; i += 2) {
          //     hexArray.push(parseInt(asciiData.slice(i, i + 2).toString('hex'), 16));
          // }
          
          // console.log(hexArray[0]);
          // console.log(hexArray[hexArray.length-1]);

          // switch (hexArray[1]) {
          //     case 38:
          //         parseBasic(hexArray)
          //         break;
          //     case 16:
          //         parseCellVoltage(hexArray)
          //         break;
          // }
        })
        console.log('PORT TERHUBUNG');

        const serialNumberExists = store.has(data[0].sn);

        if (serialNumberExists) {
            console.log('Serial Number Telah Terdaftar');
            console.log('Data sudah ada di database.');
            if (data[0].click === 1) {
              mainWindow.webContents.send('init-status','MELANJUTKAN');
              statePengujian = false;
              if (port) {
                port.close((err) => {
                  if (err) {
                    console.error('Gagal menutup port serial:', err);
                  } else {
                    console.log('Port serial berhasil ditutup.');
                  }
                });
              }
            }else if (data[0].click === 2) {
              console.log(`${data[0]}`);
              statePengujian = false;
              mainWindow.webContents.send('init-status',data[0]);
            }
            testedSerialNumber = data[0].sn;
            testedModel = data[0].model;
            testedPort = data[0].port;
            testedClick = data[0].click;
        } else {
            console.log('Serial Number Belum Terdaftar');
            store.set(data[0].sn, data[0]);
            mainWindow.webContents.send('init-status',data[0]);
            statePengujian = true;
            testedSerialNumber = data[0].sn;
            testedModel = data[0].model;
            testedPort = data[0].port;
            testedClick = data[0].click;
        }
      }
    });
  });

  
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

setInterval(function() {
  if (statePengujian) {
    index++;
    switch (index) 
    {
      case 1:
          for (let indexQuery = 0; indexQuery < queryBasic.length; indexQuery++) {
              kirimDataHexa(queryBasic[indexQuery]);
          }
          break;
      case 2:
          for (let indexQuery = 0; indexQuery < queryBasic.length; indexQuery++) {
              kirimDataHexa(queryCell[indexQuery]);
              index = 0;
          }
          break;
    }
  }
}, 1500);

