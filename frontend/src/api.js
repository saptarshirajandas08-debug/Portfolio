import { getToken } from './auth.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const ASSET_BASE = API_URL.replace(/\/api\/?$/, '');

async function handle(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Request failed (${res.status})`);
  }
  return res.json();
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ---------- public reads ----------
export const getProfile = () => fetch(`${API_URL}/profile`).then(handle);
export const getSkills = () => fetch(`${API_URL}/skills`).then(handle);
export const getProjects = () => fetch(`${API_URL}/projects`).then(handle);
export const getEducation = () => fetch(`${API_URL}/education`).then(handle);

// ---------- auth ----------
export function checkAdminExists() {
  return fetch(`${API_URL}/auth/exists`).then(handle);
}

export function register(email, password) {
  return fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  }).then(handle);
}

export function login(email, password) {
  return fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  }).then(handle);
}

// ---------- profile (admin) ----------
export function updateProfile(formData) {
  return fetch(`${API_URL}/profile`, {
    method: 'PUT',
    headers: { ...authHeaders() }, // no Content-Type — browser sets multipart boundary
    body: formData
  }).then(handle);
}

// ---------- skills (admin) ----------
export function createSkill(payload) {
  return fetch(`${API_URL}/skills`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload)
  }).then(handle);
}
export function updateSkill(id, payload) {
  return fetch(`${API_URL}/skills/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload)
  }).then(handle);
}
export function deleteSkill(id) {
  return fetch(`${API_URL}/skills/${id}`, {
    method: 'DELETE',
    headers: { ...authHeaders() }
  }).then(handle);
}

// ---------- projects (admin) ----------
export function createProject(formData) {
  return fetch(`${API_URL}/projects`, {
    method: 'POST',
    headers: { ...authHeaders() },
    body: formData
  }).then(handle);
}
export function updateProject(id, formData) {
  return fetch(`${API_URL}/projects/${id}`, {
    method: 'PUT',
    headers: { ...authHeaders() },
    body: formData
  }).then(handle);
}
export function deleteProject(id) {
  return fetch(`${API_URL}/projects/${id}`, {
    method: 'DELETE',
    headers: { ...authHeaders() }
  }).then(handle);
}

// ---------- education (admin) ----------
export function createEducation(payload) {
  return fetch(`${API_URL}/education`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload)
  }).then(handle);
}
export function updateEducation(id, payload) {
  return fetch(`${API_URL}/education/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload)
  }).then(handle);
}
export function deleteEducation(id) {
  return fetch(`${API_URL}/education/${id}`, {
    method: 'DELETE',
    headers: { ...authHeaders() }
  }).then(handle);
}