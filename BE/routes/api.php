<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\ButtonController;
use App\Http\Controllers\ListController;

Route::group(["prefix" => "v0.0.0"], function(){
    Route::post('/register',[AuthController:: class, "register"]);
    Route::post('/login',[AuthController:: class, "login"]);
    Route::post('/logout',[AuthController:: class, "logout"]);
    Route::post('/refresh',[AuthController:: class, "refresh"]);
    
    Route::post('/forget',[UserController:: class, "forgetPass"]);        

    Route::group(["middleware" => ["auth:api"]], function(){
        Route::post('/users',[UserController:: class, "getAllUsers"]);
        Route::post('/edit',[UserController:: class, "edit"]);
        Route::post('/profile',[UserController:: class, "profile"]);
        Route::post('/recover',[UserController:: class, "recover"]);        

        Route::post('/filter',[SearchController:: class, "filter"]);
        Route::post('/search',[SearchController:: class, "search"]);

        Route::post('/accept',[ButtonController:: class, "accept"]);
        Route::post('/block',[ButtonController:: class, "block"]);
        Route::post('/profile',[ButtonController:: class, "optionalProfile"]);

        Route::post('/blockList',[ListController:: class, "blocklist"]);
        Route::post('/favoriteList',[ListController:: class, "favoriteList"]);      
        Route::post('/notificationList',[ListController:: class, "notificationList"]);          
    });
});
