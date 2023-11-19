<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pessoa;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Carbon\Carbon;

class PessoaController extends Controller
{
    public function adicionarPessoa(Request $request)
        {
            try {
                // Validação dos dados recebidos
                $request->validate([
                    'cpf' => 'required|string|unique:pessoas',
                    'nome' => 'required|string',
                    'sobrenome' => 'required|string',
                    'data_nascimento' => 'required|date',
                    'email' => 'required|email',
                    'genero' => 'required|string',
                ]);

                            // Formatação da data de nascimento
            $dataNascimento = Carbon::createFromFormat('d-m-Y', $request->input('data_nascimento'))->format('Y-m-d');

            // Criação de uma nova pessoa com a data de nascimento formatada
            $pessoa = Pessoa::create(array_merge($request->all(), ['data_nascimento' => $dataNascimento]));

                // Configuração correta dos cabeçalhos CORS
                $headers = [
                    'Access-Control-Allow-Origin' => 'http://localhost:3000',
                    'Access-Control-Allow-Credentials' => 'true',
                ];

                return response()->json(['message' => 'Pessoa adicionada com sucesso', 'data' => $pessoa], 200, $headers);
            } catch (QueryException $e) {
                Log::error('Erro no adicionarPessoa: ' . $e->getMessage());
                if ($e->errorInfo[1] == 1062) {
                    // Verifique se a exceção é relacionada ao campo CPF
                    if (Str::contains($e->getMessage(), 'pessoas_cpf_unique')) {
                        return response()->json(['error' => 'CPF já cadastrado'], 409, $headers);
                    }
        
                    // Se não for relacionado ao campo CPF, trata como erro interno
                    return response()->json(['error' => 'Erro interno do servidor.'], 500, $headers);
                }
        
                // Se a exceção não for devido à chave única, trata como erro interno
                return response()->json(['error' => 'Erro interno do servidor 2.', $e->errorInfo], 500);
            }
        }

        public function listarPessoas()
        {
            $pessoas = Pessoa::all();
    
            return response()->json(['data' => $pessoas], 200);
        }
        public function atualizarPessoa(Request $request, $id)
            {
                try {
                    // Validação dos dados recebidos
                    $request->validate([
                        'nome' => 'required|string',
                        'sobrenome' => 'required|string',
                        'data_nascimento' => 'required|date',
                        'email' => 'required|email',
                        'genero' => 'required|string',
                    ]);

                    // Busca a pessoa pelo ID
                    $pessoa = Pessoa::findOrFail($id);

                    // Atualiza os dados da pessoa
                    $dataNascimento = Carbon::createFromFormat('d-m-Y', $request->input('data_nascimento'))->format('Y-m-d');
                    $pessoa->update([
                        'nome' => $request->input('nome'),
                        'sobrenome' => $request->input('sobrenome'),
                        'data_nascimento' => $dataNascimento,
                        'email' => $request->input('email'),
                        'genero' => $request->input('genero'),
                    ]);

                    // Configuração correta dos cabeçalhos CORS
                    $headers = [
                        'Access-Control-Allow-Origin' => 'http://localhost:3000',
                        'Access-Control-Allow-Credentials' => 'true',
                    ];

                    return response()->json(['message' => 'Pessoa atualizada com sucesso', 'data' => $pessoa], 200, $headers);
                } catch (\Exception $e) {
                    Log::error('Erro na atualizarPessoa: ' . $e->getMessage());
                    return response()->json(['error' => 'Erro interno do servidor.', 'details' => $e->getMessage()], 500);
                }
            }
    }

?>