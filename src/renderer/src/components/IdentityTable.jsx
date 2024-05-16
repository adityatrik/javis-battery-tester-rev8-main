import React from 'react';
import { Grid, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const IdentityTable = () => {
  return (
    <Grid container>
      <Grid item xs={12} className="text-left" style={{ marginLeft: '10pt' }}>
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell><Typography variant="subtitle1">Model Produk</Typography></TableCell>
                <TableCell>:</TableCell>
                <TableCell>JB-120.40C.1B-L</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><Typography variant="subtitle1">Varian</Typography></TableCell>
                <TableCell>:</TableCell>
                <TableCell>Lithium Iron (LiFePO4)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><Typography variant="subtitle1">Versi</Typography></TableCell>
                <TableCell>:</TableCell>
                <TableCell>1.0</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><Typography variant="subtitle1">Tegangan</Typography></TableCell>
                <TableCell>:</TableCell>
                <TableCell>25.6V</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><Typography variant="subtitle1">Tegangan Pengisian</Typography></TableCell>
                <TableCell>:</TableCell>
                <TableCell>29.2V</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><Typography variant="subtitle1">Kapasitas</Typography></TableCell>
                <TableCell>:</TableCell>
                <TableCell>120Ah</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><Typography variant="subtitle1">Jumlah Cell</Typography></TableCell>
                <TableCell>:</TableCell>
                <TableCell>40</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><Typography variant="subtitle1">Tipe Cell</Typography></TableCell>
                <TableCell>:</TableCell>
                <TableCell>HLJFP481713170E</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><Typography variant="subtitle1">COM Port</Typography></TableCell>
                <TableCell>:</TableCell>
                <TableCell>
                  <div>
                    <select id="comPortDropdown"></select>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell><Typography variant="subtitle1">Status Komunikasi</Typography></TableCell>
                <TableCell>:</TableCell>
                <TableCell id="statusKomunikasi">Tidak Terhubung</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><Typography variant="subtitle1">Status Baterai</Typography></TableCell>
                <TableCell>:</TableCell>
                <TableCell id="statusBaterai">-</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};

export default IdentityTable;
