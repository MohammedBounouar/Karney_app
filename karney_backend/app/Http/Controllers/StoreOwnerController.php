<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\StoreOwner;

class StoreOwnerController extends Controller
{
    public function index(){

        $storeOwner = StoreOwner::all();
        return response()->json([
            'status' => 200,
            'storeOwner' => $storeOwner,
        ]);
    }

    public function getTotalTransactions($storeOwnerId)
    {
    // Get the store owner
        $storeOwner = StoreOwner::find($storeOwnerId);

        if (!$storeOwner) {
            return response()->json(['error' => 'Store Owner not found'], 404);
        }

        // Corrected query
        $totalTransactions = $storeOwner->customers()
            ->join('total_transactions', 'customers.id', '=', 'total_transactions.CustomerID') // Adjust column name
            ->sum('total_transactions.Total'); // Adjust column name

        return response()->json(['totalTransactions' => $totalTransactions]);
    }

    // ::::::::::::::::::::::::::::::::::::::::::::::::::::::
    public function getCustomersWithCredit($storeOwnerId)
    {
    // Get the store owner
        $storeOwner = StoreOwner::find($storeOwnerId);

        if (!$storeOwner) {
            return response()->json(['error' => 'Store Owner not found'], 404);
        }

        // Corrected query
        $CustomersWithCredit = $storeOwner->customers()
            ->join('total_transactions', 'customers.id', '=', 'total_transactions.CustomerID') // Adjust column name
            ->where('total_transactions.Total', '>', 0) // Filter for positive transaction totals
            ->distinct() // Ensure each customer is only counted once
            ->count('customers.id'); // Count distinct customers

        return response()->json(['CustomersWithCredit' => $CustomersWithCredit]);
    }

    public function store(Request $request){
        $storeOwner = new StoreOwner();
    
        $storeOwner->full_name = $request->input('full_name');
        $storeOwner->phone_number = $request->input('phone_number');
        $storeOwner->email = $request->input('email');
        $storeOwner->password = $request->input('password');
        $storeOwner->CIN = $request->input('CIN');
        $storeOwner->save();

        return response()->json([
            'status' => 200,
            'message'    => 'storeOwner added successfully',
            'storeOwner' => $storeOwner,
        ]);
    }
    public function show($storeOwnerId)
    {
        $storeOwner = storeowner::where('id', $storeOwnerId)->get();

        if (!$storeOwner) {
            return response()->json([
                'status' => 404,
                'message' => 'storeOwner not found' . $storeOwnerId,

            ], 404);
        }

        return response()->json([
            'status' => 200,
            'storeOwner' => $storeOwner,
        ]);
    }
    public function update(Request $request , $id)
    {
        $storeOwner = StoreOwner::find($id);

        if (!$storeOwner) {
            return response()->json([
                'status'  => 404,
                'message' => 'stoteOwner not found',
            ], 404);
        }

        $storeOwner->update([
            'full_name'       => $request->input('full_name'),
            'phone_number'    => $request->input('phone_number'),
            'email'           => $request->input('email'),
            'password'        => $request->input('password'),
            'CIN'             => $request->input('CIN'),
        ]);

        return response()->json([
            'status' => 200,
            'message'    => 'storeOwner updated successfully',
            'storeOwner' => $storeOwner,
        ]);
    }
}
