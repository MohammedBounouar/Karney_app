<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StoreOwner extends Model
{
    use HasFactory;
    protected $fillable = ['full_name', 'phone_number', 'email', 'password', 'CIN'];
    
    public function customers()
    {
        return $this->belongsToMany(Customer::class, 'owner_customer_pivot', 'storeOwnerId', 'customerId');
    }
}
