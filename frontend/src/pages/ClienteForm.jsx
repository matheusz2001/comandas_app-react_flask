import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Box, Typography, Toolbar } from '@mui/material';
import IMaskInputWrapper from '../components/IMaskInputWrapper';
import '../styles/ClienteForm.css';

const ClienteForm = () => {
    const { control, register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = (data) => {
        console.log("Dados do cliente:", data);
    };

    return (
        <Box className="ClienteForm" component="form" onSubmit={handleSubmit(onSubmit)} sx={{ backgroundColor: '#999999', padding: 2, borderRadius: 1, mt: 2 }}>
            <Toolbar sx={{ backgroundColor: '#E0E0E0', padding: 1, borderRadius: 2, mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" color="black">Dados Cliente</Typography>
            </Toolbar>

            <Box sx={{ backgroundColor: 'white', padding: 2, borderRadius: 3, mb: 2 }}>
                
                <TextField label="Nome" fullWidth margin="normal"
                    {...register('nome', { required: 'Nome é obrigatório' })} error={!!errors.nome} helperText={errors.nome?.message} 
                    inputProps={{ maxLength: 100 }} />

                <Controller name="cpf" control={control} defaultValue=""
                    rules={{ required: 'CPF é obrigatório' }} render={({ field }) => (
                        
                        <TextField {...field} label="CPF" fullWidth margin="normal"
                            error={!!errors.cpf} helperText={errors.cpf?.message}
                            InputProps={{ inputComponent: IMaskInputWrapper, inputProps: {
                                    mask: "000.000.000-00", definitions: { "0": /[0-9]/ },
                                    unmask: true, }, }} />
                    )} />

                <Controller name="telefone" control={control} defaultValue=""
                    rules={{ required: 'Telefone é obrigatório' }} render={({ field }) => (
                        
                        <TextField {...field} label="Telefone" fullWidth
                            margin="normal" error={!!errors.telefone}
                            helperText={errors.telefone?.message}
                            InputProps={{ inputComponent: IMaskInputWrapper, inputProps: {
                                    mask: "(00) 00000-0000",
                                    definitions: { "0": /[0-9]/ },
                                    unmask: true,
                                }, }} />
                    )} />

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button sx={{ mr: 1, border: '1px solid black', color: 'black' }} variant="outlined">Cancelar</Button>
                    <Button type="submit" sx={{ background: '#222222'}} variant="contained">Cadastrar</Button>
                </Box>
            </Box>
        </Box>
    );
};

export default ClienteForm;
