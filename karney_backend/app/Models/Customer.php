<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;
    protected $fillable = ['full_name', 'phone_number', 'email', 'password', 'CIN','image'];
    
    public function storeOwners()
    {
        return $this->belongsToMany(StoreOwner::class, 'owner_customer_pivot', 'customerId', 'storeOwnerId');
    }
}
