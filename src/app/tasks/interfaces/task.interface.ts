
export interface Task {
    id:          string,
    generateId?:  string,
    taskName:    string,
    description: string,
    createAt:      Date,
    limitDate:     Date,
    status:      string,
    createdBy:   string,
}

export interface Status {
    creado: string,
    finalizado: string,
    incompleto: string,
    progreso: string,
}
