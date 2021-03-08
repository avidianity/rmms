<?php

namespace App\Rules;

use App\Models\User;
use Illuminate\Contracts\Validation\Rule;

class Role implements Rule
{
    protected $roles;

    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct($roles)
    {
        $this->roles = $roles;
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        $user = User::findOrFail($value);
        return in_array($user->role, $this->roles);
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        $message = implode(', ', $this->roles);
        return "User should one of the following: {$message}";
    }
}
