import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography, Button, Toolbar } from '@mui/material';
import { Edit, Delete, Visibility, FiberNew } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import '../styles/FuncionarioList.css'

function FuncionarioList() {

    const navigate = useNavigate();

    return (
        <TableContainer className="Funcionario-Table" component={Paper}>
            
            <Toolbar sx={{ backgroundColor: '#E0E0E0', padding: 2, borderRadius: 1, mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" color="black">Funcionários</Typography>
                <Button color="black" onClick={() => navigate('/funcionario')} startIcon={<FiberNew />}>Novo</Button>
            </Toolbar>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Nome</TableCell>
                        <TableCell>CPF</TableCell>
                        <TableCell>Matrícula</TableCell>
                        <TableCell>Ações</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow key={1}>
                        <TableCell>89</TableCell>
                        <TableCell>Abc Bolinhas</TableCell>
                        <TableCell>093.931.554-00</TableCell>
                        <TableCell>123</TableCell>
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

export default FuncionarioList;