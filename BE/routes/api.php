<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use app\Http\Controllers\UserController;

Route::group(["prefix" => "v0.0.0"], function(){
    Route::group(["prefix" => "user"], function(){
        Route::post('/registration',[UserController:: class, "registration"]);
    });
});
