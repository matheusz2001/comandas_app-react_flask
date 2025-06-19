import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Toolbar, Typography, IconButton, Button, useMediaQuery, } from '@mui/material';
import { Edit, Delete, Visibility, FiberNew } from '@mui/icons-material';
// useNavigate: usado para navegar entre páginas.
import { useNavigate } from 'react-router-dom';
// serviços - funções para buscar e deletar
import { getProdutos, deleteProduto } from '../services/produtoService';
// mensagens de sucesso, erro e confirmação
import { toast } from 'react-toastify';
// useTheme: usado para acessar o tema do Material-UI.
import { useTheme } from '@mui/material/styles';
import { PictureAsPdf } from '@mui/icons-material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import '../styles/ProdutoList.css'

function ProdutoList() {

    // O useNavigate é um hook que permite navegar programaticamente entre as rotas da aplicação
    const navigate = useNavigate();
    // Hook para detectar o tamanho da tela
    // theme: Obtém o tema do Material-UI.
    const theme = useTheme();
    // Aqui, estamos verificando se a tela é menor ou igual ao breakpoint 'sm' definido no tema
    // O valor 'sm' é definido no tema do Material-UI e representa um breakpoint específico (geralmente 600px)
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    // useMediaQuery: Usado para verificar o tamanho da tela e ajustar a interface.
    // useState: usado para gerenciar o estado local do componente, como a lista.
    // Aqui, estamos criando um estado chamado Produtos e uma função para atualizá-lo chamada setProdutos.
    // O estado inicial é um array vazio, que será preenchido com os dados dos retornados após a chamada da API / Proxy/BFF.
    const [produtos, setProdutos] = useState([]);

    // useEffect: usado para executar efeitos colaterais, como buscar dados da API / Proxy/BFF ao carregar o componente.
    // O array vazio [] significa que o efeito será executado apenas uma vez, quando o componente for montado.
    useEffect(() => {
        fetchProdutos();
    }, []);

    // getProdutos: função que faz a chamada à API / Proxy/BFF para buscar os dados.
    const fetchProdutos = async () => {
        try {
            const data = await getProdutos();

            const resultado = Array.isArray(data) && data.length === 2 ? data[0] : data;

            setProdutos(resultado);
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            toast.error('Erro ao buscar produtos.');
        }
    };

    const generatePDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.setTextColor(50, 50, 50); 
        doc.text("Lista de Produtos", 14, 22);

        const isSmallScreen = window.innerWidth < 600;
        const tableColumn = isSmallScreen
            ? ["ID", "Nome"]
            : ["ID", "Nome", "Descrição", "Valor Unitário", "Foto"];

        const tableRows = [];

        produtos.forEach(produto => {
            if (isSmallScreen) {
                tableRows.push([produto.id_produto, produto.nome]);
            } else {
                tableRows.push([
                    produto.id_produto,
                    produto.nome,
                    produto.descricao || "",
                    `R$ ${Number(produto.valor_unitario).toFixed(2)}`,
                    produto.foto ? produto.foto : null
                ]);
            }
        });

        const startY = 30;

        const commonTableOptions = {
            startY,
            head: [tableColumn],
            theme: 'grid',
            headStyles: {
                fillColor: [200, 200, 200],  
                textColor: [0, 0, 0],        
                halign: 'center',
                fontStyle: 'bold',
            },
            styles: {
                fontSize: isSmallScreen ? 10 : 12,
                cellPadding: isSmallScreen
                    ? 10
                    : { top: 12, bottom: 12, left: 12, right: 6 },
                textColor: [0, 0, 0],       
            },
            alternateRowStyles: {
                fillColor: [240, 240, 240],   
            },
        };

        if (isSmallScreen) {
            doc.autoTable({
                ...commonTableOptions,
                body: tableRows,
            });
        } else {
            doc.autoTable({
                ...commonTableOptions,
                body: tableRows.map(row => row.slice(0, 4)),
                didDrawCell: (data) => {
                    if (data.column.index === 4 && data.cell.section === 'body') {
                        const fotoBase64 = tableRows[data.row.index][4];
                        if (fotoBase64) {
                            const x = data.cell.x + 3;
                            const y = data.cell.y + 4;
                            const imgWidth = 22;
                            const imgHeight = 22;
                            doc.addImage(`data:image/jpeg;base64,${fotoBase64}`, 'JPEG', x, y, imgWidth, imgHeight);
                        } else {
                            doc.setFontSize(10);
                            doc.text('Sem imagem', data.cell.x + 2, data.cell.y + 12);
                        }
                    }
                }
            });
        }

        doc.save("produtos.pdf");
    };

    // handleDeleteClick: função que exibe um toast de confirmação antes de excluir.
    const handleDeleteClick = (produto) => {
        toast(
            <div>
                <Typography>Tem certeza que deseja excluir o produto <strong>{produto.nome}</strong>?</Typography>
                <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained" color="error" size="small"
                        onClick={() => handleDeleteConfirm(produto.id_produto)} style={{ marginRight: '10px' }}
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
            await deleteProduto(id);
            fetchProdutos();
            toast.dismiss(); // Fecha o toast após a exclusão
            toast.success('Produto excluído com sucesso!', { position: "top-center" });
        } catch (error) {
            console.error('Erro ao deletar produto:', error);
            toast.error('Erro ao excluir produto.', { position: "top-center" });
        }
    };

    return (
        <TableContainer className="Produto-Table" component={Paper}>

            <Toolbar sx={{ backgroundColor: '#E0E0E0', padding: 2, borderRadius: 1, mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" color="black">Produtos</Typography>
                <Button color="black" onClick={() => navigate('/produto')} startIcon={<FiberNew />}>Novo</Button>
                <Button color="secondary" onClick={generatePDF} startIcon={<PictureAsPdf />}> Exportar PDF </Button>
            </Toolbar>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Nome</TableCell>
                        <TableCell>Valor Unitário</TableCell>
                        {/* conforme o tamanho da tela, define o que renderizar */}
                        {!isSmallScreen && (
                            <>
                                <TableCell>Foto</TableCell>
                                <TableCell>Descrição</TableCell>
                            </>
                        )}
                        <TableCell>Ações</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {produtos.map((produto) => (
                        <TableRow key={produto.id_produto}>
                            <TableCell>{produto.id_produto}</TableCell>
                            <TableCell>{produto.nome}</TableCell>
                            <TableCell>{produto.valor_unitario}</TableCell>
                            {!isSmallScreen && (
                                <>
                                    <TableCell>
                                        {produto.foto ? (
                                            <img
                                                src={`data:image/jpeg;base64,${produto.foto}`}
                                                alt={produto.nome}
                                                style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 4 }}
                                            />
                                        ) : 'Sem imagem'}
                                    </TableCell>
                                    <TableCell>{produto.descricao}</TableCell>
                                </>
                            )}
                            <TableCell>
                                <IconButton onClick={() => navigate(`/produto/view/${produto.id_produto}`)}>
                                    <Visibility color="black" />
                                </IconButton>
                                <IconButton onClick={() => navigate(`/produto/edit/${produto.id_produto}`)}>
                                    <Edit color="secondary" />
                                </IconButton>
                                <IconButton onClick={() => handleDeleteClick(produto)}>
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

export default ProdutoList;