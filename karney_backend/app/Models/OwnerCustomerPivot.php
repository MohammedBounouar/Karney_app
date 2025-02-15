<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OwnerCustomerPivot extends Model
{
    use HasFactory;
    protected $table = 'owner_customer_pivot';
    protected $fillable = ['storeOwnerId', 'CustomerId'];

    // Define the relationship with the Customer model
    public function customer()
    {
        return $this->belongsTo(Customer::class, 'CustomerId');
    }

    // Define the relationship with the StoreOwner model
    public function storeOwner()
    {
        return $this->belongsTo(StoreOwner::class, 'storeOwnerId');
    }
}
