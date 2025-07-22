<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Customer;
use App\Models\StoreOwner;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class CustomerController extends Controller
{
    public function index() {

        $customer = Customer::all();

        return response()->json([
            'status' => 200 ,
            'customer' => $customer,
        ]);
    }

    // // function for web
    // public function display(){

    //     $customer = Customer::all();
    //     return view('login')->with('customer', $customer);
    // }
    // // 

    public function store(Request $request){
        $customer = new Customer();
    
        $customer->full_name = $request->input('full_name');
        $customer->phone_number = $request->input('phone_number');
        $customer->email = $request->input('email');
        $customer->password = $request->input('password');
        $customer->CIN = $request->input('CIN');
        $customer->save();

        return response()->json([
            'status' => 200,
            'message' => 'Customer added successfully',
            'customer' => $customer,
        ]);
    }

    public function addCustomerStoreOwner(Request $request)
    {
        $validatedData = $request->validate([
            'store_owner_id' => 'required|exists:store_owners,id',
            'customer_id' => 'required|exists:customers,id',
        ]);

        $storeOwner = StoreOwner::findOrFail($validatedData['store_owner_id']);
        $customer = Customer::findOrFail($validatedData['customer_id']);

        // Assuming you have a many-to-many relationship defined between StoreOwner and Customer
        $storeOwner->customers()->attach($customer);

        return response()->json([
            'status' => 200,
            'message' => 'Customer and store owner relationship added successfully',
        ]);
    }

    public function destroy($id)
{
    // Find the customer by ID
    $customer = Customer::find($id);

    if ($customer) {
        // Delete the customer
        $customer->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Customer deleted successfully',
        ]);
    } else {
        return response()->json([
            'status' => 404,
            'message' => 'Customer not found',
        ], 404); // Return 404 if customer is not found
    }
}

// Add Show method to fetch a specific customer by ID
public function show($id)
{
    // Find the customer by ID
    $customer = Customer::find($id);

    if ($customer) {
        return response()->json([
            'status' => 200,
            'customer' => $customer,
        ]);
    } else {
        return response()->json([
            'status' => 404,
            'message' => 'Customer not found',
        ], 404); // Return 404 if customer is not found
    }
}

public function update(Request $request, $id)
{
    $customer = Customer::findOrFail($id);

    $request->validate([
        'image' => 'required|file|mimes:jpeg,png,jpg,gif,webp',
    ]);

    try {
        if ($request->hasFile('image')) {
            // Create directory if missing
            Storage::disk('public')->makeDirectory('profile_images');
            
            // Delete old image if exists
            if ($customer->image) {
                Storage::disk('public')->delete($customer->image);
            }

            // Store with unique filename
            $imagePath = $request->file('image')->store('profile_images', 'public');
            
            // Update customer record
            $customer->update([
                'image' => $imagePath
            ]);

            return response()->json([
                'status' => 200,
                'message' => 'Image updated successfully',
                'image_url' => asset("storage/{$imagePath}")
            ]);
        }

        return response()->json([
            'status' => 400,
            'message' => 'No image provided'
        ], 400);

    } catch (\Exception $e) {
        Log::error('Image upload error: ' . $e->getMessage());
        return response()->json([
            'status' => 500,
            'message' => 'Image upload failed',
            'error' => $e->getMessage()
        ], 500);
    }
}

}
