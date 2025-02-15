<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StoreOwnerController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\CommentsController;


/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});
// Route::get('/login', function () {
//     return view('login');
// });

// Route::post('/check-value', [StoreOwnerController::class, 'checkValue'])->name('checkValue');
// Route::get('/customers', [CustomerController::class, 'display']);

Route::get('/', [CommentsController::class, 'index'])->name('comments.index');
Route::post('/', [CommentsController::class, 'store'])->name('comments.store');