import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Box, Typography, Toolbar } from '@mui/material';
import IMaskInputWrapper from '../components/IMaskInputWrapper';
import '../styles/ProdutoForm.css';

const ProdutoForm = () => {
    const { register, handleSubmit, control, formState: { errors } } = useForm();

    const onSubmit = (data) => {
        console.log("Dados do produto:", data);
    };

    return (
        <Box className="ProdutoForm" component="form" onSubmit={handleSubmit(onSubmit)}
            sx={{ backgroundColor: '#999999', padding: 2, borderRadius: 1, mt: 2 }} >
            
            <Toolbar sx={{ backgroundColor: '#E0E0E0', padding: 1, borderRadius: 2, mb: 2,
                    display: 'flex', justifyContent: 'space-between' }} >
                
                <Typography variant="h6" color="black">Dados Produto</Typography>
            
            </Toolbar>

            <Box sx={{ backgroundColor: 'white', padding: 2, borderRadius: 3, mb: 2 }}>
                
                <TextField label="Nome" fullWidth margin="normal"
                    {...register('nome', { required: 'Nome é obrigatório' })}
                    error={!!errors.nome} helperText={errors.nome?.message} />

                <TextField label="Descrição" fullWidth margin="normal"
                    {...register('descricao', { required: 'Descrição é obrigatória' })}
                    error={!!errors.descricao} helperText={errors.descricao?.message} />

                <Controller name="valor_unitario" control={control} defaultValue=""
                    rules={{ required: 'Valor unitário é obrigatório' }} render={({ field }) => (
                        
                        <TextField {...field} label="Valor Unitário" fullWidth
                            margin="normal" error={!!errors.valor_unitario} helperText={errors.valor_unitario?.message}
                            InputProps={{ inputComponent: IMaskInputWrapper, inputProps: {
                                    mask: 'R$ num',
                                    blocks: { num: { mask: Number, scale: 2, thousandsSeparator: '.',
                                            radix: ',', padFractionalZeros: true, normalizeZeros: true } }, lazy: false, unmask: true }, }} /> )} />

                <Box sx={{ mt: 2 }}>
                    <Typography variant="body1" sx={{ mb: 1 }}>Imagem do Produto</Typography>
                    <input type="file" accept="image/*" {...register('foto')} />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                    <Button sx={{ mr: 1, border: '1px solid black', color: 'black' }} variant="outlined">Cancelar</Button>
                    <Button type="submit" sx={{ background: '#222222'}} variant="contained">Cadastrar</Button>
                </Box>
            </Box>
        </Box>
    );
};

export default ProdutoForm;
