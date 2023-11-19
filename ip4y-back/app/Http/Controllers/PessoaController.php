<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pessoa;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;

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
        public function atualizarPessoa(Request $request, $cpf)
        {
            try {
                // Validação dos dados recebidos
                $validator = Validator::make($request->all(), [
                    'nome' => 'required|string',
                    'sobrenome' => 'required|string',
                    'data_nascimento' => 'required|date_format:d-m-Y',
                    'email' => 'required|email',
                    'genero' => 'required|string',
                ]);
    
                if ($validator->fails()) {
                    return response()->json(['error' => $validator->errors()], 400);
                }
    
                // Busca a pessoa pelo CPF
                $pessoa = Pessoa::where('cpf', $cpf)->firstOrFail();
    
                // Atualiza os dados da pessoa
                $dataNascimento = Carbon::createFromFormat('d-m-Y', $request->input('data_nascimento'))->toDateString();
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
            public function deletarPessoa($cpf)
            {
                try {
                    // Busca a pessoa pelo CPF
                    $pessoa = Pessoa::findOrFail($cpf);
        
                    // Deleta a pessoa
                    $pessoa->delete();
        
                    // Configuração correta dos cabeçalhos CORS
                    $headers = [
                        'Access-Control-Allow-Origin' => 'http://localhost:3000',
                        'Access-Control-Allow-Credentials' => 'true',
                    ];
        
                    return response()->json(['message' => 'Pessoa deletada com sucesso'], 200, $headers);
                } catch (\Exception $e) {
                    Log::error('Erro na deletarPessoa: ' . $e->getMessage());
                    return response()->json(['error' => 'Erro interno do servidor.', 'details' => $e->getMessage()], 500);
                }
            }
    }

?>