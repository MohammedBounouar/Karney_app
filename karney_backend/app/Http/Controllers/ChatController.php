<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Chat;

class ChatController extends Controller
{
    
    public function index() {

        $messages = Chat::all();

        return response()->json([
            'status' => 200 ,
            'messages' => $messages,
        ]);
    }
    // Method to fetch messages based on receiver_id
    public function show($receiverId)
    {
        // Fetch messages where the receiver_id matches
        $messages = Chat::where('receiver_id', $receiverId)->get();

        if ($messages->isEmpty()) { // If no messages are found for the specified receiver_id
            return response()->json([
                'status' => 404,
                'message' => 'No messages found for receiver ID: ' . $receiverId,
            ], 404); // Return a 404 response with an appropriate message
        }

        return response()->json([
            'status' => 200,
            'messages' => $messages,
        ]); // Return a JSON response with the fetched messages
    }
}
