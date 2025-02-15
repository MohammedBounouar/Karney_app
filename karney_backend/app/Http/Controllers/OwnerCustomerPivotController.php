<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\OwnerCustomerPivot;
use App\Models\Customer;


class OwnerCustomerPivotController extends Controller
{
    public function show($storeOwnerId)
    {
        // Retrieve the pivot records for the given storeOwnerId
        $pivotRecords = OwnerCustomerPivot::where('storeOwnerId', $storeOwnerId)->get();

        // If no pivot records are found, return a JSON response with a 404 status
        if ($pivotRecords->isEmpty()) {
            return response()->json([
                'status' => 404,
                'message' => 'No customers found for store owner with ID: ' . $storeOwnerId,
            ], 404);
        }

        // Retrieve the customer IDs from the pivot records
        $customerIds = $pivotRecords->pluck('CustomerId');

        // Retrieve the customers associated with the store owner
        $customers = Customer::whereIn('id', $customerIds)->get();

        // Return a JSON response with the customers
        return response()->json([
            'status' => 200,
            'customers' => $customers,
        ]);
    }
}
