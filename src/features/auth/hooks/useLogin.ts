'use client';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import type { LoginInput } from '../types/auth.types';
import { saveSession } from '@/lib/auth';
export function useLogin() { return useMutation({ mutationFn: (input: LoginInput) => authService.login(input), onSuccess: (session) => saveSession(session) }); }
