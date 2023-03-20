<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;

Route::group(["prefix" => "v0.0.0"], function(){
    Route::post('/register',[AuthController:: class, "register"]);
    Route::post('/login',[AuthController:: class, "login"]);
    Route::post('/logout',[AuthController:: class, "logout"]);
    Route::post('/refresh',[AuthController:: class, "refresh"]);
    
    Route::group(["middleware" => ["auth:api"]], function(){
        Route::get('/users',[UserController:: class, "getAllUsers"]);
        Route::post('/edit',[UserController:: class, "edit"]);
        Route::post('/filter',[SearchController:: class, "filter"]);
        Route::post('/search',[SearchController:: class, "search"]);
    });
});
