// ListaUsuario.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Usuario {
  cpf: string;
  nome: string;
  sobrenome: string;
  data_nascimento: string;
  email: string;
  genero: string;
}

const ListaUsuario: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [edicao, setEdicao] = useState<{ [cpf: string]: boolean }>({});

  useEffect(() => {
    // Função para obter a lista de usuários
    const obterUsuarios = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/lista-pessoas');
        // Verifica se a resposta contém um array antes de chamar map
        if (response.data && response.data.data && Array.isArray(response.data.data)) {
          setUsuarios(response.data.data);
        } else {
          console.error('A resposta da API não contém a estrutura esperada:', response.data);
        }
      } catch (error) {
        console.error('Erro ao obter lista de usuários:', error);
      }
    };

    // Chama a função de obter usuários ao montar o componente
    obterUsuarios();
  }, []); // O segundo argumento vazio garante que useEffect é chamado apenas uma vez

  // Função para habilitar/desabilitar edição de um usuário
  const toggleEdicao = (cpf: string) => {
    setEdicao((prevEdicao) => ({
      ...prevEdicao,
      [cpf]: !prevEdicao[cpf],
    }));
  };

  // Função para salvar as edições de um usuário
  const salvarEdicao = async (cpf: string) => {
    // Lógica para salvar as edições do usuário com o CPF fornecido
    try {
      // Implemente a lógica de atualização na sua API
      // Exemplo de requisição fictícia
      await axios.put(`http://localhost:8000/api/atualizar-usuario/${cpf}`, {
        // Envie os campos atualizados aqui
      });
      
      // Atualize o estado local se a requisição for bem-sucedida
      setEdicao((prevEdicao) => ({
        ...prevEdicao,
        [cpf]: false,
      }));
    } catch (error) {
      console.error('Erro ao salvar edições:', error);
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
              <td>{edicao[usuario.cpf] ? <input value={usuario.nome} /> : usuario.nome}</td>
              <td>{edicao[usuario.cpf] ? <input value={usuario.sobrenome} /> : usuario.sobrenome}</td>
              <td>{edicao[usuario.cpf] ? <input value={usuario.email} /> : usuario.email}</td>
              <td>{usuario.data_nascimento}</td>
              <td>{edicao[usuario.cpf] ? <input value={usuario.genero} /> : usuario.genero}</td>
              <td>
                <button onClick={() => toggleEdicao(usuario.cpf)}>
                  {edicao[usuario.cpf] ? '\u2714' : '\u270E'}
                </button>
              </td>
              {edicao[usuario.cpf] && (
                <>
                  <td>
                    <button onClick={() => salvarEdicao(usuario.cpf)}>{'\u2714'}</button>
                  </td>
                  <td>
                    <button onClick={() => toggleEdicao(usuario.cpf)}>{'\u2716'}</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListaUsuario;
