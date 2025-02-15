<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TotalTransactions extends Model
{
    use HasFactory;
     // Define the table associated with the model
     protected $table = 'total_transactions';
    protected $fillable = ['CustomerID', 'Total'];
}
