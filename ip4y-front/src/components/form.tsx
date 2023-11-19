'use client';

import React, { useState } from 'react';
import InputMask from 'react-input-mask';
import axios from 'axios';

interface FormularioUsuarioProps {
  onInserir: (usuario: Usuario) => void;
}

interface Usuario {
  cpf: string;
  nome: string;
  sobrenome: string;
  data_nascimento: string;
  email: string;
  genero: string;
}
const validarCPF = (cpf: string): boolean => {
  cpf = cpf.replace(/[^\d]+/g, '');

  if (cpf === '') return false;

  // Elimina CPFs invalidos conhecidos
  if (
    cpf.length !== 11 ||
    cpf === '00000000000' ||
    cpf === '11111111111' ||
    cpf === '22222222222' ||
    cpf === '33333333333' ||
    cpf === '44444444444' ||
    cpf === '55555555555' ||
    cpf === '66666666666' ||
    cpf === '77777777777' ||
    cpf === '88888888888' ||
    cpf === '99999999999'
  ) {
    return false;
  }

  // Valida 1o digito
  let add = 0;
  for (let i = 0; i < 9; i++) add += parseInt(cpf.charAt(i)) * (10 - i);

  let rev = 11 - (add % 11);
  if (rev === 10 || rev === 11) rev = 0;

  if (rev !== parseInt(cpf.charAt(9))) return false;

  // Valida 2o digito
  add = 0;
  for (let i = 0; i < 10; i++) add += parseInt(cpf.charAt(i)) * (11 - i);

  rev = 11 - (add % 11);
  if (rev === 10 || rev === 11) rev = 0;

  return rev === parseInt(cpf.charAt(10));
};

const validarData = (data: string): boolean => {
  const regexData = /^\d{2}-\d{2}-\d{4}$/;

  if (!regexData.test(data)) {
    return false;
  }

  const [dia, mes, ano] = data.split('-');
  const dataObj = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));

  // Verifica se o objeto de data foi criado corretamente e se os valores de dia, mês e ano são válidos
  return (
    !isNaN(dataObj.getTime()) &&
    parseInt(dia) === dataObj.getDate() &&
    parseInt(mes) === dataObj.getMonth() + 1 &&
    parseInt(ano) === dataObj.getFullYear() &&
    parseInt(ano) >= new Date().getFullYear() - 100 &&
    parseInt(ano) <= new Date().getFullYear()
  );
};

const validarEmail = (email: string) : boolean => {
  // Lógica de validação de e-mail
  // Pode ser uma expressão regular ou outra lógica de validação
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};


const FormularioUsuario: React.FC<FormularioUsuarioProps> = ({ onInserir }) => {
  const [usuario, setUsuario] = useState<Usuario>({
    cpf: '',
    nome: '',
    sobrenome: '',
    data_nascimento: '',
    email: '',
    genero: '',
  });

  const [cpfValido, setCpfValido] = useState(true); // Estado para controlar se o CPF é válido
  const [dataValida, setDataValida] = useState(true); // Estado para controlar se a Data é válido
  const [emailValido, setEmailValido] = useState(true); // Estado para controlar se a Data é válido
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUsuario((prevUsuario) => ({
      ...prevUsuario,
      [name]: value,
    }));

    // Validar o CPF
    if (name === 'cpf') {
      setCpfValido(validarCPF(value));
    }
    else if (name === 'data_nascimento') {
      setDataValida(validarData(value));
    } else if (name === 'email') {
      setEmailValido(validarEmail(value));
    }
  };

  const handleInserir = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario.cpf || !usuario.nome || !usuario.sobrenome || !usuario.data_nascimento || !usuario.email || !usuario.genero) {
      alert('Todos os campos são obrigatórios');
      return;
    }
    if (!cpfValido) {
      alert('CPF inválido');
      return;
    }
  
    if (!validarData(usuario.data_nascimento)) {
      alert('Data de Nascimento inválida');
      return;
    }
    if (!emailValido) {
      alert('E-mail inválido');
      return;
    }
    if (!usuario.cpf || !usuario.nome || !usuario.sobrenome || !usuario.data_nascimento || !usuario.email || !usuario.genero) {
      alert('Todos os campos são obrigatórios');
      return;
    }
    try {
      const response = await axios.post('http://localhost:8000/api/adicionar-pessoa', usuario, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      
      // Se a requisição foi bem-sucedida, você pode chamar a função de inserir do componente pai
      if (response.status === 200) {
        //onInserir(usuario);
        // Limpar os campos após a inserção, se necessário

         alert("Usuário Cadastrado com sucesso");
         setUsuario({
          cpf: '',
          nome: '',
          sobrenome: '',
          data_nascimento: '',
          email: '',
          genero: '',
        });
      }
    } catch (error) {
      // Se ocorrer uma exceção, tratamos como erro genérico
      console.error('Erro ao adicionar pessoa:', error);
  
      // Se o erro for do tipo AxiosError, podemos verificar o status da resposta
      if (axios.isAxiosError(error) && error.response) {
        const responseData = error.response.data; // Correção aqui
  
        // Verificar se a mensagem de erro indica duplicidade de CPF para status 422
        if (
          responseData.message === "The given data was invalid." &&
          responseData.errors &&
          responseData.errors.cpf &&
          responseData.errors.cpf[0] === "The cpf has already been taken."
        ) {
          // Exibir alerta personalizado para duplicidade de CPF
          alert("CPF já cadastrado");
        } else {
          // Exibir alerta genérico para outros erros 422 ou outros status de erro
          alert('Erro ao adicionar pessoa, entre em contato com o administrador');
        }
      }
    }
  };
  
  

  const handleLimparCampos = () => {
    setUsuario({
      cpf: '',
      nome: '',
      sobrenome: '',
      data_nascimento: '',
      email: '',
      genero: '',
    });
  };

  return (
    <form className="formulario">
        <h1>Cadastro</h1>
      <label>
        CPF:
        {/* <input type="text" name="cpf" value={usuario.cpf} onChange={handleChange} /> */}
        <InputMask 
          mask="999.999.999-99"
          maskChar={null}
          type="text"
          name="cpf"
          value={usuario.cpf}
          onChange={handleChange}
          required 
        />
        {!cpfValido && <span style={{ color: 'red' }}>CPF inválido</span>}
      </label>

      <label>
        Nome:
        <input type="text" name="nome" value={usuario.nome} onChange={handleChange} required />
      </label>

      <label>
        Sobrenome:
        <input type="text" name="sobrenome" value={usuario.sobrenome} onChange={handleChange} required />
      </label>

      <label>
        Data de Nascimento:
        {/* <input type="text" name="data_nascimento" value={usuario.data_nascimento} onChange={handleChange} /> */}
        <InputMask 
          mask="99-99-9999"
          maskChar={null}
          type="text"
          name="data_nascimento"
          value={usuario.data_nascimento}
          onChange={handleChange}
          required 
        />
        {!dataValida && <span style={{ color: 'red' }}>Data de nascimento inválida</span>}
      </label>

      <label>
        E-mail:
        <input type="text" name="email" value={usuario.email} onChange={handleChange} required />
        {!emailValido && <span style={{ color: 'red' }}>E-mail inválido</span>}
      </label>

      <label>
        Gênero:
        <input type="text" name="genero" value={usuario.genero} onChange={handleChange} required />
      </label>

      <button onClick={handleInserir}>Inserir</button>
      <button onClick={handleLimparCampos}>Recomeçar</button>
    </form>
  );
};

export default FormularioUsuario;
