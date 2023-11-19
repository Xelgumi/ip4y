<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pessoa extends Model
{
    use HasFactory;

    protected $primaryKey = 'cpf';
    public $incrementing = false;
    protected $keyType = 'integer';

    protected $fillable = [
        'cpf',
        'nome',
        'sobrenome',
        'data_nascimento',
        'email',
        'genero',
    ];
}
