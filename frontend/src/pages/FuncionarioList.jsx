import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Toolbar, Typography, IconButton, Button, useMediaQuery, } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getFuncionarios, deleteFuncionario } from '../services/funcionarioService';
import { toast } from 'react-toastify';
import { useTheme } from '@mui/material/styles';
import { Edit, Delete, Visibility, FiberNew } from '@mui/icons-material';
import { PictureAsPdf } from '@mui/icons-material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import '../styles/FuncionarioList.css';

function FuncionarioList() {

    const navigate = useNavigate();
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [funcionarios, setFuncionarios] = useState([]);

    useEffect(() => {
        fetchFuncionarios();
    }, []);

    const fetchFuncionarios = async () => {
        try {
            const data = await getFuncionarios();

            const resultado = Array.isArray(data) && data.length === 2 ? data[0] : data;

            setFuncionarios(resultado);
        } catch (error) {
            console.error('Erro ao buscar funcionários:', error);
        }
    };

    const generatePDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.setTextColor(50, 50, 50);
        doc.text('Lista de Funcionários', 14, 22);

        const tableColumn = isSmallScreen
            ? ['ID', 'Nome', 'CPF']
            : ['ID', 'Nome', 'CPF', 'Matrícula', 'Telefone', 'Grupo'];

        const tableRows = funcionarios.map(func => {
            const row = [
                func.id_funcionario,
                func.nome,
                formatCPF(func.cpf),
            ];

            if (!isSmallScreen) {
                row.push(
                    func.matricula,
                    formatTelefone(func.telefone),
                    func.grupo
                );
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
            },
            styles: {
                fontSize: 10,
                cellPadding: 4,
                textColor: [0, 0, 0],      
            },
            alternateRowStyles: {
                fillColor: [240, 240, 240], 
            },
        });

        doc.save('funcionarios.pdf');
    };

    const handleDeleteClick = (funcionario) => {
        toast(
            <div>
                <Typography>Tem certeza que deseja excluir o funcionário <strong>{funcionario.nome}</strong>?</Typography>
                <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained" color="error" size="small"
                        onClick={() => handleDeleteConfirm(funcionario.id_funcionario)} style={{ marginRight: '10px' }}
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
            await deleteFuncionario(id);
            fetchFuncionarios();
            toast.dismiss();
            toast.success('Funcionário excluído com sucesso!', { position: "top-center" });
        } catch (error) {
            console.error('Erro ao deletar funcionário:', error);
            toast.error('Erro ao excluir funcionário.', { position: "top-center" });
        }
    };

    const formatCPF = (cpf) => {
        if (!cpf || cpf.length !== 11) return cpf;
        return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
    };

    const formatTelefone = (telefone) => {
        if (!telefone || telefone.length !== 11) return telefone;
        return telefone.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    };

    return (
        <TableContainer className="Funcionario-Table" component={Paper}>

            <Toolbar sx={{ backgroundColor: '#E0E0E0', padding: 2, borderRadius: 1, mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" color="black">Funcionários</Typography>
                <Button color="black" onClick={() => navigate('/funcionario')} startIcon={<FiberNew />}>Novo</Button>
                <Button color="secondary" onClick={generatePDF} startIcon={<PictureAsPdf />}> Exportar PDF </Button>
            </Toolbar>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Nome</TableCell>
                        <TableCell>CPF</TableCell>
                        {!isSmallScreen && (
                            <>
                                <TableCell>Matrícula</TableCell>
                                <TableCell>Telefone</TableCell>
                                <TableCell>Grupo</TableCell>
                            </>
                        )}
                        <TableCell>Ações</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {funcionarios.map((funcionario) => (
                        <TableRow key={funcionario.id_funcionario}>
                            <TableCell>{funcionario.id_funcionario}</TableCell>
                            <TableCell>{funcionario.nome}</TableCell>
                            <TableCell>{formatCPF(funcionario.cpf)}</TableCell>
                            {!isSmallScreen && (
                                <>
                                    <TableCell>{funcionario.matricula}</TableCell>
                                    <TableCell>{formatTelefone(funcionario.telefone)}</TableCell>
                                    <TableCell>{funcionario.grupo}</TableCell>
                                </>
                            )}
                            <TableCell>
                                <IconButton onClick={() => navigate(`/funcionario/view/${funcionario.id_funcionario}`)}>
                                    <Visibility color="black" />
                                </IconButton>
                                <IconButton onClick={() => navigate(`/funcionario/edit/${funcionario.id_funcionario}`)}>
                                    <Edit color="secondary" />
                                </IconButton>
                                <IconButton onClick={() => handleDeleteClick(funcionario)}>
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

export default FuncionarioList;