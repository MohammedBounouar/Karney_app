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
    // Find the customer by ID
    $customer = Customer::find($id);

    if (!$customer) {
        return response()->json([
            'status' => 404,
            'message' => 'Customer not found',
        ], 404);
    }

    // Validate the request (only image is required)
    $request->validate([
        'image' => 'image|mimes:jpeg,png,jpg', // Max 2MB
    ]);

    try {
        // Handle image upload
        if ($request->hasFile('image')) {
            // Ensure the directory exists
            if (!Storage::disk('public')->exists('profile_images')) {
                Storage::disk('public')->makeDirectory('profile_images');
                Log::info('Created profile_images directory.');
            }

            // Delete the old image if it exists
            if ($customer->image && Storage::disk('public')->exists($customer->image)) {
                Storage::disk('public')->delete($customer->image);
                Log::info('Deleted old image: ' . $customer->image);
            }

            // Generate a unique filename
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            Log::info('Generated image name: ' . $imageName);

            // Store the image in the 'profile_images' directory
            $imagePath = $image->storeAs('profile_images', $imageName, 'public');
            Log::info('Stored image at: ' . $imagePath);

            // Save the relative path to the database
            $customer->image = $imagePath;
            $customer->save();
            Log::info('Updated customer image in database: ' . $imagePath);
        }

        // Return a success response
        return response()->json([
            'status' => 200,
            'message' => 'Customer image updated successfully',
            'image_url' => asset('storage/' . $customer->image), // Full URL to the image
        ]);
    } catch (\Exception $e) {
        // Log the error
        Log::error('Error updating customer image: ' . $e->getMessage());

        // Return an error response
        return response()->json([
            'status' => 500,
            'message' => 'Failed to update customer image',
            'error' => $e->getMessage(),
        ], 500);
    }
}

}
