<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\MedicineController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\PrenatalRecordController;
use App\Http\Controllers\PrescriptionController;
use App\Http\Controllers\PurchaseRequestController;
use App\Http\Controllers\RecordController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::prefix('/auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/check', [AuthController::class, 'check']);
    });
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/users/search', [UserController::class, 'search']);
    Route::apiResources([
        'patients' => PatientController::class,
        'users' => UserController::class,
        'regular-records' => RecordController::class,
        'prenatal-records' => PrenatalRecordController::class,
    ]);

    Route::prefix('/pharmacy')->group(function () {
        Route::apiResources([
            'medicines' => MedicineController::class,
            'purchase-requests' => PurchaseRequestController::class,
            'prescriptions' => PrescriptionController::class,
        ]);
    });
});
