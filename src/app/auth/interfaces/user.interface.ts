
export interface User {
    password: string,
    email:    string,
    name:     string,
    
}

export interface LoginResponse {
    password: string,
    email:    string,
    name:     string,
    token:    string
}