<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PlanSeeder extends Seeder
{
    public function run()
    {
        DB::table('plans')->insert([
            [
                'name' => 'Free',
                'price' => 0.00,
                'customers_limit' => 10,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Basic',
                'price' => 30.00,
                'customers_limit' => 15,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Premium',
                'price' => 50.00,
                'customers_limit' => 25,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            
        ]);
    }
}
