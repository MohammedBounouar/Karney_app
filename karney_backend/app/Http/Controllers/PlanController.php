<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Plan;
use App\Models\StoreOwner; 

class PlanController extends Controller
{
    // Get all plans
    public function index()
    {
        $plans = Plan::all();
        return response()->json([
            'status' => 200,
            'plans' => $plans,
        ]);
    }

    // Get a specific plan by ID
    public function show($plan_id)
    {
        $plan = Plan::find($plan_id); // Use find() for a single record

        if (!$plan) {
            return response()->json([
                'status' => 404,
                'message' => 'Plan not found for ID: ' . $plan_id,
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'plan' => $plan,
        ]);
    }
    
    public function displayOwnersPlan($storeOwnerId)
{
    // Find the store owner using the storeOwnerId
    $storeOwner = StoreOwner::where('id', $storeOwnerId)->first(); // Use first() to get a single record

    // If a store owner with the specified id exists
    if ($storeOwner) {
        // Get the plan_id from the store owner
        $plan_id = $storeOwner->plan_id;

        // Find the plan using the plan_id
        $plan = Plan::find($plan_id);

        // If the plan exists, return it
        if ($plan) {
            return response()->json([
                'storeOwner' => $storeOwner,
                'plan' => $plan,
            ], 200);
        } else {
            return response()->json(['error' => 'Plan not found'], 404);
        }
    } else {
        return response()->json(['error' => 'Store owner not found'], 404);
    }
}


public function updateCustomerLimit(Request $request)
{
    $storeOwnerId = $request->input('store_owner_id');
    $increaseBy = $request->input('increase_by');

    $storeOwner = StoreOwner::find($storeOwnerId);
    if (!$storeOwner) {
        return response()->json(['error' => 'Store owner not found'], 404);
    }

    $storeOwner->customer_limit += $increaseBy;
    $storeOwner->save();

    return response()->json(['message' => 'Customer limit updated successfully']);
}

}
