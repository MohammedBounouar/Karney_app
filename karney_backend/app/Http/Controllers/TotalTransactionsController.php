<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TotalTransactions; // Import the TotalTransactions model

class TotalTransactionsController extends Controller
{
    public function index(){
        $total = TotalTransactions::all();
        return response()->json([
            'status'=> 200,
            'total'=> $total,
        ]);
    }
    public function show($customerId)
    {
        $totalTrans = TotalTransactions::where('CustomerID', $customerId)->get();

        if ($totalTrans->isEmpty()) {
            return response()->json([
                'status' => 404,
                'message' => 'totalTrans not found for customer ID: ' . $customerId,
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'totalTrans' => $totalTrans,
        ]);
    }
}
