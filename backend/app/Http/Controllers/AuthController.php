<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', Rule::unique(User::class)],
            'password' => ['required', 'string', 'max:255'],
            'role' => ['required', 'string', Rule::in(User::ROLES)],
        ]);

        $data['password'] = Hash::make($data['password']);

        $user = User::create($data);

        $token = $user->createToken(Str::random());

        return [
            'user' => $user,
            'token' => $token->plainTextToken,
        ];
    }

    public function login(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'email', Rule::exists(User::class)],
            'password' => ['required', 'string', 'max:255'],
        ]);

        /**
         * @var User
         */
        $user = User::where('email', $data['email'])->first();

        if (!Hash::check($data['password'], $user->password)) {
            return response(['message' => 'Password is not correct.'], 403);
        }

        $token = $user->createToken(Str::random());

        return [
            'user' => $user,
            'token' => $token->plainTextToken,
        ];
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response('', 204);
    }
}
