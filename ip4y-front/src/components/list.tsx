import React, { useEffect, useState } from 'react';
import axios from 'axios';
import InputMask from 'react-input-mask';

interface Usuario {
  cpf: string;
  nome: string;
  sobrenome: string;
  data_nascimento: string;
  email: string;
  genero: string;
}


const validarData = (data: string): boolean => {
  const regexData = /^\d{2}-\d{2}-\d{4}$/;

  if (!regexData.test(data)) {
    console.error('Formato de data inválido:', data);
    return false;
  }

  const [dia, mes, ano] = data.split('-').map(Number);
  const dataObj = new Date(ano, mes - 1, dia);

  return (
    !isNaN(dataObj.getTime()) &&
    dataObj.getDate() === dia &&
    dataObj.getMonth() === mes - 1 &&
    dataObj.getFullYear() === ano &&
    ano >= new Date().getFullYear() - 100 &&
    ano <= new Date().getFullYear()
  );
};







const validarEmail = (email: string) : boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const ListaUsuario: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [edicao, setEdicao] = useState<{ [cpf: string]: boolean }>({});
  const [dataValida, setDataValida] = useState(true);
  const [emailValido, setEmailValido] = useState(true);
  useEffect(() => {
    const obterUsuarios = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/lista-pessoas');
        if (response.data && response.data.data && Array.isArray(response.data.data)) {
          setUsuarios(response.data.data);
        } else {
          console.error('A resposta da API não contém a estrutura esperada:', response.data);
        }
      } catch (error) {
        console.error('Erro ao obter lista de usuários:', error);
      }
    };

    obterUsuarios();
  }, []);
  const toggleEdicao = (cpf: string) => {
    setEdicao((prevEdicao) => ({
      ...prevEdicao,
      [cpf]: !prevEdicao[cpf],
    }));
  };

const atualizarCampoEditavel = (cpf: string, campo: string, valor: string) => {
  setUsuarios((prevUsuarios) =>
    prevUsuarios.map((usuario) =>
      usuario.cpf === cpf ? { ...usuario, [campo]: campo === 'data_nascimento' ? inverterFormatoData(valor) : valor } : usuario
    )
  );
};
  
  const deletarUsuario = async (cpf: string) => {
    const confirmacao = window.confirm('Tem certeza de que deseja deletar este usuário?');

    if (confirmacao) {
      try {

        await axios.delete(`http://localhost:8000/api/deletar-pessoa/${cpf}`);

        setUsuarios((prevUsuarios) => prevUsuarios.filter((usuario) => usuario.cpf !== cpf));
        

        if (edicao[cpf]) {
          setEdicao((prevEdicao) => ({
            ...prevEdicao,
            [cpf]: false,
          }));
        }
      } catch (error) {
        console.error('Erro ao deletar usuário:', error);
      }
    }
  };
const salvarEdicao = async (cpf: string) => {
  const usuarioEditavel = usuarios.find((usuario) => usuario.cpf === cpf);


  if (usuarioEditavel && !validarData(inverterFormatoData(usuarioEditavel.data_nascimento))) {
    setDataValida(false);
    alert('Data de nascimento inválida. Por favor, corrija.');
    return;
  }

  if (usuarioEditavel && !validarEmail(usuarioEditavel.email)) {
    setEmailValido(false);
    alert('E-mail inválido. Por favor, corrija.');
    return;
  }
  try {
    const usuarioEditavel = usuarios.find((usuario) => usuario.cpf === cpf);

    if (!usuarioEditavel) {
      console.error('Usuário não encontrado para edição.');
      return;
    }

    await axios.put(`http://localhost:8000/api/atualizar-pessoas/${cpf}`, {
      ...usuarioEditavel, 
      data_nascimento: inverterFormatoData(usuarioEditavel.data_nascimento),
    });

    setEdicao((prevEdicao) => ({
      ...prevEdicao,
      [cpf]: false,
    }));
  } catch (error) {
    console.error('Erro ao salvar edições:', error);
  }
  setDataValida(true);
  setEmailValido(true);
};

const formatarData = (data: string) => {
  const partes = data.split('-');
  if (partes.length === 3) {
    return `${partes[2]}-${partes[1]}-${partes[0]}`;
  }
  return data;
};

const inverterFormatoData = (data: string) => {
  const partes = data.split('-');
  if (partes.length === 3) {
    return `${partes[2]}-${partes[1]}-${partes[0]}`;
  }
  return data;
};
const enviarDadosParaAPIip4y = async () => {
  try {
    const response = await axios.post('https://api-teste.ip4y.com.br/cadastro', { usuarios });
    console.log('Dados enviados com sucesso:', response.data);
  } catch (error) {
    console.error('Erro ao enviar dados para a API externa:', error);
  }
};

  return (
    <div className="lista">
      <h1>Lista de Usuários</h1>
      
      <table>
        <thead>
          <tr className='header'>
            <th><strong>CPF:</strong></th>
            <th><strong>Nome:</strong></th>
            <th><strong>Sobrenome:</strong></th>
            <th><strong>Email:</strong></th>
            <th><strong>Nascimento:</strong></th>
            <th><strong>Gênero:</strong></th>
            <th colSpan={3}>Ações:</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.cpf}>
              <td>{usuario.cpf}</td>
              <td>{edicao[usuario.cpf] ? <input value={usuario.nome} onChange={(e) => atualizarCampoEditavel(usuario.cpf, 'nome', e.target.value)}/> : usuario.nome}</td>
              <td>{edicao[usuario.cpf] ? <input value={usuario.sobrenome}  onChange={(e) => atualizarCampoEditavel(usuario.cpf, 'sobrenome', e.target.value)}/> : usuario.sobrenome}</td>
              <td>{edicao[usuario.cpf] ? <input value={usuario.email}  onChange={(e) => atualizarCampoEditavel(usuario.cpf, 'email', e.target.value)}/> : usuario.email}</td>
              <td>
                {edicao[usuario.cpf] ? (
                  <InputMask
                    mask="99-99-9999"
                    value={inverterFormatoData(usuario.data_nascimento)}
                    onChange={(e) => atualizarCampoEditavel(usuario.cpf, 'data_nascimento', e.target.value)}
                  />
                ) : (
                  inverterFormatoData(usuario.data_nascimento)
                )}
              </td>


              <td>{edicao[usuario.cpf] ? <input value={usuario.genero}  onChange={(e) => atualizarCampoEditavel(usuario.cpf, 'genero', e.target.value)}/> : usuario.genero}</td>
              <td>
                <button onClick={() => toggleEdicao(usuario.cpf)}>
                  {edicao[usuario.cpf] ? '\u2716' : '\u270E'}
                </button>
              </td>
              {edicao[usuario.cpf] && (
                <>
                  <td>
                    <button onClick={() => salvarEdicao(usuario.cpf)}>{'\u2714'}</button>
                  </td>
                  <td>
                    <button onClick={() => deletarUsuario(usuario.cpf)}>{'\u2620'}</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <button className="api-btn" onClick={enviarDadosParaAPIip4y}>Enviar Dados para API iP4y</button>
    </div>
  );
};

export default ListaUsuario;
