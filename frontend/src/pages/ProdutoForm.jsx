import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Box, Typography, Toolbar } from '@mui/material';
import IMaskInputWrapper from '../components/IMaskInputWrapper';
import React, { useEffect, useState } from 'react';
// Controller é usado para conectar os campos do formulário ao estado do formulário gerenciado pelo useForm.
// O Controller é um componente que envolve o campo do formulário e fornece as propriedades e métodos necessários para gerenciar o estado do campo.
// import dos services, faz a comunicação com o backend
import { createProduto, updateProduto, getProdutoById } from '../services/produtoService';
import { useNavigate, useParams } from "react-router-dom";
import { toast } from 'react-toastify';
// redimensionar e comprimir imagens no navegador
// um campo blob aceita arquivos binários, como imagens, vídeos e outros tipos de dados.
// o limite de blob em mysql é 64 KB
import imageCompression from 'browser-image-compression';
import '../styles/ProdutoForm.css';

const ProdutoForm = () => {

    // O useParams retorna um objeto com os parâmetros da URL, que podem ser acessados pelas chaves correspondentes.
    // O id é o parâmetro da URL que representa o id a ser editado ou visualizado.
    // O opr é o parâmetro da URL que representa a operação a ser realizada (edit ou view).
    const { id, opr } = useParams();

    // useNavigate é usado para navegar entre páginas.
    const navigate = useNavigate();

    // useForm: usado para gerenciar o estado do formulário, como os valores dos campos e as validações.
    // O useForm retorna um objeto com várias propriedades e métodos, como control, handleSubmit, reset e formState.
    // control: usado para conectar os campos do formulário ao estado do formulário gerenciado pelo useForm.
    // handleSubmit: função que lida com o envio do formulário e valida os dados.
    // reset: função que redefine os valores do formulário para os valores iniciais.
    // formState: objeto que contém o estado do formulário, como erros de validação e se o formulário está sendo enviado.
    const { control, handleSubmit, reset, formState: { errors } } = useForm();

    // Se opr for 'view', será utilizada para ajustar o formulário como somente leitura.
    const isReadOnly = opr === 'view';
    const [imagemBase64, setImagemBase64] = useState(null);

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result.split(',')[1];
                resolve({ base64, mimeType: file.type });
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    // title: variável que define o título do formulário com base na operação e no id.
    let title;
    if (opr === 'view') {
        title = `Visualizar Produto: ${id}`;
    } else if (id) {
        title = `Editar Produto: ${id}`;
    } else {
        title = "Novo Produto";
    }

    useEffect(() => {
        if (id) {
            const fetchProduto = async () => {
                try {
                    const data = await getProdutoById(id);

                    if (data && data.length > 0) {
                        reset(data[0]);

                        if (data[0].foto) {
                            setImagemBase64({
                                data: data[0].foto,
                                type: 'image/jpeg'
                            });
                        }
                    }
                } catch (error) {
                    console.error('Erro ao buscar produto:', error);
                }
            };

            fetchProduto();
        }
    }, [id, reset]);

    const onSubmit = async (data) => {
        try {
            const produtoData = {
                nome: data.nome,
                descricao: data.descricao,
                valor_unitario: data.valor_unitario,
                foto: imagemBase64?.data || "",
            };

            if (data.foto instanceof FileList && data.foto.length > 0) {
                const { base64 } = await convertToBase64(data.foto[0]);
                produtoData.foto = base64;
            }

            let retorno;
            if (id) {
                retorno = await updateProduto(id, produtoData);
            } else {
                retorno = await createProduto(produtoData);
            }

            const retornoDados = Array.isArray(retorno) ? retorno[0] : retorno;

            if (!retornoDados || !retornoDados.id) {
                throw new Error(retornoDados?.erro || "Erro ao salvar produto.");
            }

            toast.success(`Produto salvo com sucesso. ID: ${retornoDados.id}`, { position: "top-center" });
            navigate('/produtos');
        } catch (error) {
            console.error("Erro no envio: ", error.response ? error.response.data : error.message);
            toast.error(`Erro ao salvar produto: \n${error.message}`, { position: "top-center" });
        }
    };

    return (
        <Box className="ProdutoForm" component="form" onSubmit={handleSubmit(onSubmit)} sx={{ backgroundColor: '#999999', padding: 2, borderRadius: 1, mt: 2 }}>
            <Toolbar sx={{ backgroundColor: '#E0E0E0', padding: 1, borderRadius: 2, mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" gutterBottom color="black">{title}</Typography>
            </Toolbar>
            <Box sx={{ backgroundColor: 'white', padding: 2, borderRadius: 3, mb: 2 }}>
                {opr === 'view' && (
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                        Todos os campos estão em modo somente leitura.
                    </Typography>
                )}
                <Controller
                    name="nome"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Nome é obrigatório", maxLength: { value: 100, message: "Nome deve ter no máximo 100 caracteres" } }}
                    render={({ field }) => (
                        <TextField {...field} disabled={isReadOnly} label="Nome" fullWidth margin="normal" error={!!errors.nome} helperText={errors.nome?.message} inputProps={{ maxLength: 100 }} />
                    )}
                />
                <Controller
                    name="descricao"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Descrição é obrigatória", maxLength: { value: 200, message: "Descrição deve ter no máximo 200 caracteres" } }}
                    render={({ field }) => (
                        <TextField {...field} disabled={isReadOnly} label="Descrição" fullWidth margin="normal" error={!!errors.nome} helperText={errors.nome?.message} inputProps={{ maxLength: 200 }} />
                    )}
                />
                <Controller
                    name="valor_unitario"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Valor é obrigatório", maxLength: { value: 100, message: "Valor deve ter no máximo 100 caracteres" } }}
                    render={({ field }) => (
                        <TextField {...field} type="number" disabled={isReadOnly} label="Valor Unitário" fullWidth margin="normal" error={!!errors.nome} helperText={errors.nome?.message} />
                    )}
                />

                {/* Campo para selecionar a foto */}
                {/* O input file é um campo de entrada que permite ao usuário selecionar um arquivo do sistema de arquivos. */}
                {/* O accept é usado para especificar os tipos de arquivos que o usuário pode selecionar. */}
                {/* O disabled é usado para desabilitar o campo quando o formulário está em modo somente leitura. */}
                {/* O onChange é um evento que é acionado quando o valor do campo muda. */}
                {/* O handleFileChange é uma função que lida com a mudança do valor do campo, redimensionando e comprimindo a imagem selecionada. */}
                {/* Não utilizamos Controller, pois o estado será tratado em handleFileChange */}
                <Controller
                    name="foto"
                    control={control}
                    defaultValue={null}
                    render={({ field }) => (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="body1" sx={{ mb: 1 }}>Imagem do Produto</Typography>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const { base64, mimeType } = await convertToBase64(file);
                                        setImagemBase64({ data: base64, type: mimeType });
                                        field.onChange(e); // repassa evento para RHF
                                    }
                                }}
                                disabled={isReadOnly}
                            />
                            {errors.foto && (
                                <Typography variant="caption" color="error">
                                    {errors.foto.message}
                                </Typography>
                            )}

                            {/* Pré-visualização da imagem */}
                            {imagemBase64?.data && (
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="body2">Pré-visualização:</Typography>
                                    <img
                                        src={`data:${imagemBase64.type};base64,${imagemBase64.data}`}
                                        alt="Imagem do Produto"
                                        style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8, marginTop: 8 }}
                                    />
                                </Box>
                            )}
                        </Box>
                    )}
                />

                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                    <Button onClick={() => navigate('/produtos')} sx={{ mr: 1, border: '1px solid black', color: 'black' }} variant="outlined">Cancelar</Button>
                    {opr !== 'view' && (
                        <Button type="submit" sx={{ background: '#222222' }} variant="contained">{id ? "Atualizar" : "Cadastrar"}</Button>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default ProdutoForm;
