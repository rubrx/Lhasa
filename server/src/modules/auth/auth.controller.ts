import {Request, Response} from 'express';
import { registerUser, loginUser } from './auth.service';

export const register = async (req: Request, res: Response) => {
    const {name, email, phone, password, district} = req.body;

    try {
        const result = await registerUser({name, email, phone, password, district});

        res.status(201).json({
            message: 'Registration Successful',
            user: result.user,
            token: result.token
        })
    }
    catch (error: any){
        if(error.message === 'EMAIL_EXISTS'){
            res.status(409).json({message: 'email already exists'});
            return;
        }

        if(error.message === 'PHONE_EXISTS'){
            res.status(409).json({message: 'phone already exists'});
            return;
        }

        console.error('Registration Error', error);
        res.status(500).json({message: 'Internal server error'});
    }
}

export const login = async (req: Request, res: Response) => {
    const {email, phone, password} = req.body;

    try{
        const result = await loginUser({email, phone, password});

        res.status(200).json({
            message: 'Login successful',
            user: result.user,
            token: result.token,
        });
    }
    catch(error: any){
        if(error.message === 'INVALID_CREDENTIALS'){
            res.status(401).json({message: 'Invalid credentials'});
            return;
        }

        console.error('Login error', error);
        res.status(500).json({message: 'Internal server error'});
    }

}
