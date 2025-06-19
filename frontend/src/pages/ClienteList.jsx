import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Toolbar, Typography, IconButton, Button, useMediaQuery, } from '@mui/material';
import { Edit, Delete, Visibility, FiberNew } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getClientes, deleteCliente } from '../services/clienteService';
import { toast } from 'react-toastify';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import { PictureAsPdf } from '@mui/icons-material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import '../styles/ClienteList.css';

function ClienteList() {

    const navigate = useNavigate();
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [clientes, setClientes] = useState([]);

    useEffect(() => {
        fetchClientes();
    }, []);

    const fetchClientes = async () => {
        try {
            const data = await getClientes();
            const resultado = Array.isArray(data) && data.length === 2 ? data[0] : data;

            setClientes(resultado);
        } catch (error) {
            console.error('Erro ao buscar clientes:', error);
        }
    };

    const generatePDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.setTextColor(50, 50, 50);
        doc.text('Lista de Clientes', 14, 22);

        const tableColumn = isSmallScreen
            ? ['ID', 'Nome', 'CPF']
            : ['ID', 'Nome', 'CPF', 'Telefone'];

        const tableRows = clientes.map(cliente => {
            const row = [
                cliente.id_cliente,
                cliente.nome,
                formatCPF(cliente.cpf),
            ];

            if (!isSmallScreen) {
                row.push(formatTelefone(cliente.telefone));
            }

            return row;
        });

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 30,
            theme: 'grid',
            headStyles: {
                fillColor: [200, 200, 200], 
                textColor: [0, 0, 0],       
                halign: 'center',
                fontStyle: 'bold',
            },
            styles: {
                fontSize: 11,
                cellPadding: 5,
                textColor: [0, 0, 0],      
            },
            alternateRowStyles: {
                fillColor: [240, 240, 240],
            },
        });

        doc.save('clientes.pdf');
    };

    const handleDeleteClick = (cliente) => {
        toast(
            <div>
                <Typography>Tem certeza que deseja excluir o cliente <strong>{cliente.nome}</strong>?</Typography>
                <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained" color="error" size="small"
                        onClick={() => handleDeleteConfirm(cliente.id_cliente)} style={{ marginRight: '10px' }}
                    >Excluir</Button>
                    <Button variant="outlined" size="small" onClick={() => toast.dismiss()}>Cancelar</Button>
                </div>
            </div>,
            {
                position: "top-center", autoClose: false, closeOnClick: false, draggable: false, closeButton: false,
            }
        );
    };

    const handleDeleteConfirm = async (id) => {
        try {
            await deleteCliente(id);
            fetchClientes();
            toast.dismiss();
            toast.success('Cliente excluído com sucesso!', { position: "top-center" });
        } catch (error) {
            console.error('Erro ao deletar cliente:', error);
            toast.error('Erro ao excluir cliente.', { position: "top-center" });
        }
    };

    //Formata CPF
    const formatCPF = (cpf) => {
        if (!cpf || cpf.length !== 11) return cpf;
        return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
    };

    //Formata Telefone
    const formatTelefone = (telefone) => {
        if (!telefone || telefone.length !== 11) return telefone;
        return telefone.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    };

    return (
        <TableContainer className="Cliente-Table" component={Paper}>

            <Toolbar sx={{ backgroundColor: '#E0E0E0', padding: 2, borderRadius: 1, mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" color="black">Clientes</Typography>
                <Button color="black" onClick={() => navigate('/cliente')} startIcon={<FiberNew />}>Novo</Button>
                <Button color="secondary" onClick={generatePDF} startIcon={<PictureAsPdf />}> Exportar PDF </Button>
            </Toolbar>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Nome</TableCell>
                        <TableCell>CPF</TableCell>
                        {!isSmallScreen && <TableCell>Telefone</TableCell>}
                        <TableCell>Ações</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {clientes.map((cliente) => (
                        <TableRow key={cliente.id_cliente}>
                            <TableCell>{cliente.id_cliente}</TableCell>
                            <TableCell>{cliente.nome}</TableCell>
                            <TableCell>{formatCPF(cliente.cpf)}</TableCell>
                            {!isSmallScreen && (
                                <TableCell>{formatTelefone(cliente.telefone)}</TableCell>
                            )}
                            <TableCell>
                                <IconButton onClick={() => navigate(`/cliente/view/${cliente.id_cliente}`)}>
                                    <Visibility color="black" />
                                </IconButton>
                                <IconButton onClick={() => navigate(`/cliente/edit/${cliente.id_cliente}`)}>
                                    <Edit color="secondary" />
                                </IconButton>
                                <IconButton onClick={() => handleDeleteClick(cliente)}>
                                    <Delete color="error" />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>

    );
}

export default ClienteList;