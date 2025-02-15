<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comment;

class CommentsController extends Controller
{
    // Display all comments
    public function index()
    {
        $comments = Comment::all();
        return view('welcome')->with('comments', $comments);
    }

    // Add a new comment
    public function store(Request $request)
    
    {
        // Validate the request data
        $validatedData = $request->validate([
            'full_name' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        // Create a new comment instance and save it
        $comment = new Comment();
        $comment->full_name = $validatedData['full_name'];
        $comment->description = $validatedData['description'];
        $comment->save();

        // Redirect to the index view with a success message
        return redirect()->route('comments.index')->with('success', 'Comment added successfully!');
    }
}

