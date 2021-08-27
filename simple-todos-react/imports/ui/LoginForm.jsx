import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';

export const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const submit = event => {
        event.preventDefault(); // prevent page reload

        Meteor.loginWithPassword(username, password);
    };

    return (
        <form onSubmit={submit} className="login-form">
            <div>
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    placeholder="Username"
                    name="username"
                    required
                    value={username}
                    onChange={event => setUsername(event.target.value)}
                />
            </div>

            <div>
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    required
                    value={password}
                    onChange={event => setPassword(event.target.value)}
                />
            </div>

            <button type="submit">Log In</button>
        </form>
    );
};
