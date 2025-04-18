import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography, Button, Toolbar } from '@mui/material';
import { Edit, Delete, Visibility, FiberNew } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import '../styles/ClienteList.css'

function ClienteList() {

    const navigate = useNavigate();

    return (
        <TableContainer className="Cliente-Table" component={Paper}>
            
            <Toolbar sx={{ backgroundColor: '#E0E0E0', padding: 2, borderRadius: 1, mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" color="black">Clientes</Typography>
                <Button color="black" onClick={() => navigate('/cliente')} startIcon={<FiberNew />}>Novo</Button>
            </Toolbar>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Nome</TableCell>
                        <TableCell>CPF</TableCell>
                        <TableCell>Telefone</TableCell>
                        <TableCell>Ações</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow key={1}>
                        <TableCell>40</TableCell>
                        <TableCell>Matheus Felipe Ribeiro Cruz de Mello</TableCell>
                        <TableCell>222.313.541-65</TableCell>
                        <TableCell>988542431</TableCell>
                        <TableCell>
                            <IconButton> <Visibility color="black" /> </IconButton>
                            <IconButton> <Edit color="secondary" /> </IconButton>
                            <IconButton> <Delete color="error" /> </IconButton>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
        
    );
}

export default ClienteList;