<?php

namespace App\Http\Controllers;

use App\Models\File;
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
            'email' => ['required', 'email'],
            'password' => ['required', 'string', 'max:255'],
        ]);

        /**
         * @var User
         */
        $user = User::where('email', $data['email'])->first();

        if (!$user) {
            return response(['message' => 'Email does not exist.'], 404);
        }

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

    public function check(Request $request)
    {
        return $request->user();
    }

    public function update(Request $request)
    {
        /**
         * @var User
         */
        $user = $request->user();
        $data = $request->validate([
            'name' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', Rule::unique(User::class)->ignoreModel($user)],
            'password' => ['nullable', 'string', 'max:255'],
            'picture' => ['nullable', 'file'],
        ]);

        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $user->fill($data);

        if (isset($data['picture'])) {
            $old = $user->picture;
            $file = File::process($data['picture']);
            $file->save();
            $user->profile_picture_id = $file->id;
            $user->save();
            if ($old) {
                $old->delete();
            }
        }

        $user->save();

        $user->load('picture');

        return $user;
    }
}
