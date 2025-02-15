<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\StoreOwnerController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\TotalTransactionsController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\OwnerCustomerPivotController;
use App\Http\Controllers\PlanController;

use App\Http\Controllers\NotificationController;



/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::resource('Store_Owners' , StoreOwnerController::class);

Route::resource('Customers' , CustomerController::class);
Route::put('/Customers/{id}/update-image', [CustomerController::class, 'update']);

Route::post('Add_Customer_StoreOwner', [CustomerController::class, 'addCustomerStoreOwner']);
Route::resource('myCustomers' , OwnerCustomerPivotController::class);


Route::resource('Transactions' , TransactionController::class);
Route::resource('TotalTrans' , TotalTransactionsController::class);
Route::get('/store-owner/{storeOwnerId}/total-transactions', [StoreOwnerController::class, 'getTotalTransactions']);
Route::get('/store-owner/{storeOwnerId}/total-CustomersWithCredit', [StoreOwnerController::class, 'getCustomersWithCredit']);


Route::resource('Plans' , PlanController::class);
Route::get('/store-owner/plan/{StoreOwnerId}', [PlanController::class, 'displayOwnersPlan']);
Route::post('/update-customer-limit', [PlanController::class, 'updateCustomerLimit']);




Route::post('/send-notification', [NotificationController::class, 'notifyUser']);






Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
