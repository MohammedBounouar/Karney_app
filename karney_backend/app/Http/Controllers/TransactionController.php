<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Transaction;
use App\Models\TotalTransactions; // Import the TotalTransactions model

class TransactionController extends Controller
{
    public function index()
    {
        $transactions = Transaction::all();

        return response()->json([
            'status' => 200,
            'transactions' => $transactions,
        ]);
    }

    public function show($customerId)
    {
        $transactions = Transaction::where('CustomerID', $customerId)->get();

        if ($transactions->isEmpty()) {
            return response()->json([
                'status' => 404,
                'message' => 'Transactions not found for customer ID: ' . $customerId,
            ]);
        }

        return response()->json([
            'status' => 200,
            'transactions' => $transactions,
        ]);
    }

    public function store(Request $request)
    {
        // Create a new transaction
        $transaction = new Transaction();
        $transaction->CustomerID = $request->input('CustomerID');
        $transaction->produit_bought = $request->input('produit_bought');
        $transaction->Quantity_bought = $request->input('Quantity_bought');
        $transaction->produit_price = $request->input('produit_price');
        $transaction->save();

        // Recalculate and update total transactions
        $totalTransaction = Transaction::selectRaw('CustomerID, SUM(produit_price * Quantity_bought) as total')
            ->where('CustomerID', $request->input('CustomerID'))
            ->groupBy('CustomerID')
            ->first();

        // Update or create total transactions record
        TotalTransactions::updateOrCreate(
            ['CustomerID' => $request->input('CustomerID')],
            ['Total' => $totalTransaction->total]
        );

        return response()->json([
            'status' => 200,
            'message' => 'Transaction created successfully.',
            'transaction' => $transaction,
        ]);
    }


    public function destroy($id)
    {
        // Find the transaction by its ID
        $transaction = Transaction::find($id);
    
        if (!$transaction) {
            // If the transaction with the given ID doesn't exist, return a 404 response
            return response()->json([
                'status' => 404,
                'message' => 'Transaction not found.',
            ], 404);
        }
    
        // Get the customer ID of the transaction
        $customerId = $transaction->CustomerID;
    
        // Delete the transaction
        $transaction->delete();
    
        // Recalculate the total transactions for the customer after deletion
        $totalTransaction = Transaction::selectRaw('SUM(produit_price * Quantity_bought) as total')
            ->where('CustomerID', $customerId)
            ->groupBy('CustomerID')
            ->first();
    
        // If there are no more transactions for the customer, set total to 0
        $newTotal = $totalTransaction ? $totalTransaction->total : 0;
    
        // Update the total transactions record
        TotalTransactions::updateOrCreate(
            ['CustomerID' => $customerId],
            ['Total' => $newTotal]
        );
    
        return response()->json([
            'status' => 200,
            'message' => 'Transaction deleted successfully.',
        ]);
    }
}    